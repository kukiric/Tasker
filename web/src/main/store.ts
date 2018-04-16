import { ProjectStub, UserStub } from "api/stubs";
import Vuex from "vuex";

export default function createStore() {
    return new Vuex.Store({
        state: {
            allProjects: [],
            currentProject: [],
            allUsers: [],
            currentUser: null
        } as {
            allProjects: ProjectStub[],
            currentProject: ProjectStub | null,
            allUsers: UserStub[],
            currentUser: UserStub | null
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
        }
    });
}
