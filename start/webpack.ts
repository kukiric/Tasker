import { Server as HapiServer } from "hapi";
import { spawn, exec } from "child_process";
import * as path from "path";

const webpack = [
    path.normalize("node_modules/.bin/webpack-dev-server"),
    "--config",
    "web/webpack.config.ts",
    "--hot",
    "--port",
    process.env.WEBPACK_PORT as string
];

async function setupWebpack() {
    let devServer = spawn(webpack[0], webpack.splice(1), {
        shell: true
    });
    devServer.stderr.on("data", (data) => {
        console.error("webpack-dev-server: " + data.toString().trim());
    });
    devServer.stdout.on("data", (data) => {
        console.log(data.toString().trim());
    });
    devServer.on("close", (code) => {
        console.error("webpack-dev-server terminou com código: " + code);
        process.exit(code);
    });
}

export = async function(server: HapiServer) {
    console.log("[Devel] Ligando modo de desenvolvimento...");
    console.log("[Devel] Iniciando webpack-dev-server em plano de fundo...");
    await setupWebpack();
    console.log("[Devel] Modo de desenvolvimento ativado com sucesso!");
};
