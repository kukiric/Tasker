import { ProjectStub } from "api/stubs";
import * as moment from "moment";
import Vue from "vue";

export default Vue.extend({
    data() {
        let projects = Array<ProjectStub>();
        let user = { id: localStorage.getItem("user-id") };
        return { projects, user };
    },
    methods: {
        date(timestamp: string) {
            return moment(timestamp).locale("pt-br").format("LL");
        },
        time(timestamp: string) {
            return moment(timestamp).locale("pt-br").format("LLLL");
        },
        rowLink(project: ProjectStub) {
            return {
                name: 'ProjectDetails',
                params: {
                    projectId: project.id
                }
            };
        },
        inProject(project: ProjectStub) {
            return project.users!.some(user => {
                return parseInt(this.user.id!, 10) === user.id;
            });
        },
        async fetchProjects() {
            let userId = localStorage.getItem("user-id");
            let req = await this.$http.get(`/api/projects?include=manager,users`);
            let projects = Array.isArray(req.data) && req.data;
            if (projects) {
                this.projects = projects.sort((a, b) => {
                    return a.created_at > b.created_at ? 1 : -1;
                });
            }
        }
    },
    created() {
        this.fetchProjects();
    }
});
