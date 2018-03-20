import { Request, ResponseToolkit as Response } from "hapi";
import User from "api/models/User";

export default class UserController {

    static routes() {
        return {
            GET: {
                "/users": this.getAll,
                "/users/{id}": this.getSingle
            },
            POST: {
                ";users": this.insert
            },
            PUT: {
                "/users/{id}": this.update
            },
            DELETE: {
                "/users/{id}": this.delete
            }
        };
    }

    static async getAll(req: Request, res: Response) {
        return await User.query().select("*");
    }

    static async getSingle(req: Request, res: Response) {
        let id = req.params.id;
        return await User.query().select("*").where("id", id).limit(1);
    }

    static async insert(req: Request, res: Response) {
        try {
            let params: any = req.payload;
            return await User.query().insert(params);
        }
        catch (err) {
            return err.stack;
        }
    }

    static async update(req: Request, res: Response) {
        return res.response().code(400);
    }

    static async delete(req: Request, res: Response) {
        return res.response().code(400);
    }
};