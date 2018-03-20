import { Server as HapiServer } from "hapi";
import Router from "start/router";

const Server = new HapiServer({
    host: process.env.HOSTNAME,
    address: process.env.ADDRESS,
    port: process.env.PORT,
    debug: {
        request: ["*"]
    }
});

export async function start() {
    await Server.register(Router, {
        routes: {
            prefix: "/api"
        }
    });
    await Server.start();
    console.log("Servidor iniciado no endereço: " + Server.info.uri);
}

export default Server;