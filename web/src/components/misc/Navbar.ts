import { ProjectStub, UserStub, RoleType } from "api/stubs";
import { gravatar } from "@main/utils";
import Vue from "vue";

export default Vue.extend({
    computed: {
        user() {
            return this.$store.state.currentUser;
        },
        admin() {
            return this.user.role.id === RoleType.ADMIN;
        },
        userProjects() {
            return this.$store.getters.userProjects;
        },
        userIconClass() {
            if (this.user.role) {
                if (this.user.role.name === "Admin") {
                    return "yellow key icon";
                }
                else if (this.user.role.name === "Manager") {
                    return "blue folder icon";
                }
                else {
                    return "blue user icon";
                }
            }
            return "red dont icon";
        }
    },
    methods: {
        gravatar,
        logout() {
            this.$store.commit("setUserData", null);
            this.$store.commit("reset", null);
            this.$nextTick(() => {
                this.$router.push("/");
            });
        }
    }
});
