import { Server as HapiServer, Request, ResponseToolkit, Lifecycle } from "hapi";
import apiPlugin from "api/plugin";
import * as Boom from "boom";

// Trata erros genéricos
function handleInternalError(request: Request, h: ResponseToolkit, err: any): Lifecycle.ReturnValue {
    let error = err ? err : request.response as any;
    let statusCode = error.output ? error.output.statusCode : error.statusCode;
    // Erro no banco
    if (error.isBoom && error.detail) {
        return Boom.badRequest(error.message.replace(/^.+ - /, ""));
    }
    return h.continue;
}

// Trata erros de validação
function handleValidationError(request: Request, h: ResponseToolkit, err: any): Lifecycle.ReturnValue {
    let boom = Boom.badRequest("Input validation failed");
    Object.assign(boom.output.payload, { details: err.details });
    return boom;
}

// Configura o servidor do HAPI
const server = new HapiServer({
    host: process.env.HOSTNAME,
    address: process.env.ADDRESS,
    port: process.env.PORT,
    router: {
        isCaseSensitive: false,
        stripTrailingSlash: true
    },
    routes: {
        validate: {
            failAction: handleValidationError,
            options: {
                abortEarly: false
            }
        }
    },
    debug: {
        request: ["*"]
    }
});

export async function start() {
    server.ext("onPreResponse", handleInternalError);
    await server.register([require("vision"), require("inert"), require("hapi-swagger")]);
    await server.register({
        plugin: apiPlugin,
        routes: {
            prefix: "/api"
        }
    });
    console.log("Iniciando a aplicação...");
    await server.start();
    console.log("Servidor iniciado no endereço: " + server.info.uri);
}

export default server;
