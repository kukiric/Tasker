import { Request, ResponseToolkit } from "hapi";
import Controller, { RouteDefinitions } from "api/controllers/Controller";
import User from "api/models/User";
import * as Boom from "boom";
import * as Joi from "joi";

export default class UserController implements Controller {

    // Erros padrões
    private notFound(id: any) {
        return Boom.notFound(`User with id ${id} not found`);
    }

    // Validadores
    private idValidator = {
        id: Joi.number().required()
    };

    private userValidator = {
        id: Joi.forbidden(),
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        fullname: Joi.string().required(),
        password: Joi.string().min(6).required(),
        role_id: Joi.number()
    };

    // Rotas
    public routes: RouteDefinitions = {
        GET: {
            "/users": {
                handler: async () => {
                    return await User.query().eager("role").select("*");
                }
            },
            "/users/{id}": {
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
                payloadValidator: this.userValidator,
                handler: async ({ ...body }, h) => {
                    let newUser = await User.query()
                        .eager("[role, projects, work_items, tasks]")
                        .insert(body).returning("*");
                    return h.response(newUser).code(201);
                }
            }
        },
        PUT: {
            "/users/{id}": {
                paramsValidator: this.idValidator,
                payloadValidator: this.userValidator,
                handler: async ({ id, ...body }) => {
                    let user = await User.query()
                        .eager("role").update(body).where({ id: id })
                        .returning("*").first();
                    return user ? user : this.notFound(id);
                }
            }
        },
        DELETE: {
            "/users/{id}": {
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
