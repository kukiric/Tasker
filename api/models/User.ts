import { Model, RelationMappings, Pojo, QueryContext } from "objection";
import Project from "api/models/Project";
import Role from "api/models/Role";
import Work from "api/models/Work";
import Task from "api/models/Task";
import * as bcrypt from "bcrypt";
import * as Joi from "joi";

export default class User extends Model {
    public static defaultEagerAlgorithm = Model.JoinEagerAlgorithm;
    public static tableName = "user";
    public id!: number;
    public username!: string;
    public email!: string;
    public password!: string;
    public fullname!: string;
    public role_id?: number;
    public work_items?: Work[];
    public projects?: Project[];
    public tasks?: Task[];
    public role?: Role;

    public static validator = {
        id: Joi.forbidden(),
        username: Joi.string().required().example("TestUser"),
        email: Joi.string().email().required().example("test.user@example.com"),
        fullname: Joi.string().required().example("Usuário de Teste"),
        password: Joi.string().min(6).max(72).required().example("senha123"),
        role_id: Joi.number().optional().example(2)
    };

    public static get relationMappings(): RelationMappings {
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
