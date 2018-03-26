import { Model, RelationMappings, Pojo } from "objection";

export default class Version extends Model {
    public static tableName = "version";
    public id!: number;
    public name!: string;
    public type!: string;

    public static get relationMappings(): RelationMappings {
        const Project = require("api/models/Project").default;
        return {
            project: {
                relation: Model.BelongsToOneRelation,
                modelClass: Project,
                join: {
                    from: "version.project_id",
                    to: "project.id"
                }
            }
        };
    }

    public $formatJson(json: Pojo) {
        if (json.project) {
            // Insere o nome do projeto direto no json
            json.project_name = json.project.name;
            // Remove o projeto antes de enviar
            delete json.project;
        }
        return super.$formatJson(json);
    }
}
