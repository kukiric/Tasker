import { ProjectStub, UserStub } from "api/stubs";
import utils from "@main/utils";
import Vue from "vue";

export default Vue.extend({
    data() {
        return {
            projects: []
        } as {
            projects: ProjectStub[] | { error: boolean }
        };
    },
    computed: {
        user(): UserStub {
            return this.$store.state.currentUser!;
        }
    },
    methods: {
        ...utils,
        isDone(project: ProjectStub) {
            return project.status === "Concluído";
        },
        currentUserIsInProject(project: ProjectStub) {
            if (this.user && project.users) {
                return project.users.some(user => this.user.id === user.id);
            }
            return false;
        },
        async fetchProjects() {
            let userId = localStorage.getItem("user-id");
            if (userId) {
                try {
                    let req = await this.$http.get(`/api/projects?include=manager,users`);
                    let projects: ProjectStub[] = req.data;
                    // Ordena os projetos alfabeticamente
                    this.projects = projects.sort((a, b) => {
                        return a.name! > b.name! ? 1 : -1;
                    });
                }
                catch (err) {
                    this.projects = { error: true };
                }
            }
        }
    },
    created() {
        this.fetchProjects();
    }
});
