import { registerRoutes } from "start/routes";
import { Model } from "objection";
import * as knex from "knex";
import * as colors from "colors/safe";
import * as Hapi from "hapi";

const server = new Hapi.Server({
    host: "localhost",
    address: "127.0.0.1",
    port: 3000
});

const db = knex({
    dialect: "sqlite3",
    useNullAsDefault: true,
    connection: {
        filename: "./development.db"
    }
});

Model.knex(db);

registerRoutes(server);

const init = async() => {
    console.log();
    await server.start();
    console.log("Servidor iniciado no endereço: " + server.info.uri);
};

process.on("unhandledRejection", (err: Error) => {
    console.error(colors.red(err.stack as string));
    process.exit(1);
});

init();