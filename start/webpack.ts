import { Server as HapiServer } from "hapi";
import { spawn, exec } from "child_process";
import * as h2o2 from "h2o2";
import * as path from "path";

const devPort = 9000;
const webpack = [
    path.normalize("node_modules/.bin/webpack-dev-server"),
    "--config",
    "web/webpack.config.ts",
    "--hot",
    "--port",
    devPort.toString()
];

async function setupWebpack() {
    let devServer = spawn(webpack[0], webpack.splice(1), {
        shell: true
    });
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
    let proxyHandler: h2o2.ProxyHandlerOptions = {
        host: "127.0.0.1",
        port: devPort
    };
    server.route({
        method: "GET",
        path: "/{path*}",
        handler: {
            proxy: proxyHandler
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
