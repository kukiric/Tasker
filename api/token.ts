import { RoleType } from "api/models/Role";

/**
 * Token assinada e codificada pelo JWT
 */
export type EncodedToken = string;

/**
 * Token decodificada disponível na aplicação
 */
export interface DecodedToken {
    uid: number;
    role?: RoleType;
}

/**
 * Objeto retornado do AuthController com token e dados do usuário
 */
export interface AuthData {
    username: string;
    fullname: string;
    role: string;
    id: number;
    token: string;
}
