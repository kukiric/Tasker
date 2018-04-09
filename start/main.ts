import { startServer } from "start/server";
import { testDB } from "start/db";

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

// Testa a conexão do banco de dados e inicia a aplicação
testDB().then(boot).catch(err => {
    console.error(err.stack);
    process.exit(1);
});
