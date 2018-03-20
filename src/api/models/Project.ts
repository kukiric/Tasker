import { Model, RelationMappings } from "objection";
import Version from "api/models/Version";
import Task from "api/models/Project";
import User from "api/models/User";

export default class Project extends Model {
    public static tableName = "project";
    public static relationMappings: RelationMappings = {
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
        }
    };
}
