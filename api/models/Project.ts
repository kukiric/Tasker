import { Model, RelationMappings } from "objection";

export default class Project extends Model {
    public static tableName = "project";
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
}
