import { Request, ResponseToolkit } from "hapi";
import User from "api/models/user";
import * as util from "util";

export default class UserController {
    static async get(req: Request, h: ResponseToolkit) {
        let id = req.params.id;
        if (id) {
            return await User.query().select("*").where("id", id).limit(1);
        }
        else {
            return await User.query().select("*");
        }
    }

    static async post(req: Request, h: ResponseToolkit) {
        try {
            let params: any = req.payload;
            return await User.query().insert(params);
        }
        catch (err) {
            return err.stack;
        }
    }

    static async put(req: Request, h: ResponseToolkit) {
        return h.response().code(400);
    }

    static async delete(req: Request, h: ResponseToolkit) {
        return h.response().code(400);
    }
};