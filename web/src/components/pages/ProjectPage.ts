import { ProjectStub, UserStub } from "api/stubs";
import ProjectOverview from "@components/project/ProjectOverview.vue";
import ErrorPage from "@components/pages/ErrorPage.vue";
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
            await this.$store.dispatch("fetchProject", this.projectId);
        },
        async addUser(user: UserStub) {
            await this.$store.dispatch("addUser", user);
        },
        async removeUser(user: UserStub) {
            await this.$store.dispatch("removeUser", user);
        }
    },
    computed: {
        allUsers(): any[] {
            return this.$store.state.allUsers;
        },
        project(): ProjectStub | null {
            return this.$store.state.currentProject;
        }
    },
    watch: {
        "$route.params.projectId": function(to, from) {
            this.reloadProject();
        }
    },
    created() {
        this.reloadProject();
        this.$store.dispatch("ensureAllUsersLoaded");
    }
});
