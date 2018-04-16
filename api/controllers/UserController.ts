import BaseController, { RouteDefinitions } from "api/controllers/BaseController";
import { EVERYONE, ADMIN, MANAGER, TEAM_MEMBER } from "api/models/Role";
import User from "api/models/User";

export default class UserController extends BaseController {
    protected modelClass = User;

    // Rotas
    public routes: RouteDefinitions = {
        GET: {
            "/users": {
                roles: EVERYONE,
                queryValidator: this.includeValidator(User.relationMappings),
                handler: async ({ include }) => {
                    return await User.query().eager(this.makeEager(include));
                }
            },

            "/users/{userId}": {
                roles: EVERYONE,
                paramsValidator: this.idValidator("userId"),
                queryValidator: this.includeValidator(User.relationMappings),
                handler: async ({ userId, include }) => {
                    let user = await User.query().eager(this.makeEager(include)).findById(userId);
                    return user ? user : this.notFound(userId);
                }
            },

            "/users/{userId}/projects": {
                roles: EVERYONE,
                paramsValidator: this.idValidator("userId"),
                queryValidator: this.includeValidator(User.relationMappings),
                handler: async ({ userId, include }) => {
                    let user = await User.query().eager(this.makeEager(include)).findById(userId);
                    return user ? user.projects : this.notFound(userId);
                }
            },

            "/users/{userId}/tasks": {
                roles: EVERYONE,
                paramsValidator: this.idValidator("userId"),
                queryValidator: this.includeValidator(User.relationMappings),
                handler: async ({ userId, include }) => {
                    let user = await User.query().eager(this.makeEager(include)).findById(userId);
                    return user ? user.tasks : this.notFound(userId);
                }
            },
            "/users/{userId}/work_items": {
                roles: EVERYONE,
                paramsValidator: this.idValidator("userId"),
                queryValidator: this.includeValidator(User.relationMappings),
                handler: async ({ userId, include }) => {
                    let user = await User.query().eager(this.makeEager(include)).findById(userId);
                    return user ? user.work_items : this.notFound(userId);
                }
            }
        },
        POST: {
            "/users": {
                authRequired: false,
                payloadValidator: User.validator,
                handler: async ({ ...body }, h) => {
                    // Cria todo usuário como membro comum
                    body.role_id = 3;
                    let newUser = await User.query().eager("role")
                        .insert(body).returning("*").first();
                    return h.response(newUser).code(201);
                }
            }
        },
        PUT: {
            "/users/{userId}": {
                roles: [ADMIN],
                paramsValidator: this.idValidator("userId"),
                payloadValidator: User.validator,
                handler: async ({ userId, ...body }) => {
                    let user = await User.query()
                        .eager("[role, projects, work_items, tasks]")
                        .update(body).findById(userId).returning("*");
                    return user ? user : this.notFound(userId);
                }
            }
        },
        DELETE: {
            "/users/{userId}": {
                roles: [ADMIN],
                paramsValidator: this.idValidator("userId"),
                handler: async ({ userId }, h) => {
                    let deleted = await User.query().deleteById(userId);
                    if (deleted) {
                        return h.response().code(204);
                    }
                    return this.notFound(userId);
                }
            }
        }
    };
}
