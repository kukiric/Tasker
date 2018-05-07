import { ProjectStub, UserStub } from "api/stubs";
import { isLate, isDone, time, date } from "@main/utils";
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
        isLate,
        isDone,
        time,
        date,
        async loadProjects(): Promise<ProjectStub[]> {
            let req = await this.$http.get(`/api/projects?include=manager,tags`);
            let projects = req.data as ProjectStub[];
            return projects.sort((a, b) => a.name > b.name ? 1 : -1);
        }
    },
    created() {
        this.loadProjects().then((projects) => this.projects = projects);
    }
});
