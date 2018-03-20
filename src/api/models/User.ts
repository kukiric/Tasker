import { Model, RelationMappings } from "objection";
import Role from "api/models/Role";
import Work from "api/models/Work";

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
        }
    };
}
