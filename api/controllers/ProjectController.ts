import { ResponseToolkit } from "hapi";
import Controller, { RouteDefinitions } from "api/controllers/Controller";
import Project from "api/models/Project";
import User from "api/models/User";
import * as Boom from "boom";
import * as Joi from "joi";

export default class ProjectController implements Controller {

    // Erros padrões
    private notFound(id: any) {
        return Boom.notFound(`Project with id ${id} not found`);
    }

    private entityNotFound(entity: string, id: any, otherId: any) {
        return Boom.notFound(`${entity} with id ${otherId} not found in project with id ${id}`);
    }

    // Validadores
    private statuses = ["Novo", "Em andamento", "Concluído"];

    private idValidator = {
        id: Joi.number().required()
    };

    private dualIdValidator = {
        id1: Joi.number().required(),
        id2: Joi.number().required()
    };

    private userIdValidator = {
        user: Joi.object(this.idValidator).required()
    };

    private taskIdValidator = {
        task: Joi.object(this.idValidator).required()
    };

    private tagIdValidator = {
        tag: Joi.object(this.idValidator).required()
    };

    private projectValidator = {
        id: Joi.forbidden(),
        name: Joi.string().required(),
        due_date: Joi.date().required(),
        status: Joi.string().only(this.statuses).required(),
        manager_id: Joi.number().optional()
    };

    // Métodos utilitários
    private async createRelation(id: any, other: string, otherId: any, h: ResponseToolkit) {
        let project = await Project.query().findById(id);
        if (project) {
            let relation = await project.$relatedQuery(other).relate(otherId);
            return h.response(relation).code(201);
        }
        return this.notFound(id);
    }

    private async deleteRelation(id: any, entity: string, relation: string, otherId: any, h: ResponseToolkit) {
        let project = await Project.query().findById(id);
        if (project) {
            let deleted = await project.$relatedQuery(relation).unrelate().where({ id: otherId });
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
            "/projects": {
                handler: async () => {
                    return await Project.query().eager("manager").select("*");
                }
            },
            "/projects/{id}": {
                paramsValidator: this.idValidator,
                handler: async ({ id }) => {
                    let project = await Project.query()
                        .eager("[manager, versions, tasks, users, tags]")
                        .select("*").findById(id);
                    return project ? project : this.notFound(id);
                }
            },
            "/projects/{id}/users": {
                paramsValidator: this.idValidator,
                handler: async ({ id }) => {
                    let project = await Project.query()
                        .eager("users").select("*")
                        .findById(id) as any;
                    return project ? project.users : this.notFound(id);
                }
            },
            "/projects/{id}/manager": {
                paramsValidator: this.idValidator,
                handler: async ({ id }) => {
                    let project = await Project.query()
                        .eager("manager").select("*")
                        .findById(id) as any;
                    return project && project.manager ? project.manager : this.notFound(id);
                }
            }
        },
        POST: {
            "/projects": {
                payloadValidator: this.projectValidator,
                handler: async ({ ...body }, h) => {
                    let newProject = await Project.query()
                        .eager("[manager, versions, tasks, users, tags]")
                        .insert(body).returning("*").first();
                    return h.response(newProject).code(201);
                }
            },
            "/projects/{id}/users": {
                paramsValidator: this.idValidator,
                payloadValidator: this.userIdValidator,
                handler: async ({ id, user: { id: userId } }, h) => {
                    return this.createRelation(id, "users", userId, h);
                }
            },
            "/projects/{id}/tasks": {
                paramsValidator: this.idValidator,
                payloadValidator: this.taskIdValidator,
                handler: async ({ id, task: { id: taskId } }, h) => {
                    return this.createRelation(id, "tasks", taskId, h);
                }
            },
            "/projects/{id}/tags": {
                paramsValidator: this.idValidator,
                payloadValidator: this.tagIdValidator,
                handler: async ({ id, tag: { id: tagId } }, h) => {
                    return this.createRelation(id, "tags", tagId, h);
                }
            }
        },
        PUT: {
            "/projects/{id}": {
                paramsValidator: this.idValidator,
                payloadValidator: this.projectValidator,
                handler: async ({ id, ...body }) => {
                    let project = await Project.query()
                        .eager("[manager, versions, tasks, users, tags]")
                        .update(body).where({ id: id })
                        .returning("*").first();
                    return project ? project : this.notFound(id);
                }
            }
        },
        DELETE: {
            "/projects/{id}": {
                paramsValidator: this.idValidator,
                handler: async ({ id }, h) => {
                    let deleted = await Project.query().del().where({ id: id });
                    if (deleted) {
                        return h.response().code(204);
                    }
                    return this.notFound(id);
                }
            },
            "/projects/{id1}/users/{id2}": {
                paramsValidator: this.dualIdValidator,
                handler: async ({ id1: id, id2: userId }, h) => {
                    return this.deleteRelation(id, "User", "users", userId, h);
                }
            },
            "/projects/{id1}/tasks/{id2}": {
                paramsValidator: this.dualIdValidator,
                handler: async ({ id1: id, id2: taskId }, h) => {
                    return this.deleteRelation(id, "Task", "tasks", taskId, h);
                }
            },
            "/projects/{id1}/tags/{id2}": {
                paramsValidator: this.dualIdValidator,
                handler: async ({ id1: id, id2: tagId }, h) => {
                    return this.deleteRelation(id, "Tag", "tags", tagId, h);
                }
            }
        }
    };
}
