import * as knexfile from "../../knexfile";
import { Model } from "objection";
import * as knex from "knex";

const Database = knex(knexfile);
Model.knex(Database);

export default Database;