import Controller, { RouteDefinitions } from "api/controllers/Controller";
import Role from "api/models/Role";
import * as Boom from "boom";
import * as Joi from "joi";

export default class RoleController implements Controller {

    // Erro padrão
    private notFound(id: any) {
        return Boom.notFound(`Role with id ${id} not found`);
    }

    // Validadores
    private idValidator = {
        id: Joi.number().required().example(1)
    };

    // Rotas
    public routes: RouteDefinitions = {
        GET: {
            "/roles": {
                handler: async () => {
                    return await Role.query().select("*");
                }
            },
            "/roles/{id}": {
                paramsValidator: this.idValidator,
                handler: async ({ id }) => {
                    return await Role.query().findById(id) || this.notFound(id);
                }
            }
        }
    };
}
