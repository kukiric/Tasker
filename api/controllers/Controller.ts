import { RouteOptionsValidate } from "hapi";
import * as Joi from "joi";

export interface PathMapping {
    [uri: string]: {
        /**
         * Função que responde à requisição
         */
        handler: (...args: any[]) => any;
        /**
         * Validação para os parâmetros da URL
         */
        params?: {
            [name: string]: Joi.AnySchema
        }
        /**
         * Validação para o payload JSON no body
         */
        payload?: {
            [name: string]: Joi.AnySchema
        }
    };
}

export interface RouteDefinitions {
    GET?: PathMapping;
    POST?: PathMapping;
    PUT?: PathMapping;
    DELETE?: PathMapping;
}

export default interface Controller {
    routes: RouteDefinitions;
}
