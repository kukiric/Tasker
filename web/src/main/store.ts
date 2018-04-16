import { ProjectStub, UserStub } from "api/stubs";
import Vuex from "vuex";

export default {
    create() {
        return new Vuex.Store({
            state: {
                projects: [],
                users: [],
                user: null
            } as {
                projects: ProjectStub[],
                users: UserStub[],
                user: UserStub | null
            },
            mutations: {
                setProjects(state, projects: ProjectStub[]) {
                    state.projects = projects.sort((a, b) => {
                        return a.name! > b.name! ? 1 : -1;
                    });
                },
                appendProject(state, project: ProjectStub) {
                    state.projects = state.projects.concat(project).sort((a, b) => {
                        return a.name! > b.name! ? 1 : -1;
                    });
                },
                setAllUsers(state, users: UserStub[]) {
                    state.users = users.sort((a, b) => {
                        return a.fullname! > b.fullname! ? 1 : -1;
                    });
                },
                setUser(state, user: UserStub) {
                    state.user = user;
                },
                reset(state) {
                    state.projects = [];
                    state.user = null;
                }
            }
        });
    }
};
