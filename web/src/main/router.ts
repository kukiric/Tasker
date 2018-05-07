import createStore, { tokenKey } from "@main/store";
import VueRouter from "vue-router";
import Vue from "vue";

// Carrega as páginas dinâmicamente para o Webpack separar os bundles
const AdminPage = () => import("@components/pages/AdminPage.vue");
const ErrorPage = () => import("@components/pages/ErrorPage.vue");
const LoginPage = () => import("@components/pages/LoginPage.vue");
const ProjectPage = () => import("@components/pages/ProjectPage.vue");

export default function createRouter(vueConstructor: typeof Vue, store: ReturnType<typeof createStore>) {
    // Carrega o plugin do VueRouter na instância global do Vue
    vueConstructor.use(VueRouter);
    // Define as rotas da aplicação
    let router = new VueRouter({
        mode: "history",
        routes: [
            { path: "/", name: "Home" },
            { path: "/admin", name: "Admin", component: AdminPage },
            { path: "/login", name: "Login", component: LoginPage, alias: "/register" },
            { path: "/projects/:projectId", name: "Project", component: ProjectPage, props: true },
            { path: "*", name: "Error", component: ErrorPage }
        ]
    });
    // Redireciona o usuário para a página de login se ele ainda não tiver uma token
    router.beforeEach((to, from, next) => {
        let token = localStorage.getItem(tokenKey);
        // Usuário sem token
        if (token == null && to.name !== "Login") {
            if (to.path !== "/") {
                // Grava a página que o usuário pretendia acessar
                next({
                    path: `/login?redirect=${to.path}`,
                    replace: true
                });
            }
            else {
                next({
                    path: `/login`,
                    replace: true
                });
            }
        }
        // Roteamento normal
        else {
            next();
        }
    });
    return router;
}
