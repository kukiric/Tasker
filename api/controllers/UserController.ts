import Controller, { RouteDefinitions } from "api/controllers/Controller";
import User from "api/models/User";
import * as Boom from "boom";
import * as Joi from "joi";
import { ADMIN, EVERYONE } from "../models/Role";

export default class UserController implements Controller {

    // Erro padrão
    private notFound(id: any) {
        return Boom.notFound(`User with id ${id} not found`);
    }

    // Validadores
    private idValidator = {
        id: Joi.number().required().example(1)
    };

    private userValidator = {
        id: Joi.forbidden(),
        username: Joi.string().required().example("TestUser"),
        email: Joi.string().email().required().example("test.user@example.com"),
        fullname: Joi.string().required().example("Usuário de Teste"),
        password: Joi.string().min(6).max(72).required().example("senha123"),
        role_id: Joi.number().optional().example(2)
    };

    // Rotas
    public routes: RouteDefinitions = {
        GET: {
            "/users": {
                roles: EVERYONE,
                handler: async () => {
                    return await User.query().eager("role").select("*");
                }
            },
            "/users/{id}": {
                roles: EVERYONE,
                paramsValidator: this.idValidator,
                handler: async ({ id }) => {
                    let user = await User.query()
                        .eager("[role, projects, work_items, tasks]")
                        .select("*").where("id", id).first();
                    return user ? user : this.notFound(id);
                }
            }
        },
        POST: {
            "/users": {
                roles: [ADMIN],
                payloadValidator: this.userValidator,
                handler: async ({ ...body }, h) => {
                    let newUser = await User.query()
                        .eager("[role, projects, work_items, tasks]")
                        .insert(body).returning("*").first();
                    return h.response(newUser).code(201);
                }
            }
        },
        PUT: {
            "/users/{id}": {
                roles: [ADMIN],
                paramsValidator: this.idValidator,
                payloadValidator: this.userValidator,
                handler: async ({ id, ...body }) => {
                    let user = await User.query()
                        .eager("[role, projects, work_items, tasks]").update(body).where({ id: id })
                        .returning("*").first();
                    return user ? user : this.notFound(id);
                }
            }
        },
        DELETE: {
            "/users/{id}": {
                roles: [ADMIN],
                paramsValidator: this.idValidator,
                handler: async ({ id }, h) => {
                    let deleted = await User.query().del().where({ id: id });
                    if (deleted) {
                        return h.response().code(204);
                    }
                    return this.notFound(id);
                }
            }
        }
    };
}
