import { Server as HapiServer } from "hapi";
import { spawn, exec } from "child_process";
import * as h2o2 from "h2o2";
import * as path from "path";

interface ResponseToolkit {
    proxy(options: h2o2.ProxyHandlerOptions): void;
}

const devPort = 9000;
const webpackCommand = [
    path.normalize("node_modules/.bin/webpack-dev-server"),
    "--config",
    "web/webpack.config.ts",
    "--hot",
    "--port",
    devPort.toString()
];

async function setupWebpack() {
    let devServer = exec(webpackCommand.join(" "));
    devServer.stderr.on("data", data => {
        console.error("webpack-dev-server: " + data.toString().trim());
    });
    devServer.stdout.on("data", data => {
        console.log(data.toString().trim());
    });
    devServer.on("close", code => {
        console.error("webpack-dev-server terminou com código: " + code);
        process.exit(code);
    });
}

async function setupProxy(server: HapiServer) {
    await server.register({ plugin: require("h2o2") });
    server.route({
        method: "GET",
        path: "/{path*}",
        handler: (request, h: ResponseToolkit) => {
            return h.proxy({ host: "127.0.0.1", port: devPort, protocol: "http" });
        }
    });
}

export = async function(server: HapiServer) {
    console.log("Ligando modo de desenvolvimento...");
    console.log("Iniciando webpack-dev-server em plano de fundo...");
    await setupWebpack();
    console.log("Ativando proxy para o webpack-dev-server...");
    await setupProxy(server);
    console.log("Modo de desenvolvimento ativado com sucesso!");
};
