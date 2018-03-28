import { ResponseToolkit } from "hapi";
import Controller, { RouteDefinitions } from "api/controllers/Controller";
import { EVERYONE, ADMIN, MANAGER, TEAM_MEMBER } from "api/models/Role";
import Task from "api/models/Task";
import * as Boom from "boom";
import * as Joi from "joi";

export default class TaskController implements Controller {

    // Erros padrões
    private notFound(id: any) {
        return Boom.notFound(`Project with id ${id} not found`);
    }

    private entityNotFound(entity: string, id: any, otherId: any) {
        return Boom.notFound(`${entity} with id ${otherId} not found in project with id ${id}`);
    }

    // Validadores
    private types = ["Bug", "Funcionalidade"];
    private statuses = ["Nova", "Atribuída", "Em Desenvolvimento", "Requer Teste", "Concluída"];

    private idValidator = {
        id: Joi.number().required().example(1)
    };

    private workIdValidator = {
        work: Joi.object(this.idValidator).required()
    };

    private versionIdValidator = {
        version: Joi.object(this.idValidator).required()
    };

    private dualIdValidator = {
        id1: Joi.number().required(),
        id2: Joi.number().required()
    };

    private taskValidator = {
        id: Joi.forbidden(),
        description: Joi.string().required().example("Tarefa Exemplo"),
        due_date: Joi.date().optional().example("2018-06-30"),
        estimate_work_hour: Joi.number().optional().example(16),
        type: Joi.string().only(this.types).required().example("Funcionalidade"),
        status: Joi.string().only(this.statuses).required(),
        progress: Joi.number().optional().example(0),
        project_id: Joi.number().required().example(1),
        parent_id: Joi.number().optional(),
        version_id: Joi.number().optional()
    };

    // Métodos utilitários
    private async createRelation(id: any, other: string, otherId: any, h: ResponseToolkit) {
        let task = await Task.query().findById(id);
        if (task) {
            let relation = await task.$relatedQuery(other).relate(otherId);
            return h.response(relation).code(201);
        }
        return this.notFound(id);
    }

    private async deleteRelation(id: any, entity: string, relation: string, otherId: any, h: ResponseToolkit) {
        let task = await Task.query().findById(id);
        if (task) {
            let deleted = await task.$relatedQuery(relation).unrelate().where({ id: otherId });
            if (deleted) {
                return h.response().code(204);
            }
            return this.entityNotFound(entity, id, otherId);
        }
        return this.notFound(id);
    }

    // Rotas
    public routes: RouteDefinitions = {
        GET: {
            "/tasks": {
                roles: EVERYONE,
                handler: async () => {
                    return await Task.query().eager("project").select("*");
                }
            },
            "/tasks/{id}": {
                roles: EVERYONE,
                paramsValidator: this.idValidator,
                handler: async ({ id }) => {
                    return await Task.query()
                        .eager("[project.[manager], parent, version, users, work_items.[user]]")
                        .findById(id) || this.notFound(id);
                }
            }
        },
        POST: {
            "/tasks": {
                roles: [ADMIN, MANAGER],
                payloadValidator: this.taskValidator,
                handler: async ({ ...body }, h) => {
                    let newTask = await Task.query()
                        .eager("[project, parent, version, users, work_items]")
                        .insert(body).returning("*");
                    return h.response(newTask).code(201);
                }
            },
            "/tasks/{id}/work_items": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.idValidator,
                payloadValidator: this.workIdValidator,
                handler: async ({ id, work: { id: workId } }, h) => {
                    return this.createRelation(id, "work_items", workId, h);
                }
            },
            "/tasks/{id}/versions": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.idValidator,
                payloadValidator: this.versionIdValidator,
                handler: async ({ id, version: { id: versionId } }, h) => {
                    return this.createRelation(id, "versions", versionId, h);
                }
            }
        },
        PUT: {
            "/tasks/{id}": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.idValidator,
                payloadValidator: this.taskValidator,
                handler: async ({ id, ...body }) => {
                    let task = await Task.query()
                        .eager("[project, parent, version, users, work_items]")
                        .update(body).where({ id: id })
                        .returning("*").first();
                    return task ? task : this.notFound(id);
                }
            }
        },
        DELETE: {
            "/tasks/{id}": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.idValidator,
                handler: async ({ id }, h) => {
                    let deleted = await Task.query().del().where({ id: id });
                    if (deleted) {
                        return h.response().code(204);
                    }
                    return this.notFound(id);
                }
            },
            "/tasks/{id1}/work_items/{id2}": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.dualIdValidator,
                handler: async ({ id1: id, id2: workId }, h) => {
                    return this.deleteRelation(id, "Work Item", "work_items", workId, h);
                }
            },
            "/tasks/{id1}/versions/{id2}": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.dualIdValidator,
                handler: async ({ id1: id, id2: versionId }, h) => {
                    return this.deleteRelation(id, "Version", "versions", versionId, h);
                }
            }
        }
    };
}
