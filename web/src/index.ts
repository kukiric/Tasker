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
        { path: "/projects/:projectId", name: "ProjectDetails", component: Project, props: true },
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

// Cria e monta a aplicação no documento
let app = new Vue({
    el: "#app",
    router: router,
    components: { Layout },
    template: "<Layout/>"
});
