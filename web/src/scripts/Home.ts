import ProjectTable from "@components/ProjectTable.vue";
import UserTable from "@components/UserTable.vue";
import { UserStub } from "api/stubs";
import Vue from "vue";

export default Vue.extend({
    components: { ProjectTable, UserTable },
    computed: {
        isAdmin() {
            let user: UserStub = this.$store.state.user;
            return user && user.role && user.role.name === "Admin";
        }
    }
});
