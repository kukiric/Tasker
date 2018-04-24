import { RoleStub, RoleType } from "api/stubs";
import { Model } from "objection";

export default class Role extends Model implements RoleStub {
    public static tableName = "role";
    public id!: number;
    public name!: string;
}

// Re-definição dos tipos de usuário para uso interno da API
export type RoleType = RoleType;
export const ADMIN = RoleType.ADMIN;
export const MANAGER = RoleType.MANAGER;
export const TEAM_MEMBER = RoleType.TEAM_MEMBER;
export const EVERYONE: RoleType[] = [ADMIN, MANAGER, TEAM_MEMBER];

export function getRoleName(id: RoleType) {
    switch (id) {
        case 1: return "ADMIN";
        case 2: return "MANAGER";
        case 3: return "TEAM_MEMBER";
        default: throw new Error("Invalid enumeration value: " + id);
    }
}
