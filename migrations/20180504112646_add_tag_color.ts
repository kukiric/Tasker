import * as Knex from "knex";

exports.up = async function (knex: Knex): Promise<any> {
    await knex.schema.alterTable("tag", (table) => {
        table.string("color", 16);
    });
};

exports.down = async function (knex: Knex): Promise<any> {
    await knex.schema.alterTable("tag", (table) => {
        table.dropColumn("color");
    });
};
