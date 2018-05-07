import { RequestConfig } from "@main/axios";
import { RequestLog } from "@main/store";
import Vue from "vue";

function stringifyRequest(config: RequestConfig) {
    return `➔ ${config.method.toUpperCase()} ${config.url}`;
}

export default Vue.extend({
    props: {
        size: { type: String }
    },
    computed: {
        requests() {
            return this.$store.state.requests;
        },
        syncState() {
            let requests: RequestLog = this.requests;
            if (requests.errors.length > 0) {
                return {
                    code: -1,
                    info: requests.errors.map((err) => JSON.stringify(err, null, 2)).join("\n")
                };
            }
            else if (requests.pending.length > 0) {
                return {
                    code: 1,
                    info: requests.pending.map((config) => stringifyRequest(config)).join("\n")
                };
            }
            else {
                return {
                    code: 0,
                    info: ""
                };
            }
        },
        status() {
            let state = this.syncState;
            switch (state.code) {
                // Enviando
                case 1: return {
                    message: "Sincronizando...\n\n" + state.info,
                    icon: { name: "sync", color: "blue" }
                };
                // Idle
                case 0: return {
                    message: "Tudo sincronizado! 😄",
                    icon: { name: "check circle", color: "green" }
                };
                // Erro
                default: return {
                    message: "Ocorreram erros durante a sincronização! 😨\n\n" + state.info,
                    icon: { name: "close", color: "red" }
                };
            }
        }
    }
});
