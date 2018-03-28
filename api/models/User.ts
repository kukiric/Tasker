import { Model, RelationMappings, Pojo, QueryContext } from "objection";
import * as bcrypt from "bcrypt";

export default class User extends Model {
    public static tableName = "user";
    public id!: number;
    public username!: string;
    public email!: string;
    public password!: string;
    public fullname!: string;
    public role_id?: number;
    public work_items?: any;
    public projects?: any;
    public tasks?: any;
    public role?: any;

    public static get relationMappings(): RelationMappings {
        const Project = require("api/models/Project").default;
        const Role = require("api/models/Role").default;
        const Work = require("api/models/Work").default;
        const Task = require("api/models/Task").default;
        return {
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

    public async $beforeInsert(context: QueryContext) {
        // Criptografa a senha
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
        super.$beforeInsert(context);
    }

    public $formatJson(json: Pojo) {
        // Remove informações sensíveis
        delete json.password;
        // Remove IDs de joins
        delete json.role_id;
        return super.$formatJson(json);
    }
}
