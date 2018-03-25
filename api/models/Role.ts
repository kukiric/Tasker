import { Model, RelationMappings } from "objection";

export default class Role extends Model {
    public static tableName = "role";
    public id!: number;
    public name?: string;
}
