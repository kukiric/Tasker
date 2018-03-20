import * as Knex from "knex";

exports.up = async function (knex: Knex): Promise<any> {
    let roleResult = await knex.table("role").select("id").where({ name: "admin" });
    return knex.table("user").update({ role_id: roleResult[0].id }).where({ username: "admin" });
};

exports.down = async function (knex: Knex): Promise<any> {
    return knex.table("user").update({ role_id: null }).where({ username: "admin" });
};
