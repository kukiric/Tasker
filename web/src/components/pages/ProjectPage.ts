import { ProjectStub, UserStub, ProjectStatus } from "api/stubs";
import ProjectOverview from "@components/project/ProjectOverview.vue";
import SyncIndicator from "@components/misc/SyncIndicator.vue";
import EditableText from "@components/misc/EditableText.vue";
import ErrorPage from "@components/pages/ErrorPage.vue";
import * as moment from "moment";
import utils from "@main/utils";
import Vue from "vue";

export default Vue.extend({
    components: { ProjectOverview, SyncIndicator, EditableText, ErrorPage },
    data() {
        return {
           showSidebar: false
        };
    },
    props: {
        projectId: [ Number, String ]
    },
    computed: {
        allUsers(): any[] {
            return this.$store.state.allUsers;
        },
        project(): ProjectStub | null {
            return this.$store.state.currentProject;
        },
        projectStatusList() {
            return Object.values(ProjectStatus);
        }
    },
    methods: {
        ...utils,
        async reloadProject() {
            await this.$store.dispatch("fetchProject", { id: this.projectId, refresh: true });
        },
        async addUser(user: UserStub) {
            await this.$store.dispatch("addUser", user);
        },
        async removeUser(user: UserStub) {
            await this.$store.dispatch("removeUser", user);
        },
        async sendUpdate(newValues: ProjectStub) {
            await this.$store.dispatch("updateProject", newValues);
        },
        updateName(name: string) {
            if (this.project) {
                this.sendUpdate({ ...this.project, name });
            }
        },
        updateStatus(status: string) {
            if (this.project) {
                this.sendUpdate({ ...this.project, status });
            }
        },
        updateCreatedAt(date: Date) {
            if (this.project) {
                this.sendUpdate({ ...this.project, created_at: moment(date).toDate() });
            }
        },
        updateDueDate(date: Date) {
            if (this.project) {
                this.sendUpdate({ ...this.project, due_date: moment(date).toDate() });
            }
        }
    },
    watch: {
        "$route.params.projectId": function(to, from) {
            this.reloadProject();
        }
    },
    created() {
        this.$store.dispatch("ensureAllUsersLoaded");
        this.reloadProject();
    }
});
