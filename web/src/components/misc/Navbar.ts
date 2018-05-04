import { ProjectStub, UserStub } from "api/stubs";
import { mapState } from "vuex";
import utils from "@main/utils";
import Vue from "vue";

export default Vue.extend({
    computed: {
        ...mapState([ "currentUser" ]),
        user() {
            return this.currentUser;
        },
        projects() {
            return this.currentUser.projects;
        },
        myProjects() {
            if (this.currentUser) {
                let projects = this.projects;
                projects = projects.sort((a: ProjectStub, b: ProjectStub) => {
                    return a.name > b.name ? 1 : -1;
                });
                return utils.dropdownItems(projects, "name");
            }
            return [];
        },
        userIconClass() {
            if (this.user.role) {
                if (this.user.role.name === "Admin") {
                    return "key icon";
                }
                else if (this.user.role.name === "Manager") {
                    return "folder icon";
                }
                else {
                    return "user icon";
                }
            }
            return "red dont icon";
        }
    },
    methods: {
        ...utils,
        logout() {
            localStorage.clear();
            window.location.reload();
        }
    }
});
