import * as Knex from "knex";

exports.up = async function (knex: Knex): Promise<any> {
    return knex.schema.createTable("project", (table) => {
        table.increments();
        table.string("name").notNullable();
        table.date("due_date").notNullable();
        table.string("status", 45).notNullable();
        table.integer("manager_id").references("user.id").onDelete("SET NULL");
        table.timestamps(true, true);
    });
};

exports.down = async function (knex: Knex): Promise<any> {
    return knex.schema.dropTable("project");
};
