import * as Knex from "knex";
import * as bcrypt from "bcryptjs";

exports.up = async function (knex: Knex): Promise<any> {
    let now = new Date();
    await knex.table("user").insert({
        username: "manager",
        password: bcrypt.hashSync("manager123", 10),
        email: "manager@example.com",
        fullname: "Gerente de Projetos",
        created_at: now,
        updated_at: now,
        role_id: 2
    });
};

exports.down = async function (knex: Knex): Promise<any> {
    await knex.table("user").where("username", "manager").del();
};
