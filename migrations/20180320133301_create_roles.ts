import * as Knex from "knex";

exports.up = async function (knex: Knex): Promise<any> {
    let roles = knex.table("role");
    await roles.insert({ id: 1, name: "Admin" });
    await roles.insert({ id: 2, name: "Manager" });
    await roles.insert({ id: 3, name: "Team Member" });
};

exports.down = async function (knex: Knex): Promise<any> {
    let roles = knex.table("role");
    roles.where({ name: "Admin" });
    roles.orWhere({ name: "Manager" });
    roles.orWhere({ name: "Team Member" });
    await roles.del();
};
