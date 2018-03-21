import { Model, RelationMappings } from "objection";

export default class Task extends Model {
    public static tableName = "task";
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
}