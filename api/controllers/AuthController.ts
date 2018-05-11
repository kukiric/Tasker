import BaseController, { RouteDefinitions } from "api/controllers/BaseController";
import { RoleType, EVERYONE } from "api/models/Role";
import { AuthResponse, DecodedToken } from "api/stubs";
import NullModel from "api/models/NullModel";
import User from "api/models/User";
import * as JWT from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import * as assert from "assert";
import * as Boom from "boom";
import * as Joi from "joi";

export default class AuthController extends BaseController {
    protected modelClass = NullModel;

    private authValidator = {
        username: Joi.string().required().example("admin"),
        password: Joi.string().min(6).max(72).required().example("admin123")
    };

    public routes: RouteDefinitions = {
        GET: {
            "/auth": {
                roles: EVERYONE,
                handler: async ({}, h, request) => {
                    return request.auth.credentials;
                }
            }
        },
        POST: {
            "/auth": {
                authRequired: false,
                payloadValidator: this.authValidator,
                handler: async ({ username, password }, h, request) => {
                    // Checa a validez da chave secreta
                    let key = process.env.SECRET_KEY;
                    assert(key && key.length > 32, "A chave secreta do JWT deve conter pelo menos 32 caracteres");
                    // Busca o usuário e checa suas credenciais
                    let user = await User.query().eager("role").findOne({ username });
                    if (user && user.role && await bcrypt.compare(password, user.password)) {
                        // Monta os dados da JWT
                        let payload: DecodedToken = {
                            uid: user.id,
                            role: user.role.id
                        };
                        // Gera a nova token
                        let token = JWT.sign(payload, key!, { expiresIn: "30d" });
                        // Retorna a token e os dados do usuário
                        let response: AuthResponse = { user, token };
                        return response;
                    }
                    // Recusa credenciais inválidos
                    return Boom.unauthorized("Incorrect username or password");
                }
            }
        }
    };
}
