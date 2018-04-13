import { ProjectStub, UserStub } from "api/stubs";
import Vuex from "vuex";

export default {
    create() {
        return new Vuex.Store({
            state: {
                projects: [],
                user: null
            } as {
                projects: ProjectStub[],
                user: UserStub | null
            },
            mutations: {
                setProjects(state, projects: ProjectStub[]) {
                    state.projects = projects.sort((a, b) => {
                        return a.name > b.name ? 1 : -1;
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
