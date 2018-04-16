import { ProjectStub, UserStub } from "api/stubs";
import Vuex from "vuex";

export default {
    create() {
        return new Vuex.Store({
            state: {
                allProjects: [],
                currentProject: [],
                allUsers: [],
                currentUser: null
            } as {
                allProjects: ProjectStub[],
                currentProject: ProjectStub,
                allUsers: UserStub[],
                currentUser: UserStub | null
            },
            mutations: {
                setProjects(state, projects: ProjectStub[]) {
                    state.allProjects = projects.sort((a, b) => {
                        return a.name! > b.name! ? 1 : -1;
                    });
                },
                appendProject(state, project: ProjectStub) {
                    state.allProjects = state.allProjects.concat(project).sort((a, b) => {
                        return a.name! > b.name! ? 1 : -1;
                    });
                },
                setAllUsers(state, users: UserStub[]) {
                    state.allUsers = users.sort((a, b) => {
                        return a.fullname! > b.fullname! ? 1 : -1;
                    });
                },
                setUser(state, user: UserStub) {
                    state.currentUser = user;
                },
                reset(state) {
                    state.allProjects = [];
                    state.currentUser = null;
                    state.allUsers = [];
                }
            }
        });
    }
};
