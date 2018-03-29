import * as Knex from "knex";

exports.up = async function (knex: Knex): Promise<any> {
    await knex.schema.alterTable("user", table => {
        table.foreign("role_id").references("role.id").onDelete("SET NULL");
    });
    await knex.schema.alterTable("task", table => {
        table.foreign("version_id").references("version.id").onDelete("SET NULL");
    });
};

exports.down = async function (knex: Knex): Promise<any> {
    await knex.schema.alterTable("user", table => {
        table.dropForeign(["role_id"]);
    });
    await knex.schema.alterTable("task", table => {
        table.dropForeign(["version_id"]);
    });
};
