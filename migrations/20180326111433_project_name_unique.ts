import * as Knex from "knex";

exports.up = async function (knex: Knex): Promise<any> {
    return knex.schema.alterTable("project", table => {
        table.unique(["name"]);
    });
};

exports.down = async function (knex: Knex): Promise<any> {
    return knex.schema.alterTable("project", table => {
        table.dropUnique(["name"]);
    });
};
