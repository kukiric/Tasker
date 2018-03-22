import { Request, ResponseToolkit } from "hapi";
import Controller, { RouteDefinitions } from "api/controllers/Controller";
import Project from "api/models/Project";
import { Model } from "objection";
import * as Boom from "boom";
import * as Joi from "joi";

export default class ProjectController implements Controller {

    // Validações
    private idValidator = {
        id: Joi.number().required()
    };

    private idAndUidValidator = {
        id: Joi.number().required(),
        uid: Joi.number().required()
    };

    private payloadProjectValidator = {
        id: Joi.forbidden(),
        name: Joi.string(),
        due_date: Joi.date(),
        status: Joi.string().max(45),
        manager_id: Joi.number(),
        users: Joi.object()
    };

    // Rotas do controller
    public get routes(): RouteDefinitions {
        return {
            GET: {
                "/projects": { handler: this.getAll },
                "/projects/{id}": { handler: this.getSingle, params: this.idValidator }
            },
            POST: {
                "/projects": { handler: this.insert, payload: this.payloadProjectValidator },
                "/projects/{id}/users": { handler: this.insertUser, params: this.idValidator, payload: this.idValidator }
            },
            PUT: {
                "/projects/{id}": { handler: this.update, params: this.idValidator, payload: this.idValidator }
            },
            DELETE: {
                "/projects/{id}": { handler: this.delete, params: this.idValidator },
                "/projects/{id}/users/{uid}": { handler: this.deleteUser, params: this.idAndUidValidator }
            }
        };
    }

    // Handlers
    public async getAll(request: Request, h: ResponseToolkit) {
        return await Project.query().eager("manager").select("*");
    }

    public async getSingle(request: Request, h: ResponseToolkit) {
        let id = request.params.id;
        return await Project.eagerQuery().select("*").where("id", id).limit(1);
    }

    public async insert(request: Request, h: ResponseToolkit) {
        let body: any = request.payload;
        return await Project.eagerQuery().insert(body).returning("*");
    }

    public async insertUser(request: Request, h: ResponseToolkit) {
        let id = request.params.id;
        let body: any = request.payload;
        await Model.knex()("project_user").insert({
            project_id: id,
            user_id: body.id
        });
        return await new ProjectController().getSingle(request, h);
    }

    public async update(request: Request, h: ResponseToolkit) {
        let id = request.params.id;
        let body: any = request.payload;
        return await Project.eagerQuery().update(body).where({ id: id }).returning("*");
    }

    public async delete(request: Request, h: ResponseToolkit) {
        let id = request.params.id;
        return {
            deleted: await Project.query().del().where({ id: id })
        };
    }

    public async deleteUser(request: Request, h: ResponseToolkit) {
        return new Error("Not implemented");
    }
}
