import { ProjectStub, UserStub } from "api/stubs";
import ProjectOverview from "@/project/ProjectOverview.vue";
import ErrorPage from "@/pages/ErrorPage.vue";
import utils from "@main/utils";
import Vue from "vue";

export default Vue.extend({
    components: { ProjectOverview, ErrorPage },
    data() {
        return {
           showSidebar: false
        };
    },
    props: {
        projectId: [ Number, String ]
    },
    methods: {
        ...utils,
        async reloadProject() {
            await this.g.dispatch("fetchProject", this.projectId);
        },
        async addUser(user: UserStub) {
            await this.g.dispatch("addUser", user);
        },
        async removeUser(user: UserStub) {
            await this.g.dispatch("removeUser", user);
        }
    },
    computed: {
        allUsers(): any[] {
            return this.g.state.allUsers;
        },
        project(): ProjectStub | null {
            return this.g.state.currentProject;
        }
    },
    watch: {
        "$route.params.projectId": function(to, from) {
            this.reloadProject();
        }
    },
    created() {
        this.reloadProject();
    }
});
