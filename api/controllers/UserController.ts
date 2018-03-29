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
                handler: async () => {
                    return await User.query().eager("role");
                }
            },
            "/users/{userId}": {
                roles: EVERYONE,
                paramsValidator: this.idValidator(),
                handler: async ({ userId }) => {
                    let user = await User.query().eager("role").findById(userId)
                    return user ? user : this.notFound(userId)
                }
            },
            "/users/{userId}/projects": {
                roles: EVERYONE,
                paramsValidator: this.idValidator(),
                handler: async ({ userId }) => {
                    let user = await User.query().eager("projects").findById(userId)
                    return user ? user.projects : this.notFound(userId)
                }
            },
            "/users/{userId}/tasks": {
                roles: EVERYONE,
                paramsValidator: this.idValidator("userId"),
                handler: async ({ userId }) => {
                    let user = await User.query().eager("tasks.[project]").findById(userId);
                    return user ? user.tasks : this.notFound(userId);
                }
            },
            "/users/{userId}/work_items": {
                roles: EVERYONE,
                paramsValidator: this.idValidator("userId"),
                handler: async ({ userId }) => {
                    let user = await User.query().eager("work_items").findById(userId);
                    return user ? user.work_items : this.notFound(userId);
                }
            }
        },
        POST: {
            "/users": {
                roles: [ADMIN],
                payloadValidator: User.validator,
                handler: async ({ ...body }, h) => {
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
