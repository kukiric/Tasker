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
                handler: async ({ tagId }) => {
                    return await Tag.query().findById(tagId) || this.notFound(tagId);
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
                handler: async ({ tagId, ...body }) => {
                    let tag = await Tag.query()
                        .update(body).where({ id: tagId })
                        .returning("*").first();
                    return tag ? tag : this.notFound(tagId);
                }
            }
        },
        DELETE: {
            "/tags/{tagId}": {
                roles: [ADMIN],
                paramsValidator: this.idValidator("tagId"),
                handler: async ({ tagId }, h) => {
                    let deleted = await Tag.query().del().where({ id: tagId });
                    if (deleted) {
                        return h.response().code(204);
                    }
                    return this.notFound(tagId);
                }
            }
        }
    };
}
