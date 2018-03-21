import * as knexfile from "knexfile";
import { Model } from "objection";
import * as knex from "knex";

const db = knex(knexfile);
Model.knex(db);

export async function testDB() {
    console.log(`Conectando ao banco "${process.env.DB_DATABASE}" (${process.env.DB_CLIENT})...`);
    let result = await db.raw("select true;");
    console.log(`Conexão realizada com sucesso!`);
    return result;
}

export default db;
