export interface DecodedToken {
    user: string;
    uid: number;
    role: number | null;
}

// Armazena as tokens ativas em memória
export default {} as {
    [username: string]: DecodedToken
};
