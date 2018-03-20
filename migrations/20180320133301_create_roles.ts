import * as Knex from "knex";

exports.up = async function (knex: Knex): Promise<any> {
    let roles = knex.table("role");
    await roles.insert({ name: "admin" });
    await roles.insert({ name: "manager" });
    await roles.insert({ name: "team member" });
};

exports.down = async function (knex: Knex): Promise<any> {
    let roles = knex.table("role");
    roles.where({ name: "admin" });
    roles.orWhere({ name: "manager" });
    roles.orWhere({ name: "team member" });
    await roles.del();
};
