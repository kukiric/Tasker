import { Request, ResponseToolkit } from "hapi";
import Controller, { RouteDefinitions } from "api/controllers/Controller";
import User from "api/models/User";
import * as Boom from "boom";
import * as Joi from "joi";

export default class UserController implements Controller {

    // Validações
    private params = {
        id: Joi.number().required()
    };

    private payload = {
        id: Joi.forbidden(),
        username: Joi.string(),
        email: Joi.string().email(),
        fullname: Joi.string(),
        password: Joi.string().min(6),
        role_id: Joi.number()
    };

    // Rotas do controller
    public get routes(): RouteDefinitions {
        return {
            GET: {
                "/users": { handler: this.getAll },
                "/users/{id}": { handler: this.getSingle, params: this.params }
            },
            POST: {
                "/users": { handler: this.insert, payload: this.payload }
            },
            PUT: {
                "/users/{id}": { handler: this.update, params: this.params, payload: this.payload }
            },
            DELETE: {
                "/users/{id}": { handler: this.delete, params: this.params }
            }
        };
    }

    public async getAll(request: Request, h: ResponseToolkit) {
        return await User.eagerQuery().select("*");
    }

    // Handlers
    public async getSingle(request: Request, h: ResponseToolkit) {
        let id = request.params.id;
        return await User.eagerQuery().select("*").where("id", id).limit(1);
    }

    public async insert(request: Request, h: ResponseToolkit) {
        let params: any = request.payload;
        return await User.eagerQuery().insert(params).returning("*");
    }

    public async update(request: Request, h: ResponseToolkit) {
        let id = request.params.id;
        let params: any = request.payload;
        return await User.eagerQuery().update(params).where({ id: id }).returning("*");
    }

    public async delete(request: Request, h: ResponseToolkit) {
        let id = request.params.id;
        return {
            deleted: await User.query().del().where({ id: id })
        };
    }
}
