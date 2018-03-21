import { Request, ResponseToolkit } from "hapi";
import Controller from "api/controllers/Controller";
import User from "api/models/User";
import * as Boom from "boom";

export default class UserController implements Controller {

    public get routes() {
        return {
            GET: {
                "/users": this.getAll,
                "/users/{id}": this.getSingle
            },
            POST: {
                "/users": this.insert
            },
            PUT: {
                "/users/{id}": this.update
            },
            DELETE: {
                "/users/{id}": this.delete
            }
        };
    }

    public async getAll(request: Request, h: ResponseToolkit) {
        return await User.eagerQuery().select("*");
    }

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
        // Não tenta atualizar o id
        delete params.id;
        return await User.query().update(params).where({ id: id }).returning("*");
    }

    public async delete(request: Request, h: ResponseToolkit) {
        let id = request.params.id;
        return {
            deleted: await User.query().del().where({ id: id })
        };
    }
}
