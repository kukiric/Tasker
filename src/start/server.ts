import { Server as HapiServer } from "hapi";
import Router from "start/router";

const Server = new HapiServer({
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
    await Server.register({
        plugin: Router,
        routes: {
            prefix: "/api"
        }
    });
    // Inicia a aplicação
    await Server.start();
    console.log("Servidor iniciado no endereço: " + Server.info.uri);
}

export default Server;
