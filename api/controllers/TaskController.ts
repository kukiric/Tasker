import { ResponseToolkit } from "hapi";
import BaseController, { RouteDefinitions } from "api/controllers/BaseController";
import { EVERYONE, ADMIN, MANAGER, TEAM_MEMBER } from "api/models/Role";
import Task from "api/models/Task";

export default class TaskController extends BaseController {
    protected modelClass = Task;

    // Rotas
    public routes: RouteDefinitions = {
        GET: {
            "/tasks": {
                roles: EVERYONE,
                handler: async () => {
                    return await Task.query().eager("project").select("*");
                }
            },
            "/tasks/{id}": {
                roles: EVERYONE,
                paramsValidator: this.idValidator(),
                handler: async ({ id }) => {
                    return await Task.query()
                        .eager("[project.[manager], parent, version, users, work_items.[user]]")
                        .findById(id) || this.notFound(id);
                }
            }
        },
        POST: {
            "/tasks": {
                roles: [ADMIN, MANAGER],
                payloadValidator: Task.validator,
                handler: async ({ ...body }, h) => {
                    let newTask = await Task.query()
                        .eager("[project, parent, version, users, work_items]")
                        .insert(body).returning("*");
                    return h.response(newTask).code(201);
                }
            },
            "/tasks/{id}/work_items": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.idValidator(),
                payloadValidator: this.idValidator("workId"),
                handler: async ({ id, workId }, h) => {
                    return this.createRelation(id, "work_items", workId, h);
                }
            },
            "/tasks/{id}/versions": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.idValidator(),
                payloadValidator: this.idValidator("versionId"),
                handler: async ({ id, versionId }, h) => {
                    return this.createRelation(id, "versions", versionId, h);
                }
            }
        },
        PUT: {
            "/tasks/{id}": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.idValidator(),
                payloadValidator: Task.validator,
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
                roles: [ADMIN, MANAGER],
                paramsValidator: this.idValidator(),
                handler: async ({ id }, h) => {
                    let deleted = await Task.query().del().where({ id: id });
                    if (deleted) {
                        return h.response().code(204);
                    }
                    return this.notFound(id);
                }
            },
            "/tasks/{taskId1}/work_items/{workId}": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.multiIdValidator("taskId", "workId"),
                handler: async ({ taskId, workId }, h) => {
                    return this.deleteRelation(taskId, "Work Item", "work_items", workId, h);
                }
            },
            "/tasks/{taskId}/versions/{versionId}": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.multiIdValidator("taskId", "versionId"),
                handler: async ({ taskId, versionId }, h) => {
                    return this.deleteRelation(taskId, "Version", "versions", versionId, h);
                }
            }
        }
    };
}
