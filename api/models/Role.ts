import { Model } from "objection";
import { RoleStub } from "api/stubs";

export default class Role extends Model implements RoleStub {
    public id!: number;
    public name?: string;
}

// Valores do banco de dados
export const ADMIN = 1;
export const MANAGER = 2;
export const TEAM_MEMBER = 3;
export type AllowedRole = 1 | 2 | 3;
export const EVERYONE: AllowedRole[] = [ADMIN, MANAGER, TEAM_MEMBER];
export function getRoleName(id: AllowedRole) {
    switch (id) {
        case 1: return "ADMIN";
        case 2: return "MANAGER";
        case 3: return "TEAM_MEMBER";
    }
}
