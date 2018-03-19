if (process.env.NODE_ENV) {
    // Executa com o ts-node em modo de desenvolvimento
    require("ts-node/register/type-check");
    require("tsconfig-paths/register");
    require("./src/start/main.ts");
}
else {
    // Executa o javascript puro compilado
    try {
        require("./out/start/main.js");
    }
    catch (err) {
        console.error(`Por favor rode após "npm build" ou com NODE_ENV="development"`)
        process.exit(1);
    }
}