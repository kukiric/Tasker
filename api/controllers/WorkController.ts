import Controller, { RouteDefinitions } from "api/controllers/Controller";
import Work from "api/models/Work";
import * as Boom from "boom";
import * as Joi from "joi";

export default class WorkController implements Controller {

    // Erro padrão
    private notFound(id: any) {
        return Boom.notFound(`Work Item with id ${id} not found`);
    }

    // Validadores
    private idValidator = {
        id: Joi.number().required().example(1)
    };

    private workValidator = {
        id: Joi.forbidden(),
        hours: Joi.number().required().example(4),
        start_time: Joi.date().optional(),
        end_time: Joi.date().optional(),
        user_id: Joi.number().required().example(1),
        task_id: Joi.number().required().example(1)
    };

    // Rotas
    public routes: RouteDefinitions = {
        GET: {
            "/work_items": {
                handler: async () => {
                    return await Work.query().select("*");
                }
            },
            "/work_items/{id}": {
                paramsValidator: this.idValidator,
                handler: async ({ id }) => {
                    return await Work.query().eager("[user, task]").findById(id) || this.notFound(id);
                }
            }
        },
        POST: {
            "/work_items": {
                payloadValidator: this.workValidator,
                handler: async ({ ...body }, h) => {
                    let newWork = await Work.query().eager("[user, task]").insert(body).returning("*");
                    return h.response(newWork).code(201);
                }
            }
        },
        PUT: {
            "/work_items/{id}": {
                paramsValidator: this.idValidator,
                payloadValidator: this.workValidator,
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
                paramsValidator: this.idValidator,
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
