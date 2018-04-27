import { Plugin, Server, Request, ResponseToolkit} from "hapi";
import { ServerRegisterOptions, RouteOptions, RouteOptionsAccess } from "hapi";
import BaseController, { PathHandler, RouteMapping, Route } from "api/controllers/BaseController";
import { RoleType, getRoleName } from "api/models/Role";
import { DecodedToken } from "./stubs";
import * as assert from "assert";
import * as Boom from "boom";
import * as Joi from "joi";

/**
 * Encapsula os parâmetros de ambos os tipos (url e payload) no mesmo objeto antes de passar para o controlador
 * @todo Tratar parâmetros de query
 */
function encapsulateParams(handler: PathHandler, request: Request, h: ResponseToolkit) {
    let allParams = Object.assign({}, request.payload, request.params, request.query);
    return handler(allParams, h, request);
}

/**
 * Transforma uma lista de role IDs (ex. [1, 2]) em um array de roles para
 * o Hapi (ex. ["1", "2"]), eliminando listas vazias
 */
function stringifyRoles(roles?: RoleType | RoleType[]): string[] | false {
    if (!roles) {
        return false;
    }
    if (!Array.isArray(roles)) {
        roles = [roles];
    }
    if (roles.length === 0) {
        return false;
    }
    return roles.map(id => "ROLE_" + getRoleName(id));
}

/**
 * Registra as rotas do controlador no servidor
 */
function registerController(server: Server, controller: BaseController) {
    let regex = /^(.+)(Controller)$/;
    let controllerName = controller.constructor.name;
    console.log("Registrando controlador: " + controllerName);
    for (let method in controller.routes) {
        for (let path in controller.routes[method]) {
            // Objeto da rota
            let route: Route = controller.routes[method][path];
            // Verifica se a rota requer autenticação (requer false explícito para desativar)
            let authRequired = route.authRequired !== false;
            // Opções de autenticação
            const authStrategy: RouteOptionsAccess = {
                mode: "required",
                strategy: "jwt",
                access: {
                    scope: stringifyRoles(route.roles)
                }
            };
            // Opções de validação e documentação
            let options: RouteOptions = {
                validate: {
                    params: route.paramsValidator,
                    payload: route.payloadValidator,
                    query: route.queryValidator
                },
                tags: ["api", controllerName.replace(regex, "$1 $2")],
                auth: authRequired && authStrategy
            };
            // Função de tratamento
            let handler: PathHandler = encapsulateParams.bind(undefined, route.handler);
            server.route({ method, path, handler, options });
        }
    }
}

/**
 * Valida o token JWT durante a autenticação
 */
function authValidate(token: DecodedToken, request: Request, h: ResponseToolkit) {
    // Adiciona o role do usuário no seu scope para validação no Hapi
    let roleAsScope = stringifyRoles(token.role);
    return {
        isValid: true,
        credentials: Object.assign(token, { scope: roleAsScope })
    };
}

// Controladores carregados
import TagController from "api/controllers/TagController";
import UserController from "api/controllers/UserController";
import RoleController from "api/controllers/RoleController";
import AuthController from "api/controllers/AuthController";
import ProjectController from "api/controllers/ProjectController";

// Define o plugin do Hapi
export default {
    name: "Tasker API",
    version: "1.0",

    register: async function(server: Server, serverOpts: ServerRegisterOptions) {
        console.log("Registrando o plugin hapi-auth-jwt2...");
        await server.register(require("hapi-auth-jwt2"));
        server.auth.strategy("jwt", "jwt", {
            key: process.env.SECRET_KEY,
            validate: authValidate
        });
        if (process.env.NODE_ENV === "development") {
            console.log("[Devel] Registrando o plugin hapi-swagger...");
            const swaggerOptions = {
                grouping: "tags",
                sortEndpoints: "method",
                expanded: "none",
                jsonEditor: false,
                basePath: process.env.BASE_URL,
                info: {
                    title: this.name + " Documentation",
                    description: "An API made with Hapi.js - https://github.com/kukiric/tasker",
                    version: this.version
                },
                securityDefinitions: {
                    jwt: {
                        type: "apiKey",
                        name: "Authorization",
                        in: "header"
                    }
                }
            };
            await server.register([
                { plugin: require("vision"), once: true },
                { plugin: require("inert"), once: true },
                { plugin: require("hapi-swagger"), options: swaggerOptions }
            ]);
        }
        console.log("Registrando as rotas da aplicação...");
        registerController(server, new TagController());
        registerController(server, new UserController());
        registerController(server, new RoleController());
        registerController(server, new AuthController());
        registerController(server, new ProjectController());
        console.log("Finalizado registro da aplicação!");
    }
};
