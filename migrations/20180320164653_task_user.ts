import * as Knex from "knex";

exports.up = async function (knex: Knex): Promise<any> {
    return knex.schema.createTable("task_user", table => {
        table.integer("task_id").references("task.id");
        table.integer("user_id").references("user.id");
        table.primary(["task_id", "user_id"]);
    });
};

exports.down = async function (knex: Knex): Promise<any> {
    return knex.schema.dropTable("task_user");
};
