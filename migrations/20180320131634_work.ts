import * as Knex from "knex";

exports.up = async function (knex: Knex): Promise<any> {
    return knex.schema.createTable("work", (table) => {
        table.increments();
        table.integer("hours").notNullable();
        table.dateTime("start_time");
        table.dateTime("end_time");
        table.integer("user_id").references("user.id").onDelete("CASCADE");
        table.integer("task_id").references("task.id").onDelete("CASCADE");
    });
};

exports.down = async function (knex: Knex): Promise<any> {
    return knex.schema.dropTable("work");
};
