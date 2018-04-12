import VueRouter from "vue-router";
import Layout from "@/Layout.vue";
import Vue from "vue";

const Home = () => import("@/pages/Home.vue");
const NotFound = () => import("@/pages/NotFound.vue");
const Login = () => import("@/components/Login.vue");
const Project = () => import("@/components/Project.vue");

let router = new VueRouter({
    routes: [
        { path: "/", name: "Home", component: Home },
        { path: "/login", name: "Login", component: Login },
        { path: "/projects/:projectId", name: "Project", component: Project, props: true },
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
import axios from "@/axios";
Vue.prototype.$http = axios;
Vue.prototype.initUserData = (vue: Vue) => {
    loadProjects(vue);
    loadUser(vue);
}

// Adiciona o Vuex para gerenciar estados
import store from "@/store";
import Vuex from "vuex";
Vue.use(Vuex);

async function loadProjects(vue: Vue) {
    let userId = localStorage.getItem("user-id");
    console.log("Carregando projetos...");
    if (userId) {
        let req = await vue.$http.get(`/api/projects?include=manager,users`);
        if (req.data) {
            console.log("Setando projetos...");
            vue.$store.commit("setProjects", req.data);
        }
        else {
            alert("Request não retornou nada");
        }
    }
    else {
        alert("ID de usuário inválido");
    }
}

async function loadUser(vue: Vue) {
    let userId = localStorage.getItem("user-id");
    console.log("Carregando usuário...");
    if (userId) {
        let req = await vue.$http.get(`/api/users/${userId}?include=role,projects,tasks`);
        if (req.data) {
            console.log("Setando usuário...");
            vue.$store.commit("setUser", req.data);
        }
        else {
            alert("Request não retornou nada");
        }
    }
    else {
        alert("ID de usuário inválido");
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
