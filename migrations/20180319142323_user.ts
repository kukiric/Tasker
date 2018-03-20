import * as Knex from "knex";

exports.up = async function (knex: Knex): Promise<any> {
    return knex.schema.createTable("user", table => {
        table.increments();
        table.string("username").notNullable().unique();
        table.string("email").notNullable().unique();
        table.string("password").notNullable();
        table.string("fullname").notNullable();
        table.integer("role_id").references("role");
        table.timestamps(true, true);
    });
};

exports.down = async function (knex: Knex): Promise<any> {
    return knex.schema.dropTable("user");
};
