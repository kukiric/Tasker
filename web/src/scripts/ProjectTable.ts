import { ProjectStub, UserStub } from "api/stubs";
import * as moment from "moment";
import Vue from "vue";

export default Vue.extend({
    computed: {
        projects(): ProjectStub[] {
            let projects: ProjectStub[] = this.$store.state.allProjects;
            if (this.user) {
                projects = projects.sort((a, b) => {
                    // Manda os projetos do usuário atual para o topo
                    let inA = this.currentUserIsInProject(a);
                    let inB = this.currentUserIsInProject(b);
                    if (!inA && inB) {
                        return 1;
                    }
                    if (inA && !inB) {
                        return -1;
                    }
                    return 0;
                });
            }
            return projects;
        },
        user(): UserStub {
            return this.$store.state.currentUser;
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
        }
    }
});
