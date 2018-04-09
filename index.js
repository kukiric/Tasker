try {
    // Carrega as configurações da aplicação
    require("dotenv").config();
    // Busca os módulos a partir do diretório raiz
    require("app-module-path").addPath(__dirname);
    // Inicia a aplicação em TypeScript (requer ts-node ou scripts compilados)
    require("start/main");
}
catch (err) {
    console.error(`\nUncaught ${err.stack}`);
}
