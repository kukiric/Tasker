import { ProjectStub, UserStub } from "api/stubs";
import * as moment from "moment";
import * as md5 from "md5";
import Vue from "vue";

export default Vue.extend({
    data() {
        return {
           showSidebar: false
        };
    },
    props: {
        projectId: [ Number, String ]
    },
    methods: {
        date(date: string) {
            return moment(date).format("LL");
        },
        gravatar(email: string) {
            return `https://www.gravatar.com/avatar/${md5(email)}?s=32&d=identicon`;
        },
        async reloadProject() {
            await this.g.dispatch("fetchProject", this.projectId);
        },
        async addUser(user: UserStub) {
            await this.g.dispatch("sendUser", user);
        },
        async removeUser(user: UserStub) {
            await this.g.dispatch("deleteUser", user);
        }
    },
    computed: {
        allUsers(): any[] {
            return this.g.state.allUsers;
        },
        project(): ProjectStub | null {
            return this.g.state.currentProject;
        },
        isLate(): null | boolean {
            return this.project
                && this.project.status !== "Concluído"
                && moment().isAfter(this.project.due_date, "day");
        }
    },
    watch: {
        "$route.params.projectId": function(to, from) {
            this.reloadProject();
        }
    },
    created() {
        this.reloadProject();
    }
});
