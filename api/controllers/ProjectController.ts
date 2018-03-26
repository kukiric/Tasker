import { Request, ResponseToolkit } from "hapi";
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

    private userNotFound(id: any, uid: any) {
        return Boom.notFound(`User with id ${uid} not found in project with id ${id}`);
    }

    // Validadores
    private statuses = ["Novo", "Em andamento", "Concluído"];

    private idValidator = {
        id: Joi.number().required()
    };

    private idAndUidValidator = {
        id: Joi.number().required(),
        uid: Joi.number().required()
    };

    private userIdValidator = {
        user: Joi.object(this.idValidator).required()
    };

    private projectValidator = {
        id: Joi.forbidden(),
        name: Joi.string().required(),
        due_date: Joi.date().required(),
        status: Joi.string().only(this.statuses).required(),
        manager_id: Joi.number().optional()
    };

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
                        .select("*").findById(id)
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
                        .insert(body).returning("*");
                    return h.response(newProject).code(201);
                }
            },
            "/projects/{id}/users": {
                paramsValidator: this.idValidator,
                payloadValidator: this.userIdValidator,
                handler: async ({ id, ...body }, h) => {
                    let project = await Project.query().findById(id);
                    if (project) {
                        let relation = await project.$relatedQuery("users").relate(body.user.id);
                        return h.response(relation).code(201);
                    }
                    return this.notFound(id);
                }
            }
        },
        PUT: {
            "/projects/{id}": {
                paramsValidator: this.idValidator,
                payloadValidator: this.projectValidator,
                handler: async ({ id, ...body }) => {
                    let project = await Project.query()
                        .eager("role").update(body).where({ id: id })
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
            "/projects/{id}/users/{uid}": {
                paramsValidator: this.idAndUidValidator,
                handler: async ({ id, uid }, h) => {
                    let project = await Project.query().findById(id);
                    if (project) {
                        let deleted = await project.$relatedQuery("users").unrelate().where({ id: uid });
                        if (deleted) {
                            return h.response().code(204);
                        }
                        return this.userNotFound(id, uid);
                    }
                    return this.notFound(id);
                }
            }
        }
    };
}
