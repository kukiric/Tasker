import * as moment from "moment";
import Vue from "vue";

export default Vue.extend({
    data() {
        return {
           project: null
        };
    },
    props: {
        projectId: [ Number, String ]
    },
    methods: {
        date(date: string) {
            return moment(date).locale("pt-br").format("LL");
        },
        async reloadProject() {
            let id = this.$route.params.projectId;
            let req = await this.$http.get(`/api/projects/${id}?include=users,tasks[users]`);
            this.project = req.data ? req.data : { name: "Ocorreu um erro carregando o projeto" };
        }
    },
    watch: {
        "$route.params.projectId": function(to, from) {
            this.reloadProject();
        }
    },
    beforeMount() {
        this.reloadProject();
    }
});
