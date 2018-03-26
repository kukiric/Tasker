import { Model, RelationMappings, Pojo } from "objection";

export default class Work extends Model {
    public static tableName = "work";
    public id!: number;
    public hours!: number;
    public start_time?: Date;
    public end_time?: Date;
    public user_id?: number;
    public task_id?: number;

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
        // Insere as foreign keys dentro de objetos para compatibilidade entre GET / e GET /id
        if (!json.user) {
            json.user = { id: json.user_id };
        }
        if (!json.task) {
            json.task = { id: json.task_id };
        }
        // Remove as foreign keys
        delete json.task_id;
        delete json.user_id;
        return super.$formatJson(json);
    }
}
