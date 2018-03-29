import { Model, RelationMappings, Pojo } from "objection";
import * as Joi from "joi";

export default class Work extends Model {
    public static defaultEagerAlgorithm = Model.JoinEagerAlgorithm;
    public static tableName = "work";
    public id!: number;
    public hours!: number;
    public start_time?: Date;
    public end_time?: Date;
    public task_id?: number;
    public user_id?: number;

    public static validator = {
        id: Joi.forbidden(),
        hours: Joi.number().required().example(4),
        start_time: Joi.date().optional(),
        end_time: Joi.date().optional(),
        task_id: Joi.number().forbidden(),
        user_id: Joi.number().required().example(1)
    };

    public static get relationMappings(): RelationMappings {
        const Task = require("api/models/Task").default;
        const User = require("api/models/User").default;
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: "work.user_id",
                    to: "user.id"
                }
            },
            task: {
                relation: Model.BelongsToOneRelation,
                modelClass: Task,
                join: {
                    from: "work.task_id",
                    to: "task.id"
                }
            }
        };
    }

    public $formatJson(json: Pojo) {
        // Remove as foreign keys
        delete json.task_id;
        delete json.user_id;
        return super.$formatJson(json);
    }
}
