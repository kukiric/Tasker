import ErrorHandler from "api/handlers/ErrorHandler";
import * as Boom from "Boom";

export default class DatabaseErrorHandler implements ErrorHandler {
    public handle(err: any) {
        if (err.constraint) {
            return Boom.badData(err.detail);
        }
        return;
    }
}
