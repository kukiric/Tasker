import Vue from "vue";
import { ProjectStub, UserStub } from "api/stubs";

export default Vue.extend({
    methods: {
        logout() {
            localStorage.clear();
            window.location.reload();
        },
        hello() {
            console.log("Hello");
            console.log(arguments);
        }
    },
    computed: {
        projects(): ProjectStub[] {
            if (this.$store.state.user) {
                let projects: ProjectStub[] = this.$store.state.user.projects;
                projects = projects.sort((a, b) => {
                    return a.name > b.name ? 1 : -1;
                });
                return projects;
            }
            return [];
        },
        user(): UserStub {
            return this.$store.state.user;
        },
        myProjects() {
            if (this.$store.state.user) {
                let projects: ProjectStub[] = this.$store.state.user.projects;
                projects = projects.sort((a, b) => {
                    return a.name > b.name ? 1 : -1;
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
