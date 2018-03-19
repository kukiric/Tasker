import * as Hapi from "hapi";
import UserController from "api/controllers/UserController";

export function registerRoutes(server: Hapi.Server) {
    console.log("Registrando rotas...");

    server.route({
        method: "GET",
        path: "/api/users",
        handler: UserController.get
    });

    server.route({
        method: "GET",
        path: "/api/users/{id}",
        handler: UserController.get
    });

    server.route({
        method: "POST",
        path: "/api/users",
        handler: UserController.post
    });
}