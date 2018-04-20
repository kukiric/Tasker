import { ProjectStub, UserStub, RoleType } from "api/stubs";
import { AxiosInstance } from "axios";
import Vuex from "vuex";
import ProjectContents from "@scripts/ProjectContents";

export default function createStore(http: AxiosInstance) {
    return new Vuex.Store({
        state: {
            allProjects: [],
            currentProject: null,
            allUsers: [],
            currentUser: null
        } as {
            allProjects: ProjectStub[],
            currentProject: ProjectStub & { error?: boolean } | null,
            allUsers: UserStub[],
            currentUser: UserStub | null
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
            userIsUnlocked(state) {
                const user = state.currentUser;
                return user && user.role != null;
            },
            usersNotInProject(state) {
                const project = state.currentProject;
                if (project && project.error && project.users) {
                    return state.allUsers.filter(u1 => {
                        return project.users!.some(u2 => u1.id === u2.id) === false;
                    });
                }
                return [];
            },
            rootTasks(state) {
                const project = state.currentProject;
                if (project && project.tasks) {
                    return project.tasks.filter(task => task.parent == null);
                }
                return [];
            }
        },
        mutations: {
            setAllProjects(state, projects: ProjectStub[]) {
                state.allProjects = projects.sort((a, b) => {
                    return a.name! > b.name! ? 1 : -1;
                });
            },
            appendProject(state, project: ProjectStub) {
                state.allProjects = state.allProjects.concat(project).sort((a, b) => {
                    return a.name! > b.name! ? 1 : -1;
                });
            },
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
            setAllUsers(state, users: UserStub[]) {
                state.allUsers = users.sort((a, b) => {
                    return a.fullname! > b.fullname! ? 1 : -1;
                });
            },
            setCurrentUser(state, user: UserStub) {
                state.currentUser = user;
            },
            reset(state) {
                state.allProjects = [];
                state.currentProject = null;
                state.allUsers = [];
                state.currentUser = null;
            }
        },
        actions: {
            async fetchProject(g, projectId: number) {
                const taskIncludes = "tasks[parent,users,work_items,children]";
                try {
                    let req = await http.get(`/api/projects/${projectId}?include=users[role],${taskIncludes}`);
                    g.commit("setCurrentProject", req.data);
                }
                catch (err) {
                    g.commit("setCurrentProject", { error: true });
                }
            },
            async sendUser(g, user: UserStub) {
                if (g.state.currentProject) {
                    let req = await http.post(`/api/projects/${g.state.currentProject.id}/users`, { userId: user.id });
                    g.commit("addUser", user);
                }
            },
            async deleteUser(g, user: UserStub) {
                if (g.state.currentProject) {
                    let req = await http.delete(`/api/projects/${g.state.currentProject.id}/users/${user.id}`);
                    g.commit("removeUser", user);
                }
            }
        }
    });
}
