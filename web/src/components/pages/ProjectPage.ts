import { ProjectStub, UserStub, ProjectStatus, TaskStub, TagStub } from "api/stubs";
import ProjectOverview from "@components/project/ProjectOverview.vue";
import ProjectSidebar from "@components/project/ProjectSidebar.vue";
import SyncIndicator from "@components/misc/SyncIndicator.vue";
import EditableText from "@components/misc/EditableText.vue";
import ErrorPage from "@components/pages/ErrorPage.vue";
import { isLate, dropdownItems, date } from "@main/utils";
import { mapGetters, mapState } from "vuex";
import { differenceWith } from "lodash";
import * as moment from "moment";
import Vue from "vue";

export default Vue.extend({
    components: { ProjectOverview, ProjectSidebar, SyncIndicator, EditableText, ErrorPage },
    props: {
        projectId: [ Number, String ]
    },
    computed: {
        project() {
            return this.$store.state.currentProject;
        },
        projectStatusList() {
            return Object.values(ProjectStatus);
        },
        availableTags() {
            let allTags = this.$store.state.tags;
            let availableTags = differenceWith<any>(allTags, this.project.tags, (a, b) => a.id === b.id);
            return dropdownItems(availableTags, "name");
        }
    },
    methods: {
        isLate, dropdownItems, date,
        async reloadProject(refresh: boolean = true) {
            await this.$store.dispatch("fetchProject", { id: this.projectId, refresh });
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
        updateCreatedAt(value: Date) {
            if (this.project) {
                this.sendUpdate({ ...this.project, created_at: moment(value).toDate() });
            }
        },
        updateDueDate(value: Date) {
            if (this.project) {
                this.sendUpdate({ ...this.project, due_date: moment(value).toDate() });
            }
        },
        async addTag(tagId: number) {
            await this.$http.post(`/api/projects/${this.project.id}/tags`, { tagId });
            await this.reloadProject(false);
        },
        async removeTag(tagId: number) {
            await this.$http.delete(`/api/projects/${this.project.id}/tags/${tagId}`);
            await this.reloadProject(false);
        }
    },
    watch: {
        "$route.params.projectId": function(to, from) {
            this.reloadProject();
        }
    },
    created() {
        this.$store.dispatch("ensureAllUsersLoaded");
        this.$store.dispatch("ensureTagsLoaded");
        this.reloadProject();
    }
});
