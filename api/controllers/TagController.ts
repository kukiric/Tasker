import BaseController, { RouteDefinitions } from "api/controllers/BaseController";
import { EVERYONE, ADMIN, MANAGER, TEAM_MEMBER } from "api/models/Role";
import Tag from "api/models/Tag";

export default class TagController extends BaseController {
    protected modelClass = Tag;

    // Rotas
    public routes: RouteDefinitions = {
        GET: {
            "/tags": {
                roles: EVERYONE,
                handler: async () => {
                    return await Tag.query().select("*");
                }
            },
            "/tags/{tagId}": {
                roles: EVERYONE,
                paramsValidator: this.idValidator("tagId"),
                handler: async ({ id }) => {
                    return await Tag.query().findById(id) || this.notFound(id);
                }
            }
        },
        POST: {
            "/tags": {
                roles: [ADMIN],
                payloadValidator: Tag.validator,
                handler: async ({ ...body }, h) => {
                    let newTag = await Tag.query().insert(body).returning("*");
                    return h.response(newTag).code(201);
                }
            }
        },
        PUT: {
            "/tags/{tagId}": {
                roles: [ADMIN],
                paramsValidator: this.idValidator("tagId"),
                payloadValidator: Tag.validator,
                handler: async ({ id, ...body }) => {
                    let tag = await Tag.query()
                        .update(body).where({ id: id })
                        .returning("*").first();
                    return tag ? tag : this.notFound(id);
                }
            }
        },
        DELETE: {
            "/tags/{tagId}": {
                roles: [ADMIN],
                paramsValidator: this.idValidator("tagId"),
                handler: async ({ id }, h) => {
                    let deleted = await Tag.query().del().where({ id: id });
                    if (deleted) {
                        return h.response().code(204);
                    }
                    return this.notFound(id);
                }
            }
        }
    };
}
