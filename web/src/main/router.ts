import createStore from "@main/store";
import VueRouter from "vue-router";
import Vue from "vue";

// Carrega as páginas dinâmicamente para o Webpack separar os bundles
const HomePage = () => import("@components/pages/HomePage.vue");
const ErrorPage = () => import("@components/pages/ErrorPage.vue");
const LoginPage = () => import("@components/pages/LoginPage.vue");
const ProjectPage = () => import("@components/pages/ProjectPage.vue");

export default function createRouter(vueConstructor: typeof Vue, store: ReturnType<typeof createStore>) {
    // Carrega o plugin do VueRouter na instância global do Vue
    vueConstructor.use(VueRouter);
    // Define as rotas da aplicação
    let router = new VueRouter({
        routes: [
            { path: "/", name: "Home", component: HomePage },
            { path: "/login", name: "Login", component: LoginPage },
            { path: "/projects/:projectId", name: "Project", component: ProjectPage, props: true },
            { path: "*", name: "Error", component: ErrorPage }
        ]
    });
    // Redireciona o usuário para a página de login se ele ainda não tiver uma token
    router.beforeEach((to, from, next) => {
        let token = store.state.token;
        // Usuário sem token
        if (token == null && to.name !== "Login") {
            if (to.path !== "/") {
                next(`/login?redirect=${to.path}`);
            }
            else {
                next(`/login`);
            }
        }
        // Roteamento normal
        else {
            next();
        }
    });
    return router;
}
