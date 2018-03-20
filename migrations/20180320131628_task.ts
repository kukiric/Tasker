import * as Knex from "knex";

exports.up = async function (knex: Knex): Promise<any> {
    return knex.schema.createTable("task", table => {
        table.increments();
        table.text("description").notNullable();
        table.date("due_date");
        table.integer("estimate_work_hour");
        table.string("type", 45).notNullable();
        table.string("status", 45).notNullable();
        table.float("progress");
        table.integer("project_id").references("project");
        table.integer("parent_id").references("task");
        table.integer("version_id").references("version");
    });
};

exports.down = async function (knex: Knex): Promise<any> {
    return knex.schema.dropTable("task");
};
