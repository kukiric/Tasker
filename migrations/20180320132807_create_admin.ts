import * as Knex from "knex";

exports.up = async function (knex: Knex): Promise<any> {
    let now = new Date();
    await knex.table("user").insert({
        username: "admin",
        password: "admin",
        email: "admin@localhost",
        fullname: "Administrador",
        created_at: now,
        updated_at: now
    });
};

exports.down = async function (knex: Knex): Promise<any> {
    await knex.table("user").where("username", "admin").del();
};
