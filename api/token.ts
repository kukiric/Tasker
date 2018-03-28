import { AllowedRole } from "api/models/Role";

/**
 * Token assinada e codificada pelo JWT
 */
export type EncodedToken = string;

/**
 * Token decodificada disponível na aplicação
 */
export interface DecodedToken {
    user: string;
    uid: number;
    role?: AllowedRole;
}
