import { Server as HapiServer } from "hapi";
import { createErrorHandler } from "start/error";
import router from "start/router";
import DatabaseErrorHandler from "api/handlers/DatabaseErrorHandler";

const server = new HapiServer({
    host: process.env.HOSTNAME,
    address: process.env.ADDRESS,
    port: process.env.PORT,
    router: {
        isCaseSensitive: false,
        stripTrailingSlash: true
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
    server.ext("onPreResponse", createErrorHandler([
        new DatabaseErrorHandler()
    ]));
    console.log("Iniciando a aplicação...");
    await server.start();
    console.log("Servidor iniciado no endereço: " + server.info.uri);
}

export default server;
