import BaseController, { RouteDefinitions } from "api/controllers/BaseController";
import { EVERYONE, ADMIN, MANAGER, TEAM_MEMBER } from "api/models/Role";
import Role from "api/models/Role";
import * as Boom from "boom";
import * as Joi from "joi";

export default class RoleController extends BaseController {
    protected modelClass = Role;

    // Rotas
    public routes: RouteDefinitions = {
        GET: {
            "/roles": {
                roles: EVERYONE,
                handler: async () => {
                    let r = await this.modelClass.query().findOne({ id: 1 });
                    return await Role.query().select("*");
                }
            },
            "/roles/{roleId}": {
                roles: EVERYONE,
                paramsValidator: this.idValidator("roleId"),
                handler: async ({ id }) => {
                    return await Role.query().findById(id) || this.notFound(id);
                }
            }
        }
    };
}
