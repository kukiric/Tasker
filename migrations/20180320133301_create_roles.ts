import * as Knex from "knex";

exports.up = async function (knex: Knex): Promise<any> {
    let roles = knex.table("role");
    await roles.insert({ name: "Admin" });
    await roles.insert({ name: "Manager" });
    await roles.insert({ name: "Team Member" });
};

exports.down = async function (knex: Knex): Promise<any> {
    let roles = knex.table("role");
    roles.where({ name: "Admin" });
    roles.orWhere({ name: "Manager" });
    roles.orWhere({ name: "Team Member" });
    await roles.del();
};
