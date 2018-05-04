import { RoleType, TaskType, TaskStatus, AuthResponse, DecodedToken, TagStub } from "api/stubs";
import { ProjectStub, UserStub, TaskStub, WorkStub } from "api/stubs";
import { AxiosInstance, AxiosResponse } from "axios";
import * as JWT from "jsonwebtoken";
import * as moment from "moment";
import Vuex from "vuex";
import Vue from "vue";

// Informações que sempre são trazdias junto com as tarefas
const taskIncludes = "parent,users,work_items[user]";

// Classe que armazena todas as requisições pendentes e com erros
export class RequestLog {
    public pending: boolean[] = [];
    public errors: any[] = [];
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
            token: null,
            tags: null
        } as {
            requests: RequestLog,
            currentProject: ProjectStub & { error?: boolean } | null,
            currentUser: UserStub | null,
            allUsers: UserStub[] | null,
            token: string | null,
            tags: TagStub[] | null
        },
        getters: {
            userIsAdmin(context) {
                const user = context.currentUser;
                return user && user.role && user.role.id! <= RoleType.ADMIN;
            },
            userIsManager(context) {
                const user = context.currentUser;
                return user && user.role && user.role.id! <= RoleType.MANAGER;
            },
            projectId(context) {
                return context.currentProject && context.currentProject.id;
            },
            usersNotInProject(context) {
                const project = context.currentProject;
                if (project && project.users && context.allUsers) {
                    return context.allUsers.filter((u1) => {
                        return project.users!.some((u2) => u1.id === u2.id) === false;
                    });
                }
                return [];
            },
            rootTasks(context) {
                const project = context.currentProject;
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
            setTags(state, tags: TagStub[]) {
                state.tags = tags;
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
                state.requests.pending.push(true);
            },
            popRequest(state) {
                state.requests.pending.pop();
            },
            pushError(state, error: number) {
                state.requests.errors.push(error);
            }
        },
        actions: {
            async loadUser(store, token: string) {
                try {
                    // Busca o ID do usuário da token
                    let decodedToken = JWT.decode(token) as DecodedToken;
                    // Grava a token antes de prosseguir com a requisição
                    store.commit("setUserData", { user: null, token: token });
                    // Busca mais informações sobre o usuário da API a partir da token
                    let req = await http.get(`/api/users/${decodedToken.uid}?include=role,projects,tasks`);
                    // Grava as informações completas
                    store.commit("setUserData", { user: req.data, token: token });
                }
                catch (err) {
                    store.commit("setUserData", null);
                    throw err;
                }
            },
            async fetchProject(store, { id, refresh }: { id: number, refresh: boolean }) {
                try {
                    if (refresh) {
                        store.commit("setCurrentProject", null);
                    }
                    let req = await http.get(`/api/projects/${id}?include=users[role],tags,tasks[${taskIncludes}]`);
                    store.commit("setCurrentProject", req.data);
                }
                catch (err) {
                    store.commit("setCurrentProject", { error: true });
                    throw err;
                }
            },
            async updateProject(store, project: ProjectStub) {
                    // Cria o objeto com as novas informações do projeto
                let projectPartial = {
                    name: project.name,
                    status: project.status,
                    due_date: project.due_date
                };
                // Envia as informações para o servidor
                let req = await http.put(`/api/projects/${project.id}`, projectPartial);
                // Recarrega o projeto para exibição
                store.dispatch("fetchProject", { id: project.id, refresh: false });
            },
            async ensureAllUsersLoaded(store) {
                try {
                    if (!store.state.allUsers) {
                        let req = await http.get(`/api/users?include=role`);
                        store.commit("setAllUsers", req.data);
                    }
                }
                catch (err) {
                    store.commit("setAllUsers", null);
                    throw err;
                }
            },
            async ensureTagsLoaded(store) {
                try {
                    if (!store.state.tags) {
                        let req = await http.get(`/api/tags`);
                        store.commit("setTags", req.data);
                    }
                }
                catch (err) {
                    store.commit("setTags", null);
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
                    store.dispatch("fetchProject", { id: project.id, refresh: false });
                }
            },
            async createTask(store, parent: number) {
                let project = store.state.currentProject;
                if (project) {
                    let req = await http.post(`/api/projects/${project.id}/tasks`, {
                        title: "Nova tarefa",
                        estimate_work_hour: 10,
                        progress: 0,
                        status: TaskStatus.NEW,
                        type: TaskType.FEATURE,
                        description: "",
                        parent_id: parent,
                        due_date: moment().add(1, "week")
                    });
                    store.dispatch("fetchProject", { id: project.id, refresh: false });
                }
            },
            async updateTask(store, task: TaskStub) {
                let project = store.state.currentProject;
                if (project) {
                    // Cria o objeto com as novas informações da tarefa
                    let taskPartial = {
                        type: task.type,
                        status: task.status,
                        title: task.title,
                        due_date: task.due_date,
                        progress: task.progress,
                        description: task.description,
                        estimate_work_hour: task.estimate_work_hour
                    };
                    // Envia as informações para o servidor
                    let req = await http.put(`/api/projects/${project.id}/tasks/${task.id}`, taskPartial);
                    // Recarrega o projeto com as informações novas (TODO: achar e recarregar só a tarefa...)
                    store.dispatch("fetchProject", { id: project.id, refresh: false });
                }
            },
            async deleteTask(store, task: TaskStub) {
                let project = store.state.currentProject;
                if (project) {
                    let req = await http.delete(`/api/projects/${project.id}/tasks/${task.id}`);
                    store.dispatch("fetchProject", { id: project.id, refresh: false });
                }
            },
            async addWorkItem(store, { task, user, hours }: { task: TaskStub, user: UserStub, hours: number }) {
                let project = store.state.currentProject;
                if (project) {
                    let work = {
                        hours: hours,
                        start_time: moment().toDate(),
                        user_id: user.id
                    };
                    // Envia as informações para o servidor
                    let req = await http.post(`/api/projects/${project.id}/tasks/${task.id}/work_items`, work);
                    // Recarrega o projeto com as informações novas
                    store.dispatch("fetchProject", { id: project.id, refresh: false });
                }
            },
            async deleteWorkItem(store, { task, work}: { task: TaskStub, work: WorkStub }) {
                let project = store.state.currentProject;
                if (project) {
                    // Envia as informações para o servidor
                    let req = await http.delete(`/api/projects/${project.id}/tasks/${task.id}/work_items/${work.id}`);
                    // Recarrega o projeto com as informações novas
                    store.dispatch("fetchProject", { id: project.id, refresh: false });
                }
            }
        }
    });
}
