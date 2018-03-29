import * as Knex from "knex";

exports.up = async function (knex: Knex): Promise<any> {
    return knex.schema.createTable("tag_project", table => {
        table.integer("tag_id").references("tag.id").onDelete("CASCADE");
        table.integer("project_id").references("project.id").onDelete("CASCADE");
        table.primary(["tag_id", "project_id"]);
    });
};

exports.down = async function (knex: Knex): Promise<any> {
    return knex.schema.dropTable("tag_project");
};
