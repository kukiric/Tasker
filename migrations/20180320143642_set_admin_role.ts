import * as Knex from "knex";

exports.up = async function (knex: Knex): Promise<any> {
    return knex.table("user").update({ role_id: 1 }).where({ username: "admin" });
};

exports.down = async function (knex: Knex): Promise<any> {
    return knex.table("user").update({ role_id: null }).where({ username: "admin" });
};
