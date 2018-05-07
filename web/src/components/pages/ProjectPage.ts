import { ProjectStub, UserStub, ProjectStatus, TaskStub, TagStub } from "api/stubs";
import ProjectOverview from "@components/project/ProjectOverview.vue";
import SyncIndicator from "@components/misc/SyncIndicator.vue";
import EditableText from "@components/misc/EditableText.vue";
import ErrorPage from "@components/pages/ErrorPage.vue";
import { mapGetters, mapState } from "vuex";
import { differenceWith } from "lodash";
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
        project() {
            return this.$store.state.currentProject;
        },
        projectStatusList() {
            return Object.values(ProjectStatus);
        },
        availableTags() {
            let allTags = this.$store.state.tags;
            let availableTags = differenceWith<any>(allTags, this.project.tags, (a, b) => a.id === b.id);
            return utils.dropdownItems(availableTags, "name");
        },
        availableUsers() {
            let project = this.project;
            if (project) {
                let allUsers = this.$store.state.allUsers;
                return differenceWith<any>(allUsers, project.users, (a, b) => a.id === b.id);
            }
            return [];
        }
    },
    methods: {
        ...utils,
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
        updateCreatedAt(date: Date) {
            if (this.project) {
                this.sendUpdate({ ...this.project, created_at: moment(date).toDate() });
            }
        },
        updateDueDate(date: Date) {
            if (this.project) {
                this.sendUpdate({ ...this.project, due_date: moment(date).toDate() });
            }
        },
        dragStartUser(event: DragEvent, user: UserStub) {
            let target = event.target as HTMLElement;
            target.classList.add("transparent");
            event.dataTransfer.setData("addUserRequest", JSON.stringify(user));
        },
        dragEndUser(event: DragEvent) {
            let target = event.target as HTMLElement;
            target.classList.remove("transparent");
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
