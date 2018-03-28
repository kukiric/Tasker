import { Model, RelationMappings } from "objection";

export default class Role extends Model {
    public static tableName = "role";
    public id!: number;
    public name?: string;
}

// Valores do banco de dados
export const ADMIN = 1;
export const MANAGER = 2;
export const TEAM_MEMBER = 3;
export type AllowedRole = 1 | 2 | 3;
export const EVERYONE: AllowedRole[] = [ADMIN, MANAGER, TEAM_MEMBER];
