import { Model, RelationMappings } from "objection";

export default class Work extends Model {
    public static tableName = "work";
    public id!: number;
    public hours!: number;
    public start_time?: Date;
    public end_time?: Date;
    public user_id?: number;
    public task_id?: number;
}
