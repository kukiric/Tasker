import * as Knex from "knex";

exports.up = async function (knex: Knex): Promise<any> {
    return knex.schema.createTable("tag", (table) => {
        table.increments();
        table.string("name", 45).unique().notNullable();
    });
};

exports.down = async function (knex: Knex): Promise<any> {
    return knex.schema.dropTable("tag");
};
