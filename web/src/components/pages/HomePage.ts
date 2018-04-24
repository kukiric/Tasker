import ProjectTable from "@/project/ProjectTable.vue";
import ProjectForm from "@/project/ProjectForm.vue";
import UserTable from "@/user/UserTable.vue";
import { UserStub } from "api/stubs";
import Vue from "vue";

export default Vue.extend({
    components: { ProjectTable, ProjectForm, UserTable },
    data() {
        return {
            showProjectModal: false
        };
    },
    computed: {
        isAdminOrManager(): boolean {
            let user = this.g.state.currentUser;
            if (user && user.role) {
                return user.role.name === "Admin" || user.role.name === "Manager";
            }
            return false;
        }
    }
});
