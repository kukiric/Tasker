import VueRouter from "vue-router";

// Carrega as páginas dinâmicamente para o Webpack separar os bundles
const HomePage = () => import("@components/pages/HomePage.vue");
const ErrorPage = () => import("@components/pages/ErrorPage.vue");
const LoginPage = () => import("@components/pages/LoginPage.vue");
const ProjectPage = () => import("@components/pages/ProjectPage.vue");

// Define as rotas da aplicação
let router = new VueRouter({
    routes: [
        { path: "/", name: "Home", component: HomePage },
        { path: "/login", name: "Login", component: LoginPage },
        { path: "/projects/:projectId", name: "Project", component: ProjectPage, props: true },
        { path: "*", name: "Error", component: ErrorPage }
    ]
});

// Redireciona o usuário para a página de login se ele não tiver uma token ainda
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

export default router;
