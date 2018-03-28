import BaseController, { RouteDefinitions } from "api/controllers/BaseController";
import { EVERYONE, ADMIN, MANAGER, TEAM_MEMBER } from "api/models/Role";
import Tag from "api/models/Tag";
import * as Boom from "boom";
import * as Joi from "joi";

export default class TagController extends BaseController {

    // Erro padrão
    private notFound(id: any) {
        return Boom.notFound(`Tag with id ${id} not found`);
    }

    // Rotas
    public routes: RouteDefinitions = {
        GET: {
            "/tags": {
                roles: EVERYONE,
                handler: async () => {
                    return await Tag.query().select("*");
                }
            },
            "/tags/{id}": {
                roles: EVERYONE,
                paramsValidator: this.idValidator,
                handler: async ({ id }) => {
                    return await Tag.query().findById(id) || this.notFound(id);
                }
            }
        },
        POST: {
            "/tags": {
                roles: [ADMIN, MANAGER],
                payloadValidator: this.tagValidator,
                handler: async ({ ...body }, h) => {
                    let newTag = await Tag.query().insert(body).returning("*");
                    return h.response(newTag).code(201);
                }
            }
        },
        PUT: {
            "/tags/{id}": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.idValidator,
                payloadValidator: this.tagValidator,
                handler: async ({ id, ...body }) => {
                    let tag = await Tag.query()
                        .update(body).where({ id: id })
                        .returning("*").first();
                    return tag ? tag : this.notFound(id);
                }
            }
        },
        DELETE: {
            "/tags/{id}": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.idValidator,
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
