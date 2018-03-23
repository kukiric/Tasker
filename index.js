try {
    // Carrega as configurações da aplicação
    require("dotenv").config();
    // Busca os módulos a partir do diretório raiz
    require("app-module-path").addPath(__dirname);
    require("start/main");
}
catch (err) {
    console.error(`\nUncaught ${err.stack}`);
}
