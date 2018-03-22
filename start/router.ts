import { Plugin, Server, ServerRegisterOptions } from "hapi";
import Controller from "api/controllers/Controller";

import UserController from "api/controllers/UserController";
import ProjectController from "api/controllers/ProjectController";

export default {
    name: "tasker-router",
    version: "1.0",

    register: async function(server: Server, serverOpts: ServerRegisterOptions) {
        function registerController(controller: Controller) {
            console.log("Registrando controlador: " + controller.constructor.name);
            for (let method in controller.routes) {
                for (let path in controller.routes[method]) {
                    let route = controller.routes[method][path];
                    let options = { validate: { params: route.params, payload: route.payload } };
                    let handler = route.handler;
                    server.route({ method, path, handler, options });
                }
            }
        }
        console.log("Registrando rotas...");
        registerController(new UserController());
        registerController(new ProjectController());
        console.log("Finalizado registro de rotas!");
    }
};
