import { Plugin, Server, ServerRegisterOptions, Request, ResponseToolkit, RouteOptions } from "hapi";
import Controller, { PathHandler, RouteMapping, Route } from "api/controllers/Controller";

import * as Joi from "joi";

// Controladores carregados
import TagController from "api/controllers/TagController";
import UserController from "api/controllers/UserController";
import ProjectController from "api/controllers/ProjectController";

/**
 * Encapsula os parâmetros de ambos os tipos (url e payload) no mesmo objeto antes de passar para o controlador
 * @todo Tratar parâmetros de query
 */
function encapsulateParams(handler: PathHandler, request: Request, h: ResponseToolkit) {
    let allParams = Object.assign({}, request.payload, request.params);
    return handler(allParams, h, request);
}

/**
 * Registra as rotas do controlador no servidor
 */
function registerController(server: Server, controller: Controller) {
    console.log("Registrando controlador: " + controller.constructor.name);
    for (let method in controller.routes) {
        for (let path in controller.routes[method]) {
            // Objeto da rota
            let route: Route = controller.routes[method][path];
            // Opções de validação
            let options: RouteOptions = {
                validate: {
                    params: route.paramsValidator,
                    payload: route.payloadValidator
                }
            };
            // Função de tratamento
            let handler: PathHandler = encapsulateParams.bind(undefined, route.handler);
            server.route({ method, path, handler, options });
        }
    }
}

// Define o plugin do Hapi
export default {
    name: "Tasker API",
    version: "1.0",

    register: async function(server: Server, serverOpts: ServerRegisterOptions) {
        console.log("Registrando rotas...");
        registerController(server, new TagController());
        registerController(server, new UserController());
        registerController(server, new ProjectController());
        console.log("Finalizado registro de rotas!");
    }
} as Plugin<any>;