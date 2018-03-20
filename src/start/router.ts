import UserController from "api/controllers/UserController";
import { Plugin, Server, ServerRegisterOptions } from "hapi";

export default {
    name: "tasker-router",
    version: "1.0",

    register: async function(server: Server, options: ServerRegisterOptions) {
        function registerController(controller: any) {
            console.log("Registrando controlador: " + controller.name);
            for (let method in controller.routes) {
                for (let path in controller.routes[method]) {
                    let handler = controller.routes[method][path];
                    server.route({ method, path, handler });
                }
            }
        }
        console.log("Registrando rotas...");
        registerController(UserController);
    }
};
