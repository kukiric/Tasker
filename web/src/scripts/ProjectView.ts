import { ProjectStub } from "api/stubs";
import * as moment from "moment";
import Vue from "vue";

export default Vue.extend({
    data() {
        return {
           project: null
        } as {
            project: ProjectStub | null
        };
    },
    props: {
        projectId: [ Number, String ]
    },
    methods: {
        date(date: string) {
            return moment(date).format("LL");
        },
        async reloadProject() {
            let id = this.$route.params.projectId;
            let req = await this.$http.get(`/api/projects/${id}?include=users,tasks[users]`);
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
