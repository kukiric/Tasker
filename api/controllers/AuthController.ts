import Controller, { RouteDefinitions } from "api/controllers/Controller";
import User from "api/models/User";
import * as JWT from "jsonwebtoken";
import * as assert from "assert";
import * as Boom from "boom";
import * as Joi from "joi";

export default class AuthController implements Controller {

    private authValidator = {
        username: Joi.string().required().example("admin"),
        password: Joi.string().required().example("admin")
    };

    private tokens: { [key: string]: string } = {};

    public routes: RouteDefinitions = {
        POST: {
            "/auth": {
                payloadValidator: this.authValidator,
                handler: async ({ username, password }, h, request) => {
                    // Checa a validez da chave secreta
                    let key = process.env.SECRET_KEY;
                    assert(key && key.length > 32, "JWT secret key must be at least 32 characters long");
                    // Busca o usuário
                    let user = await User.query().findOne({ username });
                    if (user && user.password === password) {
                        // Cria os dados do JWT
                        let payload = {
                            name: username,
                            uid: user.id,
                            role: user.role_id
                        };
                        // Retorna a nova token para o usuário
                        return {
                            username: username,
                            token: JWT.sign(payload, key!)
                        };
                    }
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
