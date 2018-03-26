import Controller, { RouteDefinitions } from "api/controllers/Controller";
import Task from "api/models/Task";
import * as Boom from "boom";
import * as Joi from "joi";

export default class TaskController implements Controller {

    // Erro padrão
    private notFound(id: any) {
        return Boom.notFound(`Task with id ${id} not found`);
    }

    // Validadores
    private types = ["Bug", "Funcionalidade"];
    private statuses = ["Nova", "Atribuída", "Em Desenvolvimento", "Requer Teste", "Concluída"];

    private idValidator = {
        id: Joi.number().required()
    };

    private taskValidator = {
        id: Joi.forbidden(),
        description: Joi.string().required(),
        due_date: Joi.date().optional(),
        estimate_work_hour: Joi.number().optional(),
        type: Joi.string().only(this.types).required(),
        status: Joi.string().only(this.statuses).required(),
        progress: Joi.number().optional(),
        project_id: Joi.number().required(),
        parent_id: Joi.number().optional(),
        version_id: Joi.number().optional()
    };

    // Rotas
    public routes: RouteDefinitions = {
        GET: {
            "/tasks": {
                handler: async () => {
                    return await Task.query().eager("project").select("*");
                }
            },
            "/tasks/{id}": {
                paramsValidator: this.idValidator,
                handler: async ({ id }) => {
                    return await Task.query()
                        .eager("[project.[manager], parent, version, users, work_items.[user]]")
                        .findById(id) || this.notFound(id);
                }
            }
        },
        POST: {
            "/tasks": {
                payloadValidator: this.taskValidator,
                handler: async ({ ...body }, h) => {
                    let newTask = await Task.query()
                        .eager("[project, parent, version, users, work_items]")
                        .insert(body).returning("*");
                    return h.response(newTask).code(201);
                }
            }
        },
        PUT: {
            "/tasks/{id}": {
                paramsValidator: this.idValidator,
                payloadValidator: this.taskValidator,
                handler: async ({ id, ...body }) => {
                    let task = await Task.query()
                        .eager("[project, parent, version, users, work_items]")
                        .update(body).where({ id: id })
                        .returning("*").first();
                    return task ? task : this.notFound(id);
                }
            }
        },
        DELETE: {
            "/tasks/{id}": {
                paramsValidator: this.idValidator,
                handler: async ({ id }, h) => {
                    let deleted = await Task.query().del().where({ id: id });
                    if (deleted) {
                        return h.response().code(204);
                    }
                    return this.notFound(id);
                }
            }
        }
    };
}
