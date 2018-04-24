import * as Knex from "knex";

exports.up = async function (knex: Knex): Promise<any> {
    await knex.schema.alterTable("task", table => {
        table.renameColumn("description", "title");
    });
    await knex.schema.alterTable("task", table => {
        table.string("description", 16380).notNullable().defaultTo("");
    });
};

exports.down = async function (knex: Knex): Promise<any> {
    await knex.schema.alterTable("task", table => {
        table.dropColumn("description");
    });
    await knex.schema.alterTable("task", table => {
        table.renameColumn("title", "description");
    });
};
