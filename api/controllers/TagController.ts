import Controller, { RouteDefinitions } from "api/controllers/Controller";
import Tag from "api/models/Tag";
import * as Boom from "boom";
import * as Joi from "joi";

export default class TagController implements Controller {

    // Erro padrão
    private notFound(id: any) {
        return Boom.notFound(`Tag with id ${id} not found`);
    }

    // Validadores
    private idValidator = {
        id: Joi.number().required().example(1)
    };

    private tagValidator = {
        id: Joi.forbidden(),
        name: Joi.string().required().example("Mobile")
    };

    // Rotas
    public routes: RouteDefinitions = {
        GET: {
            "/tags": {
                handler: async () => {
                    return await Tag.query().select("*");
                }
            },
            "/tags/{id}": {
                paramsValidator: this.idValidator,
                handler: async ({ id }) => {
                    return await Tag.query().findById(id) || this.notFound(id);
                }
            }
        },
        POST: {
            "/tags": {
                payloadValidator: this.tagValidator,
                handler: async ({ ...body }, h) => {
                    let newTag = await Tag.query().insert(body).returning("*");
                    return h.response(newTag).code(201);
                }
            }
        },
        PUT: {
            "/tags/{id}": {
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
