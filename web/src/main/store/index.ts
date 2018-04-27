import { ProjectStub, UserStub, RoleType, TaskStub, AuthResponse } from "api/stubs";
import createPersistedState from "vuex-persistedstate";
import { AxiosInstance } from "axios";
import Vuex from "vuex";

const taskIncludes = "parent,users,work_items,children[users,work_items]";

export default function createStore(http: AxiosInstance) {
    return new Vuex.Store({
        plugins: [
            createPersistedState()
        ],
        state: {
            currentProject: null,
            currentUser: null,
            allUsers: null,
            token: null
        } as {
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
                    return state.allUsers.filter(u1 => {
                        return project.users!.some(u2 => u1.id === u2.id) === false;
                    });
                }
                return [];
            },
            rootTasks(state) {
                const project = state.currentProject;
                if (project && project.tasks) {
                    // Busca somente as tarefas sem pai
                    let rootTasks = project.tasks.filter(task => task.parent == null);
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
                    state.currentProject.users = state.currentProject.users.filter(u => {
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
                    task.users = task.users.filter(u => u.id !== user.id);
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
                }
                else {
                    state.currentUser = state.token = null;
                }
            },
            reset(state) {
                state.currentProject = null;
                state.currentUser = null;
                state.allUsers = null;
                state.token = null;
            }
        },
        actions: {
            async loadUser(context, data: AuthResponse) {
                try {
                    // Grava a token atual antes de prosseguir
                    context.commit("setUserData", { user: null, token: data.token });
                    // Busca mais informações sobre o usuário da API
                    let req = await http.get(`/api/users/${data.user.id}?include=role,projects,tasks`);
                    // Grava os dados no estado da aplicação
                    let user = req.data as UserStub;
                    context.commit("setUserData", { user, token: data.token });
                }
                catch (err) {
                    context.commit("setUserData", null);
                }
            },
            async fetchProject(context, projectId: number) {
                try {
                    let req = await http.get(`/api/projects/${projectId}?include=users[role],tasks[${taskIncludes}]`);
                    context.commit("setCurrentProject", req.data);
                }
                catch (err) {
                    context.commit("setCurrentProject", { error: true });
                }
            },
            async ensureAllUsersLoaded(context) {
                try {
                    if (!context.state.allUsers) {
                        let req = await http.get(`/api/users?include=role`);
                        context.commit("setAllUsers", req.data);
                    }
                }
                catch(err) {
                    context.commit("setAllUsers", null);
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
                            if (task.users && task.users.some(u => u.id === user.id)) {
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
                if (store.state.currentProject) {
                    let req = await http.post(`/api/projects/${store.state.currentProject.id}/tasks`, {
                        title: "Nova tarefa",
                        estimate_work_hour: 10,
                        progress: Math.random(),
                        status: "Nova",
                        type: "Funcionalidade",
                        description: "Descrição",
                        due_date: new Date()
                    });
                    store.dispatch("fetchProject", store.state.currentProject.id);
                }
            },
            async deleteTask(store, task: TaskStub) {
                if (store.state.currentProject) {
                    let req = await http.delete(`/api/projects/${store.state.currentProject.id}/tasks/${task.id}`);
                    store.dispatch("fetchProject", store.state.currentProject.id);
                }
            }
        }
    });
}
