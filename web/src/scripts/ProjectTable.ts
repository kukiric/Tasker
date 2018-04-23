import { ProjectStub, UserStub } from "api/stubs";
import * as moment from "moment";
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
            return this.g.state.currentUser!;
        }
    },
    methods: {
        date(timestamp: string) {
            return moment(timestamp).format("LL");
        },
        time(timestamp: string) {
            return moment(timestamp).format("LLLL");
        },
        isLate(project: ProjectStub) {
            return project.status !== "Concluído" && moment().isAfter(project.due_date, "day");
        },
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
                    let req = await this.http.get(`/api/projects?include=manager,users`);
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
