import Vue from "vue";
import { ProjectStub, UserStub } from "api/stubs";

export default Vue.extend({
    methods: {
        logout() {
            localStorage.clear();
            window.location.reload();
        }
    },
    computed: {
        projects(): ProjectStub[] {
            if (this.$store.state.user) {
                return this.$store.state.user.projects;
            }
            return [];
        },
        user(): UserStub {
            return this.$store.state.user;
        },
        userIconClass() {
            if (this.user.role) {
                if (this.user.role!.name === "Admin") {
                    return "key icon";
                }
                else if (this.user.role!.name === "Manager") {
                    return "folder icon";
                }
                else {
                    return "user icon";
                }
            }
            return "red dont icon";
        }
    }
});
