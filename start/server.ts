import { Server as HapiServer, Request, ResponseToolkit, Lifecycle } from "hapi";
import router from "start/router";
import * as Boom from "boom";

function handleErrors(request: Request, h: ResponseToolkit, err: any): Lifecycle.ReturnValue {
    let error = err ? err : request.response as any;
    if (error.isBoom) {
        return Boom.badData(error.detail ? error.detail : error.message);
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

export async function start() {
    // Registra o roteador da aplicação
    await server.register({
        plugin: router,
        routes: {
            prefix: "/api"
        }
    });
    // Registra os tratadores de erros
    server.ext("onPreResponse", handleErrors);
    console.log("Iniciando a aplicação...");
    await server.start();
    console.log("Servidor iniciado no endereço: " + server.info.uri);
}

export default server;
