import createStore from "@main/store";
import Vuex, { Store } from "vuex";

declare module "vue/types/vue" {
    interface Vue {
        store: ReturnType<typeof createStore>;
    }
}
