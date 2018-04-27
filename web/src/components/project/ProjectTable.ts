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
        async loadProjects(): Promise<ProjectStub[]> {
            let req = await this.$http.get(`/api/projects?include=manager`);
            let projects = req.data as ProjectStub[];
            return projects.sort((a, b) => a.name > b.name ? 1 : -1);
        }
    },
    created() {
        this.loadProjects().then(projects => this.projects = projects);
    }
});
