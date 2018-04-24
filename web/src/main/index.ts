import VueRouter from "vue-router";
import Layout from "@/Layout.vue";
import Vue from "vue";

// Carrega as páginas dinâmicamente para o Webpack separar os bundles
const HomePage = () => import("@/pages/HomePage.vue");
const ErrorPage = () => import("@/pages/ErrorPage.vue");
const LoginPage = () => import("@/pages/LoginPage.vue");
const ProjectPage = () => import("@/pages/ProjectPage.vue");

// Define as rotas da aplicação
let router = new VueRouter({
    routes: [
        { path: "/", name: "Home", component: HomePage },
        { path: "/login", name: "Login", component: LoginPage },
        { path: "/projects/:projectId", name: "Project", component: ProjectPage, props: true },
        { path: "*", name: "Error", component: ErrorPage }
    ]
});

// Redireciona o usuário para a página de login se ele não tiver uma token
router.beforeEach((to, from, next) => {
    let token = localStorage.getItem("api-token");
    if (!token && to.name !== "Login") {
        if (to.path !== "/") {
            next(`/login?redirect=${to.path}`);
        }
        else {
            next(`/login`);
        }
    }
    else {
        next();
    }
});

// Adiciona o router na aplicação
Vue.use(VueRouter);

// Adiciona a instância configurada do axios na aplicação
import axios from "@main/axios";
Vue.prototype.http = axios;
Vue.prototype.initUserData = (vue: Vue) => {
    loadProjects(vue);
    loadUser(vue);
    loadAllUsers(vue);
};

// Adiciona o Vuex para gerenciar estados
import createStore from "@main/store";
import Vuex from "vuex";
Vue.use(Vuex);

// Adiciona os components do semantic-ui-vue
import SuiVue from "semantic-ui-vue";
Vue.use(SuiVue);

async function loadProjects(vue: Vue) {

}

async function loadUser(vue: Vue) {
    let userId = localStorage.getItem("user-id");
    if (userId) {
        let req = await vue.http.get(`/api/users/${userId}?include=role,projects,tasks`);
        if (req.data) {
            vue.$store.commit("setCurrentUser", req.data);
        }
    }
}

async function loadAllUsers(vue: Vue) {
    let req = await vue.http.get(`/api/users?include=role`);
    if (req.data) {
        vue.$store.commit("setAllUsers", req.data);
    }
}

const store = createStore(axios);
Vue.prototype.g = store;

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
