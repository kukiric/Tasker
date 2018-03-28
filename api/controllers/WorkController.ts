import BaseController, { RouteDefinitions } from "api/controllers/BaseController";
import { EVERYONE, ADMIN, MANAGER, TEAM_MEMBER } from "api/models/Role";
import Work from "api/models/Work";

export default class WorkController extends BaseController {
    protected modelClass = Work;

    // Rotas
    public routes: RouteDefinitions = {
        GET: {
            "/work_items": {
                roles: EVERYONE,
                handler: async () => {
                    return await Work.query().select("*");
                }
            },
            "/work_items/{id}": {
                roles: EVERYONE,
                paramsValidator: this.idValidator(),
                handler: async ({ id }) => {
                    return await Work.query().eager("[user, task]").findById(id) || this.notFound(id);
                }
            }
        },
        POST: {
            "/work_items": {
                roles: EVERYONE,
                payloadValidator: Work.validator,
                handler: async ({ ...body }, h) => {
                    let newWork = await Work.query().eager("[user, task]").insert(body).returning("*");
                    return h.response(newWork).code(201);
                }
            }
        },
        PUT: {
            "/work_items/{id}": {
                roles: EVERYONE,
                paramsValidator: this.idValidator(),
                payloadValidator: Work.validator,
                handler: async ({ id, ...body }) => {
                    let work = await Work.query()
                        .eager("[user, task]").update(body).where({ id: id })
                        .returning("*").first();
                    return work ? work : this.notFound(id);
                }
            }
        },
        DELETE: {
            "/work_items/{id}": {
                roles: EVERYONE,
                paramsValidator: this.idValidator(),
                handler: async ({ id }, h) => {
                    let deleted = await Work.query().del().where({ id: id });
                    if (deleted) {
                        return h.response().code(204);
                    }
                    return this.notFound(id);
                }
            }
        }
    };
}
