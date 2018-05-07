import * as moment from "moment";
import Vue from "vue";

// Define a região do moment.js
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

// Adiciona o Vuex para gerenciar estados
import createStore, { tokenKey } from "@main/store";
import Vuex from "vuex";
Vue.use(Vuex);

// Adiciona os components do semantic-ui-vue
import SuiVue from "semantic-ui-vue";
import { isMoment } from "moment";
Vue.use(SuiVue);

import createAxios from "@main/axios";
const axios = createAxios(() => store);
const store = createStore(axios);
Vue.prototype.$http = axios;

import VueRouter from "vue-router";
import createRouter from "@main/router";
const router = createRouter(Vue, store);

import Layout from "@components/Layout.vue";

// Cria e monta a aplicação no documento
let app = new Vue({
    el: "#app",
    store: store,
    router: router,
    components: { Layout },
    template: "<Layout/>",
    created() {
        // Carrega o usuário se ele estiver logado
        let token = localStorage.getItem(tokenKey);
        if (token) {
            this.$store.dispatch("loadUser", token);
        }
    }
});
