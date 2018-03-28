import Controller, { RouteDefinitions } from "api/controllers/Controller";
import TokenStorage, { DecodedToken } from "api/tokens";
import User from "api/models/User";
import * as JWT from "jsonwebtoken";
import * as assert from "assert";
import * as bcrypt from "bcrypt";
import * as Boom from "boom";
import * as Joi from "joi";

export default class AuthController implements Controller {

    private authValidator = {
        username: Joi.string().required().example("admin"),
        password: Joi.string().min(6).max(72).required().example("admin123")
    };

    private tokens: { [key: string]: string } = {};

    public routes: RouteDefinitions = {
        GET: {
            "/auth": {
                auth: "jwt",
                handler: async ({}, h, request) => {
                    return request.auth.credentials;
                }
            }
        },
        POST: {
            "/auth": {
                payloadValidator: this.authValidator,
                handler: async ({ username, password }, h, request) => {
                    // Checa a validez da chave secreta
                    let key = process.env.SECRET_KEY;
                    assert(key && key.length > 32, "A chave secreta do JWT deve conter pelo menos 32 caracteres");
                    // Busca o usuário e checa suas credenciais
                    let user = await User.query().findOne({ username });
                    if (user && await bcrypt.compare(password, user.password)) {
                        // Cria os dados do JWT
                        let payload: DecodedToken = {
                            user: username,
                            uid: user.id,
                            role: user.role_id || null
                        };
                        // Grava a token em memória
                        TokenStorage[username] = payload;
                        // Retorna a nova token para o usuário
                        return {
                            username: username,
                            token: JWT.sign(payload, key!)
                        };
                    }
                    // Recusa as credenciais do usuário
                    return Boom.unauthorized("Incorrect username or password");
                }
            }
        },
        DELETE: {
            "/auth": {
                handler: async () => {
                    return Boom.notImplemented();
                }
            }
        }
    };
}
