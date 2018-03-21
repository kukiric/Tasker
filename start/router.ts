import { Plugin, Server, ServerRegisterOptions } from "hapi";
import Controller from "api/controllers/Controller";

import UserController from "api/controllers/UserController";

export default {
    name: "tasker-router",
    version: "1.0",

    register: async function(server: Server, options: ServerRegisterOptions) {
        function registerController(controller: Controller) {
            console.log("Registrando controlador: " + controller.constructor.name);
            for (let method in controller.routes) {
                for (let path in controller.routes[method]) {
                    let handler = controller.routes[method][path];
                    server.route({ method, path, handler });
                }
            }
        }
        console.log("Registrando rotas...");
        registerController(new UserController());
        console.log("Finalizado registro de rotas!");
    }
};
