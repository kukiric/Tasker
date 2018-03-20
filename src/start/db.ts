import * as knexfile from "../../knexfile";
import { Model } from "objection";
import * as knex from "knex";

const Database = knex(knexfile);
Model.knex(Database);

export async function testDB() {
    try {
        console.log(`Conectando ao banco ${process.env.DB_DATABASE} (${process.env.DB_CLIENT})...`);
        return await Database.raw("select true;");
    }
    catch (err) {
        console.error(err.stack);
        throw err;
    }
}

export default Database;