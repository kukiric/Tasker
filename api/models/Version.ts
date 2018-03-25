import { Model, RelationMappings } from "objection";

export default class Version extends Model {
    public static tableName = "version";
    public id!: number;
    public name!: string;
    public type!: string;
}
