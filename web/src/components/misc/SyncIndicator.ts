import { RequestLog } from "@main/store";
import { mapState } from "vuex";
import Vue from "vue";

export default Vue.extend({
    props: {
        size: { type: String }
    },
    computed: {
        ...mapState([ "requests" ]),
        syncState() {
            let requests: RequestLog = this.requests;
            if (requests.errors.length > 0) {
                return requests.errors.slice(-1)[0];
            }
            else if (requests.pending.length > 0) {
                return 1;
            }
            else {
                return 0;
            }
        },
        status() {
            switch (this.syncState) {
                // Enviando
                case 1: return {
                    message: "Sincronizando...",
                    icon: { name: "sync", color: "blue" }
                };
                // Idle
                case 0: return {
                    message: "Tudo sincronizado! 😄",
                    icon: { name: "check circle", color: "green" }
                };
                // Erro
                default: return {
                    message: "Ocorreu um erro de sincronização! 😨\n\nCódigo do erro: " + this.syncState,
                    icon: { name: "close", color: "red" }
                };
            }
        }
    }
});
