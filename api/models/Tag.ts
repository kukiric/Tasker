import { Model } from "objection";

export default class Tag extends Model {
    public static tableName = "tag";
    public id!: number;
    public name!: string;
}
