import Vue from "vue";

export default Vue.extend({
    computed: {
        user() {
            return {
                username: localStorage.getItem("username"),
                fullname: localStorage.getItem("fullname"),
                role: localStorage.getItem("user-role")
            };
        },
        userIconClass() {
            if (this.user.role === "Admin") {
                return "key icon";
            }
            else if (this.user.role === "Manager") {
                return "folder icon";
            }
            else {
                return "user icon";
            }
        }
    }
});
