import * as moment from "moment";
import Vue from "vue";

// Seta a região do moment.js
moment.locale("pt-br");

// Define as funções de carregar dados globais (temp)
async function loadUser(vue: Vue) {
    let userId = localStorage.getItem("user-id");
    if (userId) {
        let req = await vue.$http.get(`/api/users/${userId}?include=role,projects,tasks`);
        if (req.data) {
            vue.$store.commit("setCurrentUser", req.data);
        }
    }
}

async function loadAllUsers(vue: Vue) {
    let req = await vue.$http.get(`/api/users?include=role`);
    if (req.data) {
        vue.$store.commit("setAllUsers", req.data);
    }
}

// Adiciona a instância configurada do axios na aplicação
import axios from "@main/axios";
Vue.prototype.$http = axios;
Vue.prototype.initUserData = (vue: Vue) => {
    loadUser(vue);
    loadAllUsers(vue);
};

// Adiciona o Vuex para gerenciar estados
import createStore from "@main/store";
import Vuex from "vuex";
Vue.use(Vuex);

// Adiciona os components do semantic-ui-vue
import SuiVue from "semantic-ui-vue";
import { isMoment } from "moment";
Vue.use(SuiVue);

const store = createStore(axios);

import VueRouter from "vue-router";
import router from "@main/router";

// Adiciona o plugin do router na aplicação
Vue.use(VueRouter);

import Layout from "@components/Layout.vue";

// Cria e monta a aplicação no documento
let app = new Vue({
    el: "#app",
    store: store,
    router: router,
    components: { Layout },
    template: "<Layout/>",
    beforeMount() {
        if (localStorage.getItem("api-token")) {
            // @ts-ignore
            this.initUserData(this);
        }
    }
});
