import { Server as HapiServer, Request, ResponseToolkit, Lifecycle } from "hapi";
import apiPlugin from "api/plugin";
import * as Boom from "boom";

// Trata erros internos genéricos
function handleInternalError(request: Request, h: ResponseToolkit, err: any): Lifecycle.ReturnValue {
    let error = err ? err : request.response as any;
    let statusCode = error.output ? error.output.statusCode : error.statusCode;
    // Erro no banco
    if (error.isBoom && error.detail) {
        let boom = Boom.internal("Database query error");
        Object.assign(boom.output.payload, {
            details: {
                message: error.detail,
                constraint: error.constraint,
                table: error.table
            }
        });
        return boom;
    }
    return h.continue;
}

// Trata erros de validação
function handleValidationError(request: Request, h: ResponseToolkit, err: any): Lifecycle.ReturnValue {
    let boom = Boom.badRequest("Input validation failed");
    Object.assign(boom.output.payload, { details: err.details });
    return boom;
}

// Configura o servidor do Hapi
const server = new HapiServer({
    host: process.env.HOST || process.env.ADDRESS,
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

export async function startServer(webpackHook?: (server: HapiServer) => void) {
    if (!process.env.SECRET_KEY || process.env.SECRET_KEY.length < 32) {
        throw new Error("Chave secreta muito curta! Crie uma chave secreta de 32 ou mais "
                      + "caracteres e configure-a na varíavel SECRET_KEY no arquivo .env.");
    }
    server.ext("onPreResponse", handleInternalError);
    console.log("Registrando o plugin da aplicação...");
    await server.register({
        plugin: apiPlugin,
        routes: {
            prefix: "/api"
        }
    });
    if (webpackHook) {
        await webpackHook(server);
    }
    else {
        console.log("Registrando caminho para arquivos estáticos...");
        await server.register({ plugin: require("inert"), once: true });
        server.route({
            method: "GET",
            path: "/{path*}",
            handler: {
                directory: {
                    path: "web/public"
                }
            }
        });
    }
    console.log("Iniciando a aplicação...");
    await server.start();
    console.log("Servidor iniciado no endereço: " + server.info.uri);
}

export default server;
