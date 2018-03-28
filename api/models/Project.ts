import { Model, RelationMappings, Pojo } from "objection";
import * as Joi from "joi";

export default class Project extends Model {
    public static tableName = "project";
    public id!: number;
    public name!: string;
    public due_date!: Date;
    public status!: string;
    public manager_id?: number;
    public manager?: any;
    public versions?: any;
    public tasks?: any;
    public users?: any;
    public tags?: any;

    public static validStatuses = ["Novo", "Em andamento", "Concluído"];

    public static validator = {
        id: Joi.forbidden(),
        name: Joi.string().required().example("Projeto Exemplo"),
        due_date: Joi.date().required().example("2018-12-31"),
        status: Joi.string().only(Project.validStatuses).required(),
        manager_id: Joi.number().optional().example(1)
    };

    public static get relationMappings(): RelationMappings {
        const Version = require("api/models/Version").default;
        const Task = require("api/models/Task").default;
        const User = require("api/models/User").default;
        const Tag = require("api/models/Tag").default;
        return {
            manager: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: "project.manager_id",
                    to: "user.id"
                }
            },
            versions: {
                relation: Model.HasManyRelation,
                modelClass: Version,
                join: {
                    from: "project.id",
                    to: "version.project_id"
                }
            },
            tasks: {
                relation: Model.HasManyRelation,
                modelClass: Task,
                join: {
                    from: "project.id",
                    to: "task.project_id"
                }
            },
            users: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: "project.id",
                    through: {
                        from: "project_user.project_id",
                        to: "project_user.user_id"
                    },
                    to: "user.id"
                }
            },
            tags: {
                relation: Model.ManyToManyRelation,
                modelClass: Tag,
                join: {
                    from: "project.id",
                    through: {
                        from: "tag_project.project_id",
                        to: "tag_project.tag_id"
                    },
                    to: "tag.id"
                }
            }
        };
    }

    public $formatJson(json: Pojo) {
        // Remove todos os IDs de joins para deixar o JSON mais limpo
        delete json.manager_id;
        return super.$formatJson(json);
    }
}
