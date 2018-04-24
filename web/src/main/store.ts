import { ProjectStub, UserStub, RoleType, TaskStub } from "api/stubs";
import { AxiosInstance } from "axios";
import Vuex from "vuex";

const taskIncludes = "parent,users,work_items,children[users,work_items]";

export default function createStore(http: AxiosInstance) {
    return new Vuex.Store({
        state: {
            currentProject: null,
            currentUser: null,
            allUsers: []
        } as {
            currentProject: ProjectStub & { error?: boolean } | null,
            currentUser: UserStub | null,
            allUsers: UserStub[]
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
                if (project && project.users) {
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
            setCurrentUser(state, user: UserStub) {
                state.currentUser = user;
            },
            reset(state) {
                state.currentProject = null;
                state.currentUser = null;
                state.allUsers = [];
            }
        },
        actions: {
            async fetchProject(g, projectId: number) {
                try {
                    let req = await http.get(`/api/projects/${projectId}?include=users[role],tasks[${taskIncludes}]`);
                    g.commit("setCurrentProject", req.data);
                }
                catch (err) {
                    g.commit("setCurrentProject", { error: true });
                }
            },
            async addUser(g, user: UserStub) {
                let project = g.state.currentProject;
                if (project) {
                    let req = await http.post(`/api/projects/${project.id}/users`, { userId: user.id });
                    g.commit("addUser", user);
                }
            },
            async removeUser(g, user: UserStub) {
                let project = g.state.currentProject;
                if (project) {
                    let req = await http.delete(`/api/projects/${project.id}/users/${user.id}`);
                    g.commit("removeUser", user);
                    // Também remove o usuário de cada tarefa do projeto
                    // FIXME: operação custosa (fazer no servidor em versão futura)
                    if (project.tasks) {
                        for (let task of project.tasks) {
                            if (task.users && task.users.some(u => u.id === user.id)) {
                                g.dispatch("removeUserFromTask", { task, user });
                            }
                        }
                    }
                }
            },
            async addUserToTask(g, { task, user }: { task: TaskStub, user: UserStub }) {
                let project = g.state.currentProject;
                if (project && task) {
                    let req = await http.post(`/api/projects/${project.id}/tasks/${task.id}/users`, {
                        userId: user.id
                    });
                    g.commit("addUserToTask", { task, user });
                }
            },
            async removeUserFromTask(g, { task, user }: { task: TaskStub, user: UserStub }) {
                let project = g.state.currentProject;
                if (project && task) {
                    let req = await http.delete(`/api/projects/${project.id}/tasks/${task.id}/users/${user.id}`);
                    g.commit("removeUserFromTask", { task, user });
                }
            },
            async createTaskGroup(g) {
                if (g.state.currentProject) {
                    let req = await http.post(`/api/projects/${g.state.currentProject.id}/tasks`, {
                        title: "Nova tarefa",
                        estimate_work_hour: 10,
                        progress: Math.random(),
                        status: "Nova",
                        type: "Funcionalidade",
                        description: "Descrição",
                        due_date: new Date()
                    });
                    g.dispatch("fetchProject", g.state.currentProject.id);
                }
            },
            async deleteTask(g, task: TaskStub) {
                if (g.state.currentProject) {
                    let req = await http.delete(`/api/projects/${g.state.currentProject.id}/tasks/${task.id}`);
                    g.dispatch("fetchProject", g.state.currentProject.id);
                }
            }
        }
    });
}
