import UserController from "api/controllers/UserController";
import { Plugin, Server, ServerRegisterOptions } from "hapi";

export default {

    name: "Router 1.0",
    version: "1.0",

    register: async function(server: Server, options: ServerRegisterOptions) {
        function registerController(controller: any) {
            console.log("Registrando controlador: " + controller.name);
            const controllerRoutes = controller.routes();
            for (let method in controllerRoutes) {
                for (let path in controllerRoutes[method]) {
                    let handler = controllerRoutes[method][path];
                    server.route({ method, path, handler });
                }
            }
        }
        console.log("Registrando rotas...");
        registerController(UserController);
    }
}
