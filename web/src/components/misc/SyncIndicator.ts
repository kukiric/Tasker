import Vue from "vue";

export default Vue.extend({
    props: {
        size: { type: String }
    },
    computed: {
        syncState() {
            return 0;
        },
        status() {
            switch (this.syncState) {
                // Enviando
                case 1: return {
                    message: "Enviando informações...",
                    icon: { name: "sync", color: "blue "}
                };
                // Idle
                case 0: return {
                    message: "Tudo sincronizado! 😄",
                    icon: { name: "check circle", color: "green" }
                };
                // Erro
                default: return {
                    message: "Ocorreu um erro de sincronização! 😨\n\nCódigo do erro: " + (-this.syncState),
                    icon: { name: "close", color: "red" }
                };
            }
        }
    }
});
