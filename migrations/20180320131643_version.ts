import * as Knex from "knex";

exports.up = async function (knex: Knex): Promise<any> {
    return knex.schema.createTable("version", table => {
        table.increments();
        table.string("name").notNullable();
        table.string("type", 45).notNullable();
        table.integer("project_id").references("project");
    });
};

exports.down = async function (knex: Knex): Promise<any> {
    return knex.schema.dropTable("version");
};
