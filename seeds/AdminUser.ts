import * as Knex from "knex";

exports.seed = async function (knex: Knex): Promise<any> {
    let now = new Date();
    return knex.table("user").insert({
        username: "admin",
        password: "admin",
        email: "admin@localhost",
        fullname: "Administrador",
        created_at: now,
        updated_at: now
    });
};
