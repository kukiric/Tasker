import VueRouter from "vue-router";
import Layout from "@components/Layout.vue";
import Vue from "vue";

const Home = () => import("@components/Home.vue");
const NotFound = () => import("@components/NotFound.vue");
const Login = () => import("@components/Login.vue");
const ProjectView = () => import("@components/ProjectView.vue");

let router = new VueRouter({
    routes: [
        { path: "/", name: "Home", component: Home },
        { path: "/login", name: "Login", component: Login },
        { path: "/projects/:projectId", name: "ProjectView", component: ProjectView, props: true },
        { path: "*", name: "NotFound", component: NotFound }
    ]
});

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
Vue.prototype.$http = axios;
Vue.prototype.initUserData = (vue: Vue) => {
    loadProjects(vue);
    loadUser(vue);
    loadAllUsers(vue);
};

// Adiciona o Vuex para gerenciar estados
import store from "@store/store";
import Vuex from "vuex";
Vue.use(Vuex);

// Adiciona os components do semantic-ui-vue
import SuiVue from "semantic-ui-vue";
Vue.use(SuiVue);

async function loadProjects(vue: Vue) {
    let userId = localStorage.getItem("user-id");
    if (userId) {
        let req = await vue.$http.get(`/api/projects?include=manager,users`);
        if (req.data) {
            vue.$store.commit("setProjects", req.data);
        }
    }
}

async function loadUser(vue: Vue) {
    let userId = localStorage.getItem("user-id");
    if (userId) {
        let req = await vue.$http.get(`/api/users/${userId}?include=role,projects,tasks`);
        if (req.data) {
            vue.$store.commit("setUser", req.data);
        }
    }
}

async function loadAllUsers(vue: Vue) {
    let req = await vue.$http.get(`/api/users?include=role`);
    if (req.data) {
        vue.$store.commit("setAllUsers", req.data);
    }
}

// Cria e monta a aplicação no documento
let app = new Vue({
    el: "#app",
    router: router,
    store: store.create(),
    components: { Layout },
    template: "<Layout/>",
    beforeMount() {
        if (localStorage.getItem("api-token")) {
            this.initUserData(this);
        }
    }
});
