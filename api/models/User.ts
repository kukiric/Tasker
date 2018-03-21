import { Model, RelationMappings, Pojo } from "objection";

export default class User extends Model {

    public static tableName = "user";

    public static get relationMappings(): RelationMappings {

        const Project = require("api/models/Project").default;
        const Role = require("api/models/Role").default;
        const Work = require("api/models/Work").default;
        const Task = require("api/models/Task").default;

        return {
            // Relação User <- Role
            role: {
                relation: Model.HasOneRelation,
                modelClass: Role,
                join: {
                    from: "user.role_id",
                    to: "role.id"
                }
            },
            // Relação User <= Work
            work_items: {
                relation: Model.HasManyRelation,
                modelClass: Work,
                join: {
                    from: "user.id",
                    to: "work.user_id"
                }
            },
            // Relação User <=> Project
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
            // Relação User <=> Task
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

    public static eagerQuery() {
        return this.query().eager("[role, projects, work_items, tasks]");
    }

    public $formatJson(json: Pojo) {
        // Remove informações sensíveis
        delete json.password;
        // Remove IDs de joins
        delete json.role_id;
        // Insere valores unitários direto no objeto-raiz
        if (json.role) {
            json.role = json.role.name;
        }
        return super.$formatJson(json);
    }
}
