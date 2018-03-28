import { Lifecycle, Request, ResponseToolkit, RouteOptionsAccess } from "hapi";
import { AllowedRole } from "../models/Role";
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
     * Obriga os usuários a estarem autenticados para acessar essa rota
     * @default true
     */
    authRequired?: boolean;
    /**
     * Roles permitidos a acessar essa rota
     */
    roles?: AllowedRole[];
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
