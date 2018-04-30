import { ProjectStub, UserStub, RoleType, TaskStub, AuthResponse, TaskType, TaskStatus, DecodedToken } from "api/stubs";
import { AxiosInstance, AxiosResponse } from "axios";
import * as JWT from "jsonwebtoken";
import * as moment from "moment";
import Vuex from "vuex";

// Informações que sempre são trazdias junto com as tarefas
const taskIncludes = "parent,users,work_items,children[users,work_items]";

// Classe que armazena todas as requisições pendentes e com erros
export class RequestLog {
    public pending: void[] = [];
    public errors: number[] = [];
}

// Chave usada para armazenar e buscar a token do local storage
export const tokenKey = "Tasker/api-token";

export default function createStore(http: AxiosInstance) {
    return new Vuex.Store({
        strict: process.env.NODE_ENV === "development",
        state: {
            requests: new RequestLog(),
            currentProject: null,
            currentUser: null,
            allUsers: null,
            token: null
        } as {
            requests: RequestLog,
            currentProject: ProjectStub & { error?: boolean } | null,
            currentUser: UserStub | null,
            allUsers: UserStub[] | null,
            token: string | null
        },
        getters: {
            userIsAdmin(state) {
                const user = state.currentUser;
                return user && user.role && user.role.id! <= RoleType.ADMIN;
            },
            userIsManager(state) {
                const user = state.currentUser;
                return user && user.role && user.role.id! <= RoleType.MANAGER;
            },
            projectId(state) {
                return state.currentProject && state.currentProject.id;
            },
            usersNotInProject(state) {
                const project = state.currentProject;
                if (project && project.users && state.allUsers) {
                    return state.allUsers.filter((u1) => {
                        return project.users!.some((u2) => u1.id === u2.id) === false;
                    });
                }
                return [];
            },
            rootTasks(state) {
                const project = state.currentProject;
                if (project && project.tasks) {
                    // Busca somente as tarefas sem pai
                    let rootTasks = project.tasks.filter((task) => task.parent == null);
                    // Ordena elas por ID
                    return rootTasks.sort((a, b) => a.id! - b.id!);
                }
                return [];
            }
        },
        mutations: {
            setCurrentProject(state, project: ProjectStub) {
                state.currentProject = project;
            },
            addUser(state, user: UserStub) {
                if (state.currentProject && state.currentProject.users) {
                    state.currentProject.users.push(user);
                }
            },
            removeUser(state, user: UserStub) {
                if (state.currentProject && state.currentProject.users) {
                    state.currentProject.users = state.currentProject.users.filter((u) => {
                        return u.id !== user.id;
                    });
                }
            },
            addUserToTask(state, { task, user }: { task: TaskStub, user: UserStub }) {
                if (task.users) {
                    task.users.push(user);
                }
            },
            removeUserFromTask(state, { task, user }: { task: TaskStub, user: UserStub }) {
                if (task.users) {
                    task.users = task.users.filter((u) => u.id !== user.id);
                }
            },
            setAllUsers(state, users: UserStub[]) {
                state.allUsers = users.sort((a, b) => {
                    return a.fullname! > b.fullname! ? 1 : -1;
                });
            },
            setUserData(state, data?: AuthResponse) {
                if (data) {
                    state.currentUser = data.user;
                    state.token = data.token;
                    localStorage.setItem(tokenKey, data.token);
                }
                else {
                    state.currentUser = state.token = null;
                    localStorage.removeItem(tokenKey);
                }
            },
            reset(state) {
                state.requests = new RequestLog();
                state.currentProject = null;
                state.currentUser = null;
                state.allUsers = null;
                state.token = null;
            },
            pushRequest(state) {
                state.requests.pending.push();
            },
            popRequest(state) {
                state.requests.pending.pop();
            },
            pushError(state, error: number) {
                state.requests.errors.push(error);
            }
        },
        actions: {
            async loadUser(context, token: string) {
                try {
                    // Busca o ID do usuário da token
                    let decodedToken = JWT.decode(token) as DecodedToken;
                    // Grava a token antes de prosseguir com a requisição
                    context.commit("setUserData", { user: null, token: token });
                    // Busca mais informações sobre o usuário da API a partir da token
                    let req = await http.get(`/api/users/${decodedToken.uid}?include=role,projects,tasks`);
                    // Grava as informações completas
                    context.commit("setUserData", { user: req.data, token: token });
                }
                catch (err) {
                    context.commit("setUserData", null);
                    throw err;
                }
            },
            async fetchProject(context, projectId: number) {
                try {
                    let req = await http.get(`/api/projects/${projectId}?include=users[role],tasks[${taskIncludes}]`);
                    context.commit("setCurrentProject", req.data);
                }
                catch (err) {
                    context.commit("setCurrentProject", { error: true });
                    throw err;
                }
            },
            async ensureAllUsersLoaded(context) {
                try {
                    if (!context.state.allUsers) {
                        let req = await http.get(`/api/users?include=role`);
                        context.commit("setAllUsers", req.data);
                    }
                }
                catch (err) {
                    context.commit("setAllUsers", null);
                    throw err;
                }
            },
            async addUser(store, user: UserStub) {
                let project = store.state.currentProject;
                if (project) {
                    let req = await http.post(`/api/projects/${project.id}/users`, { userId: user.id });
                    store.commit("addUser", user);
                }
            },
            async removeUser(store, user: UserStub) {
                let project = store.state.currentProject;
                if (project) {
                    let req = await http.delete(`/api/projects/${project.id}/users/${user.id}`);
                    store.commit("removeUser", user);
                    // Também remove o usuário de cada tarefa do projeto
                    // FIXME: operação custosa (fazer no servidor em versão futura)
                    if (project.tasks) {
                        for (let task of project.tasks) {
                            if (task.users && task.users.some((u) => u.id === user.id)) {
                                store.dispatch("removeUserFromTask", { task, user });
                            }
                        }
                    }
                }
            },
            async addUserToTask(store, { task, user }: { task: TaskStub, user: UserStub }) {
                let project = store.state.currentProject;
                if (project && task) {
                    let req = await http.post(`/api/projects/${project.id}/tasks/${task.id}/users`, {
                        userId: user.id
                    });
                    store.commit("addUserToTask", { task, user });
                }
            },
            async removeUserFromTask(store, { task, user }: { task: TaskStub, user: UserStub }) {
                let project = store.state.currentProject;
                if (project && task) {
                    let req = await http.delete(`/api/projects/${project.id}/tasks/${task.id}/users/${user.id}`);
                    store.commit("removeUserFromTask", { task, user });
                }
            },
            async createTaskGroup(store) {
                let project = store.state.currentProject;
                if (project) {
                    let req = await http.post(`/api/projects/${project.id}/tasks`, {
                        title: "Nova tarefa",
                        estimate_work_hour: 10,
                        progress: 0,
                        status: TaskStatus.NEW,
                        type: TaskType.FEATURE,
                        description: "",
                        due_date: moment().add(1, "week")
                    });
                    store.dispatch("fetchProject", project.id);
                }
            },
            async updateTask(store, task: TaskStub) {
                let project = store.state.currentProject;
                if (project) {
                    let taskPartial = {
                        type: task.type,
                        status: task.status,
                        title: task.title,
                        due_date: task.due_date,
                        progress: task.progress,
                        description: task.description
                    };
                    let req = await http.put(`/api/projects/${project.id}/tasks/${task.id}`, taskPartial);
                }
            },
            async deleteTask(store, task: TaskStub) {
                let project = store.state.currentProject;
                if (project) {
                    let req = await http.delete(`/api/projects/${project.id}/tasks/${task.id}`);
                    store.dispatch("fetchProject", project.id);
                }
            }
        }
    });
}
