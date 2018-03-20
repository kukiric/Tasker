import * as Knex from "knex";

exports.up = async function (knex: Knex): Promise<any> {
    await knex.table("user").insert({
        username: "admin",
        password: "admin",
        email: "admin@localhost",
        fullname: "Administrador"
    });
};

exports.down = async function (knex: Knex): Promise<any> {
    await knex.table("user").where("username", "admin").del();
};
