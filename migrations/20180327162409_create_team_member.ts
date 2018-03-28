import * as Knex from "knex";
import * as bcrypt from "bcrypt";

exports.up = async function (knex: Knex): Promise<any> {
    let now = new Date();
    await knex.table("user").insert({
        username: "member",
        password: bcrypt.hashSync("member123", 10),
        email: "member@example.com",
        fullname: "Membro da Equipe",
        created_at: now,
        updated_at: now,
        role_id: 3
    });
};

exports.down = async function (knex: Knex): Promise<any> {
    await knex.table("user").where("username", "member").del();
};
