import { Model, RelationMappings, Pojo } from "objection";
import Project from "api/models/Project";
import * as Joi from "joi";

export default class Version extends Model {
    public static defaultEagerAlgorithm = Model.JoinEagerAlgorithm;
    public static tableName = "version";
    public id!: number;
    public name!: string;
    public type!: string;

    public static validTypes = ["Passado", "Presente", "Futuro"];

    public static validator = {
        id: Joi.forbidden(),
        name: Joi.string().required().example("1.0.1"),
        type: Joi.string().only(Version.validTypes).required().example("Futuro"),
        project_id: Joi.number().required().example(1)
    };

    public static get relationMappings(): RelationMappings {
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
        // Remove as foreign keys
        delete json.project_id;
        return super.$formatJson(json);
    }
}
