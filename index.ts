function panic(err: Error) {
    console.error(`\nUncaught ${err.stack}`);
    process.exit(1);
}

function main() {
try {
        // Trata erros incuráveis da aplicação
        process.on("unhandledRejection", panic);
        // Carrega as configurações da aplicação
        require("dotenv").config();
        // Busca os módulos a partir do diretório raiz
        require("app-module-path").addPath(__dirname);
        // Inicia a aplicação em TypeScript (requer ts-node ou scripts compilados)
        require("start/main");
    }
    catch (err) {
        panic(err);
    }
}

main();
