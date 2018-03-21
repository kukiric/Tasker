import { ResponseToolkit, Request, Lifecycle } from "hapi";
import ErrorHandler from "api/handlers/ErrorHandler";
import * as Boom from "Boom";

export function createErrorHandler(handlers: ErrorHandler[]) {
    return (request: Request, h: ResponseToolkit) => {
        if (request.response instanceof Boom) {
            let error = request.response;
            for (let handler of handlers) {
                let wrappedError = handler.handle(error);
                if (wrappedError) {
                    return wrappedError;
                }
            }
        }
        return request.response;
    };
}
