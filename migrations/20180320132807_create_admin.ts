import * as Knex from "knex";
import * as bcrypt from "bcrypt";

exports.up = async function (knex: Knex): Promise<any> {
    let now = new Date();
    await knex.table("user").insert({
        username: "admin",
        password: bcrypt.hashSync("admin123", 10),
        email: "admin@example.com",
        fullname: "Administrador",
        created_at: now,
        updated_at: now
    });
};

exports.down = async function (knex: Knex): Promise<any> {
    await knex.table("user").where("username", "admin").del();
};
