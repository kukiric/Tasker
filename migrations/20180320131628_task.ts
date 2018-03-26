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
        table.integer("project_id").references("project.id");
        table.integer("parent_id").references("task.id");
        table.integer("version_id");
    });
};

exports.down = async function (knex: Knex): Promise<any> {
    return knex.schema.dropTable("task");
};
