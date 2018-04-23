import * as knexfile from "knexfile";
import * as knex from "knex";
import { Model } from "objection";
import * as path from "path";
import * as fs from "fs";

const db = knex(knexfile);
Model.knex(db);

async function testConnection(): Promise<void> {
    await db.raw(`select 1+1 as result;`);
}

async function queryTable(tableName: string): Promise<void> {
    await db.raw(`select * from ${tableName} limit 1;`);
}

async function testModelTables(): Promise<void> {
    const extRegex = /\.js$|\.ts$/;
    const modelDir = path.join(__dirname, "../api/models/");
    let modelFiles = fs.readdirSync(modelDir).filter(f => extRegex.test(f));
    for (let file of modelFiles) {
        /* tslint:disable */
        let model: Object = require(path.join(modelDir, file)).default;
        if (model.hasOwnProperty("tableName")) {
            let tableName = model["tableName"];
            process.stdout.write(`Verificando se a tabela "${tableName}" existe... `);
            await db.raw(`select * from ${tableName} limit 1;`);
            process.stdout.write(`Ok!\n`);
        }
        /* tslint:enable */
    }
}

export async function setupDB(): Promise<void> {
    console.log(`Inicializada conexão com o banco "${process.env.DB_DATABASE}" (${process.env.DB_CLIENT})`);
    console.log(`Testando a conexão com o banco...`);
    await testConnection();
    console.log(`Testando a existência das tabelas no banco...`);
    await testModelTables();
    console.log(`Conexão ao banco realizada com sucesso!`);
}

export default db;
