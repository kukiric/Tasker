import { RequestConfig, ResponseError } from "@main/axios";
import { RequestLog } from "@main/store";
import Vue from "vue";

enum SyncCode {
    SENDING,
    ERROR,
    OK
}

function stringifyRequest(config: RequestConfig, err?: ResponseError) {
    if (err) {
        return `*** ${config.method.toUpperCase()} ${config.url} - Error ${err.response.status} ***`;
    }
    else {
        return `➔ ${config.method.toUpperCase()} ${config.url}`;
    }
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
            let info = "";
            let code = SyncCode.OK;
            if (requests.pending.length > 0) {
                info += requests.pending.map((config) => stringifyRequest(config)).join("\n");
                code = SyncCode.SENDING;
            }
            if (requests.errors.length > 0) {
                info += requests.errors.map((err) => stringifyRequest(err.config, err)).join("\n");
                code = SyncCode.ERROR;
            }
            return { info, code };
        },
        status() {
            let state = this.syncState;
            switch (state.code) {
                case SyncCode.SENDING: return {
                    message: "Sincronizando...\n\n" + state.info,
                    icon: { name: "sync", color: "blue" }
                };
                case SyncCode.OK: return {
                    message: "Tudo sincronizado! 😄",
                    icon: { name: "check circle", color: "green" }
                };
                default: return {
                    message: "Ocorreram erros durante a sincronização! 😨\n\n" + state.info,
                    icon: { name: "close", color: "red" }
                };
            }
        }
    }
});
