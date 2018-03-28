import { ResponseToolkit } from "hapi";
import BaseController, { RouteDefinitions } from "api/controllers/BaseController";
import { EVERYONE, ADMIN, MANAGER, TEAM_MEMBER } from "api/models/Role";
import Project from "api/models/Project";
import User from "api/models/User";
import Task from "api/models/Task";

export default class ProjectController extends BaseController {
    protected modelClass = Project;

    // Rotas
    public routes: RouteDefinitions = {
        GET: {
            "/projects": {
                roles: EVERYONE,
                handler: async () => {
                    return await Project.query().eager("manager").select("*");
                }
            },
            "/projects/{id}": {
                roles: EVERYONE,
                paramsValidator: this.idValidator(),
                handler: async ({ id }) => {
                    let project = await Project.query()
                        .eager("[manager, versions, tasks.[users, work_items, version, parent, children], users, tags]")
                        .select("*").findById(id);
                    return project ? project : this.notFound(id);
                }
            },
            "/projects/{id}/users": {
                roles: EVERYONE,
                paramsValidator: this.idValidator(),
                handler: async ({ id }) => {
                    let project = await Project.query()
                        .eager("users").select("*")
                        .findById(id) as any;
                    return project ? project.users : this.notFound(id);
                }
            },
            "/projects/{id}/manager": {
                roles: EVERYONE,
                paramsValidator: this.idValidator(),
                handler: async ({ id }) => {
                    let project = await Project.query()
                        .eager("manager").select("*")
                        .findById(id) as any;
                    return project && project.manager ? project.manager : this.notFound(id);
                }
            }
        },
        POST: {
            "/projects": {
                roles: [ADMIN, MANAGER],
                payloadValidator: Project.validator,
                handler: async ({ ...body }, h) => {
                    let newProject = await Project.query()
                        .eager("[manager, versions, tasks, users, tags]")
                        .insert(body).returning("*").first();
                    return h.response(newProject).code(201);
                }
            },
            "/projects/{id}/users": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.idValidator(),
                payloadValidator: this.idValidator("userId"),
                handler: async ({ id, user: { id: userId } }, h) => {
                    return this.createRelation(id, "users", userId, h);
                }
            },
            "/projects/{id}/tasks": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.idValidator(),
                payloadValidator: Task.validator,
                handler: async ({ id, taskId }, h) => {
                    return this.createRelation(id, "tasks", taskId, h);
                }
            },
            "/projects/{id}/tags": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.idValidator(),
                payloadValidator: this.idValidator("tagId"),
                handler: async ({ id, tagId }, h) => {
                    return this.createRelation(id, "tags", tagId, h);
                }
            }
        },
        PUT: {
            "/projects/{id}": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.idValidator(),
                payloadValidator: Project.validator,
                handler: async ({ id, ...body }) => {
                    let project = await Project.query()
                        .eager("[manager, versions, tasks, users, tags]")
                        .update(body).where({ id: id })
                        .returning("*").first();
                    return project ? project : this.notFound(id);
                }
            }
        },
        DELETE: {
            "/projects/{id}": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.idValidator(),
                handler: async ({ id }, h) => {
                    let deleted = await Project.query().del().where({ id: id });
                    if (deleted) {
                        return h.response().code(204);
                    }
                    return this.notFound(id);
                }
            },
            "/projects/{id1}/users/{id2}": {
                roles: [ADMIN, MANAGER],
                handler: async ({ id1: id, id2: userId }, h) => {
                    return this.deleteRelation(id, "User", "users", userId, h);
                }
            },
            "/projects/{id1}/tasks/{id2}": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.multiIdValidator("projectId", "taskId"),
                handler: async ({ projectId, taskId }, h) => {
                    return this.deleteRelation(projectId, "Task", "tasks", taskId, h);
                }
            },
            "/projects/{id1}/tags/{id2}": {
                roles: [ADMIN, MANAGER],
                handler: async ({ id1: id, id2: tagId }, h) => {
                    return this.deleteRelation(id, "Tag", "tags", tagId, h);
                }
            }
        }
    };
}
