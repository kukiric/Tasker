import { Request, ResponseToolkit as Response } from "hapi";
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

    public async getAll(req: Request, res: Response) {
        return await User.query().select("*");
    }

    public async getSingle(req: Request, res: Response) {
        let id = req.params.id;
        return await User.query().select("*").where("id", id).limit(1);
    }

    public async insert(req: Request, res: Response) {
        try {
            let params: any = req.payload;
            return await User.query().insert(params).returning("*");
        }
        catch (err) {
            console.log(JSON.stringify(err, null, 4));
            return Boom.badData(err.message);
        }
    }

    public async update(req: Request, res: Response) {
        try {
            let id = req.params.id;
            let params: any = req.payload;
            params.id = undefined;
            return await User.query().update(params).where({ id: id }).returning("*");
        }
        catch (err) {
            return Boom.badData(err.message);
        }
    }

    public async delete(req: Request, res: Response) {
        let id = req.params.id;
        return {
            deleted: await User.query().del().where({ id: id })
        };
    }
}
