import { Lifecycle, Request, ResponseToolkit, RouteOptionsAccess } from "hapi";
import * as Joi from "joi";

/**
 * Tipo de função que trata rotas em um controller
 */
export type PathHandler = (
    params: { [key: string]: any },
    h: ResponseToolkit,
    request: Request
) => Lifecycle.ReturnValue;

export interface Route {
    /**
     * Validação para os parâmetros no caminho do recurso
     */
    paramsValidator?: {
        [name: string]: Joi.AnySchema
    };
    /**
     * Validação para os parâmetros no final da URL
     */
    queryValidator?: {
        [name: string]: Joi.AnySchema
    };
    /**
     * Validação para as informações no corpo da requisição
     */
    payloadValidator?: {
        [name: string]: Joi.AnySchema
    };
    /**
     * Parâmetros de autenticação necessários na rota
     */
    auth?: string | false | RouteOptionsAccess;
    /**
     * Função que responde à requisição
     */
    handler: PathHandler;
}

export interface RouteMapping {
    [uri: string]: Route;
}

export interface RouteDefinitions {
    GET?: RouteMapping;
    POST?: RouteMapping;
    PUT?: RouteMapping;
    DELETE?: RouteMapping;
}

export default interface Controller {
    routes: RouteDefinitions;
}
