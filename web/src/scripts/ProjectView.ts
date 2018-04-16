import { ProjectStub, UserStub } from "api/stubs";
import * as moment from "moment";
import * as md5 from "md5";
import Vue from "vue";

export default Vue.extend({
    data() {
        return {
           project: null,
           showSidebar: false
        } as {
            project: ProjectStub | null,
            showSidebar: boolean
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
            let id = this.$route.params.projectId;
            let req = await this.$http.get(`/api/projects/${id}?include=users[role],tasks[users]`);
            this.project = req.data ? req.data : { name: "Ocorreu um erro carregando o projeto" };
        }
    },
    computed: {
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
