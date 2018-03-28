import { Model, RelationMappings } from "objection";

export default class Role extends Model {
    public static tableName = "role";
    public id!: number;
    public name?: string;

    // Valores do banco de dados
    public static ADMIN = 1;
    public static MANAGER = 2;
    public static TEAM_MEMBER = 3;
}
