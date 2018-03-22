import { Server as HapiServer, Request, ResponseToolkit, Lifecycle } from "hapi";
import router from "start/router";
import * as Boom from "boom";

// Trata erros genéricos
function handleErrors(request: Request, h: ResponseToolkit, err: any): Lifecycle.ReturnValue {
    let error = err ? err : request.response as any;
    let statusCode = error.output ? error.output.statusCode : error.statusCode;
    if (error.isBoom && (statusCode === 400 || statusCode === 500)) {
        if (error.detail) {
            // Filtra o erro no banco
            return Boom.badRequest(error.message.replace(/^.+ - /, ""));
        }
        else {
            // Retorna o erro completo
            return Boom.badRequest(error.message);
        }
    }
    else {
        return h.continue;
    }
}

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
            failAction: handleErrors
        }
    },
    debug: {
        request: ["*"]
    }
});

server.ext("onPreResponse", handleErrors);

export async function start() {
    // Registra o roteador da aplicação
    await server.register({
        plugin: router,
        routes: {
            prefix: "/api"
        }
    });
    console.log("Iniciando a aplicação...");
    await server.start();
    console.log("Servidor iniciado no endereço: " + server.info.uri);
}

export default server;
