import ProjectTable from "@components/ProjectTable.vue";
import ProjectForm from "@components/ProjectForm.vue";
import UserTable from "@components/UserTable.vue";
import { UserStub } from "api/stubs";
import Vue from "vue";

export default Vue.extend({
    components: { ProjectTable, UserTable, ProjectForm },
    data() {
        return {
            showProjectModal: false
        };
    },
    computed: {
        isAdminOrManager(): boolean {
            let user = this.store.state.currentUser;
            if (user && user.role) {
                return user.role.name === "Admin" || user.role.name === "Manager";
            }
            return false;
        }
    }
});
