import { ProjectStub, UserStub } from "api/stubs";
import { mapState } from "vuex";
import Vue from "vue";

export default Vue.extend({
    methods: {
        logout() {
            localStorage.clear();
            window.location.reload();
        }
    },
    computed: {
        user(): UserStub {
            return this.g.state.currentUser!;
        },
        projects(): ProjectStub[] {
            return this.g.state.currentUser!.projects!;
        },
        myProjects(): any[] {
            let currentUser = this.g.state.currentUser;
            if (currentUser) {
                let projects = currentUser.projects!;
                projects = projects.sort((a, b) => {
                    return a.name! > b.name! ? 1 : -1;
                });
                return projects.map(p => ({
                    key: p.id,
                    text: p.name,
                    value: p.id
                }));
            }
            return [];
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