import { Model, RelationMappings, Pojo } from "objection";
import * as Joi from "joi";

export default class Task extends Model {
    public static tableName = "task";
    public id!: number;
    public description!: string;
    public due_date?: Date;
    public estimate_work_hour?: number;
    public type!: string;
    public status!: string;
    public progress?: number;
    public project_id?: number;
    public parent_id?: number;
    public version_id?: number;

    public static validTypes = ["Bug", "Funcionalidade"];
    public static validStatuses = ["Nova", "Atribuída", "Em Desenvolvimento", "Requer Teste", "Concluída"];

    public static validator = {
        id: Joi.forbidden(),
        description: Joi.string().required().example("Tarefa Exemplo"),
        due_date: Joi.date().optional().example("2018-06-30"),
        estimate_work_hour: Joi.number().optional().example(16),
        type: Joi.string().only(Task.validTypes).required().example("Funcionalidade"),
        status: Joi.string().only(Task.validStatuses).required(),
        progress: Joi.number().optional().example(0),
        project_id: Joi.number().forbidden(),
        parent_id: Joi.number().optional(),
        version_id: Joi.number().optional()
    };

    public static get relationMappings(): RelationMappings {
        const Project = require("api/models/Project").default;
        const Version = require("api/models/Version").default;
        const Work = require("api/models/Work").default;
        const User = require("api/models/User").default;
        return {
            project: {
                relation: Model.BelongsToOneRelation,
                modelClass: Project,
                join: {
                    from: "task.project_id",
                    to: "project.id"
                }
            },
            parent: {
                relation: Model.BelongsToOneRelation,
                modelClass: Task,
                join: {
                    from: "task.parent_id",
                    to: "task.id"
                }
            },
            children: {
                relation: Model.HasManyRelation,
                modelClass: Task,
                join: {
                    from: "task.id",
                    to: "task.parent_id"
                }
            },
            version: {
                relation: Model.HasOneRelation,
                modelClass: Version,
                join: {
                    from: "task.version_id",
                    to: "version.id"
                }
            },
            work_items: {
                relation: Model.HasManyRelation,
                modelClass: Work,
                join: {
                    from: "task.id",
                    to: "work.task_id"
                }
            },
            users: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: "task.id",
                    through: {
                        from: "task_user.task_id",
                        to: "task_user.user_id"
                    },
                    to: "user.id"
                }
            }
        };
    }

    public $formatJson(json: Pojo) {
        // Remove os IDs de joins
        delete json.project_id;
        delete json.parent_id;
        delete json.version_id;
        return super.$formatJson(json);
    }
}
