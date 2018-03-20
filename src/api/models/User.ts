import { Model, RelationMappings } from "objection";
import Project from "api/models/Project";
import Role from "api/models/Role";
import Work from "api/models/Work";
import Task from "api/models/Task";

export default class User extends Model {
    public static tableName = "user";
    public static relationMappings: RelationMappings = {
        role: {
            relation: Model.HasOneRelation,
            modelClass: Role,
            join: {
                from: "user.role_id",
                to: "role.id"
            }
        },
        work_items: {
            relation: Model.HasManyRelation,
            modelClass: Work,
            join: {
                from: "user.id",
                to: "work.user_id"
            }
        },
        projects: {
            relation: Model.ManyToManyRelation,
            modelClass: Project,
            join: {
                from: "user.id",
                through: {
                    from: "project_user.user_id",
                    to: "project_user.project_id"
                },
                to: "project.id"
            }
        },
        tasks: {
            relation: Model.ManyToManyRelation,
            modelClass: Task,
            join: {
                from: "user.id",
                through: {
                    from: "task_user.user_id",
                    to: "task_user.task_id"
                },
                to: "task.id"
            }
        }
    };
}
