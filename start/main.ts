import { startServer } from "start/server";
import { setupDB } from "start/db";

// Encapsula a função de start para não receber parâmetros
let boot = async() => {
    startServer();
};

// Inclui o hook de modo de desenvolvimento se apropriado
if (process.env.NODE_ENV === "development") {
    boot = async() => {
        startServer(require("start/webpack"));
    };
}

// Testa a conexão com o banco de dados e inicia a aplicação
setupDB().then(boot);
