import ProjectTable from "@components/project/ProjectTable.vue";
import ProjectForm from "@components/project/ProjectForm.vue";
import UserTable from "@components/user/UserTable.vue";
import { UserStub, ProjectStub } from "api/stubs";
import Vue from "vue";

export default Vue.extend({
    components: { ProjectTable, ProjectForm, UserTable },
    data() {
        return {
            showProjectModal: false,
            projects: []
        } as {
            showProjectModal: boolean,
            projects: ProjectStub[]
        };
    },
    computed: {
        isAdminOrManager(): boolean {
            let getters = this.$store.getters;
            return getters.userIsAdmin || getters.userIsManager;
        }
    }
});
