import { ProjectStub } from "api/stubs";
import * as moment from "moment";
import Vue from "vue";

export default Vue.extend({
    computed: {
        projects(): ProjectStub[] {
            return this.$store.state.projects;
        },
        user() {
            return {
                id: localStorage.getItem("user-id")
            };
        }
    },
    methods: {
        date(timestamp: string) {
            return moment(timestamp).locale("pt-br").format("LL");
        },
        time(timestamp: string) {
            return moment(timestamp).locale("pt-br").format("LLLL");
        },
        currentUserIsInProject(project: ProjectStub) {
            return project.users!.some(user => {
                return parseInt(this.user.id!, 10) === user.id;
            });
        }
    }
});
