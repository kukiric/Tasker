import Controller, { RouteDefinitions } from "api/controllers/Controller";
import Version from "api/models/Version";
import * as Boom from "boom";
import * as Joi from "joi";

export default class VersionController implements Controller {

    // Erro padrão
    private notFound(id: any) {
        return Boom.notFound(`Version with id ${id} not found`);
    }

    // Validadores
    private types = ["Passado", "Presente", "Futuro"];

    private idValidator = {
        id: Joi.number().required()
    };

    private versionValidator = {
        id: Joi.forbidden(),
        name: Joi.string().required(),
        type: Joi.string().only(this.types).required(),
        project_id: Joi.number().required()
    };

    // Rotas
    public routes: RouteDefinitions = {
        GET: {
            "/versions": {
                handler: async () => {
                    return await Version.query().eager("project").select("*");
                }
            },
            "/versions/{id}": {
                paramsValidator: this.idValidator,
                handler: async ({ id }) => {
                    return await Version.query().eager("project").findById(id) || this.notFound(id);
                }
            }
        },
        POST: {
            "/versions": {
                payloadValidator: this.versionValidator,
                handler: async ({ ...body }, h) => {
                    let newVersion = await Version.query().eager("project").insert(body).returning("*");
                    return h.response(newVersion).code(201);
                }
            }
        },
        PUT: {
            "/versions/{id}": {
                paramsValidator: this.idValidator,
                payloadValidator: this.versionValidator,
                handler: async ({ id, ...body }) => {
                    let version = await Version.query()
                        .eager("project").update(body).where({ id: id })
                        .returning("*").first();
                    return version ? version : this.notFound(id);
                }
            }
        },
        DELETE: {
            "/versions/{id}": {
                paramsValidator: this.idValidator,
                handler: async ({ id }, h) => {
                    let deleted = await Version.query().del().where({ id: id });
                    if (deleted) {
                        return h.response().code(204);
                    }
                    return this.notFound(id);
                }
            }
        }
    };
}
