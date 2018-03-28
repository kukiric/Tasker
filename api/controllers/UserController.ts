import BaseController, { RouteDefinitions } from "api/controllers/BaseController";
import { EVERYONE, ADMIN, MANAGER, TEAM_MEMBER } from "api/models/Role";
import User from "api/models/User";
import * as Boom from "boom";
import * as Joi from "joi";

export default class UserController extends BaseController {
    protected modelClass = User;

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
                paramsValidator: this.idValidator(),
                handler: async ({ id }) => {
                    let user = await User.query()
                        .eager("[role, projects, work_items, tasks]")
                        .select("*").where("id", id).first();
                    return user ? user : this.notFound(id);
                }
            },
            "/users/{id}/projects": {
                roles: EVERYONE,
                paramsValidator: this.idValidator(),
                handler: async ({ id }) => {
                    let user = await User.query()
                        .eager("projects.[manager, versions, tasks, users, tags]").select("*")
                        .findById(id) as any;
                    return user ? user.projects : this.notFound(id);
                }
            }
        },
        POST: {
            "/users": {
                roles: [ADMIN],
                payloadValidator: User.validator,
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
                paramsValidator: this.idValidator(),
                payloadValidator: User.validator,
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
                paramsValidator: this.idValidator(),
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
