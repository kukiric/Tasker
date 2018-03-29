import { ResponseToolkit } from "hapi";
import { QueryBuilder, Model } from "objection";
import { EVERYONE, ADMIN, MANAGER, TEAM_MEMBER } from "api/models/Role";
import BaseController, { RouteDefinitions } from "api/controllers/BaseController";
import Version from "api/models/Version";
import Project from "api/models/Project";
import User from "api/models/User";
import Task from "api/models/Task";
import Work from "api/models/Work";

export default class ProjectController extends BaseController {
    protected modelClass = Project;

    // Rotas
    public routes: RouteDefinitions = {
        GET: {
            "/projects": {
                roles: EVERYONE,
                handler: async () => {
                    return await Project.query().select("*");
                }
            },
            "/projects/{projectId}": {
                roles: EVERYONE,
                paramsValidator: this.idValidator("projectId"),
                handler: async ({ projectId }) => {
                    let project = await Project.query().eager("manager").select("*").findById(projectId);
                    return project ? project : this.notFound(projectId);
                }
            },
            "/projects/{projectId}/users": {
                roles: EVERYONE,
                paramsValidator: this.idValidator("projectId"),
                handler: async ({ projectId }) => {
                    let taskFilter = (query: QueryBuilder<Project>) => {
                        query.where({ project_id: projectId });
                    };
                    let project = await Project.query()
                        .eager("users.[tasks(taskFilter)]", { taskFilter: taskFilter })
                        .findById(projectId);
                    return project ? project.users : this.notFound(projectId);
                }
            },
            "/projects/{projectId}/tasks": {
                roles: EVERYONE,
                paramsValidator: this.idValidator("projectId"),
                handler: async ({ projectId }) => {
                    let project = await Project.query()
                        .eager("tasks.[users, parent, children, version]")
                        .findById(projectId);
                    return project ? project.tasks : this.notFound(projectId);
                }
            },
            "/projects/{projectId}/tags": {
                roles: EVERYONE,
                paramsValidator: this.idValidator("projectId"),
                handler: async ({ projectId }) => {
                    let project = await Project.query().eager("tags").findById(projectId);
                    return project ? project.tags : this.notFound(projectId);
                }
            },
            "/projects/{projectId}/versions": {
                roles: EVERYONE,
                paramsValidator: this.idValidator("projectId"),
                handler: async ({ projectId }) => {
                    let project = await Project.query().eager("versions").findById(projectId);
                    return project ? project.versions : this.notFound(projectId);
                }
            },
            "/projects/{projectId}/tasks/{taskId}/work_items": {
                roles: EVERYONE,
                paramsValidator: this.multiIdValidator("projectId", "taskId"),
                handler: async ({ projectId, taskId, ...body }, h) => {
                    if (await this.exists(projectId) === false) {
                        return this.notFound(projectId);
                    }
                    let task = await Task.query().eager("work_items").findOne({ id: taskId, project_id: projectId });
                    return task ? task.work_items : this.childNotFound("Task", projectId, taskId);
                }
            }
        },
        POST: {
            "/projects": {
                roles: [ADMIN, MANAGER],
                payloadValidator: Project.validator,
                handler: async ({ ...body }, h) => {
                    let newProject = await Project.query().eager("manager")
                        .insert(body).returning("*");
                    return h.response(newProject).code(201);
                }
            },
            "/projects/{projectId}/users": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.idValidator("projectId"),
                payloadValidator: this.idValidator("userId"),
                handler: async ({ projectId, userId }, h) => {
                    return this.createRelation(projectId, "users", userId, h);
                }
            },
            "/projects/{projectId}/tags": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.idValidator("projectId"),
                payloadValidator: this.idValidator("tagId"),
                handler: async ({ projectId, tagId }, h) => {
                    return this.createRelation(projectId, "tags", tagId, h);
                }
            },
            "/projects/{projectId}/tasks": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.idValidator("projectId"),
                payloadValidator: Task.validator,
                handler: async ({ projectId, ...body }, h) => {
                    if (await this.exists(projectId) === false) {
                        return this.notFound(projectId);
                    }
                    let taskWithProjectId = Object.assign(body, { project_id: projectId });
                    return await Task.query().insert(taskWithProjectId).returning("*");
                }
            },
            "/projects/{projectId}/tasks/{taskId}/work_items": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.multiIdValidator("projectId", "taskId"),
                payloadValidator: Work.validator,
                handler: async ({ projectId, taskId, ...body }, h) => {
                    if (await this.exists(projectId) === false) {
                        return this.notFound(projectId);
                    }
                    if (await this.exists(taskId, Task) === false) {
                        return this.childNotFound("Task", projectId, taskId);
                    }
                    let workWithTaskId = Object.assign(body, { task_id: taskId });
                    return await Work.query().insert(workWithTaskId).returning("*");
                }
            }
        },
        PUT: {
            "/projects/{projectId}": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.idValidator("projectId"),
                payloadValidator: Project.validator,
                handler: async ({ projectId, ...body }) => {
                    let project = await Project.query().eager("manager")
                        .update(body).findById(projectId).returning("*").first();
                    return project ? project : this.notFound(projectId);
                }
            }
        },
        DELETE: {
            "/projects/{projectId}": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.idValidator("projectId"),
                handler: async ({ projectId }, h) => {
                    let deleted = await Project.query().deleteById(projectId);
                    if (deleted) {
                        return h.response().code(204);
                    }
                    return this.notFound(projectId);
                }
            },
            "/projects/{projectId}/users/{userId}": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.multiIdValidator("projectId", "taskId"),
                handler: async ({ projectId, userId }, h) => {
                    return this.deleteRelation(projectId, "User", "users", userId, h);
                }
            },
            "/projects/{projectId}/tags/{tagId}": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.multiIdValidator("projectId", "tagId"),
                handler: async ({ projectId, tagId }, h) => {
                    return this.deleteRelation(projectId, "Tag", "tags", tagId, h);
                }
            },
            "/projects/{projectId}/tasks/{taskId}": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.multiIdValidator("projectId", "taskId"),
                handler: async ({ projectId, taskId }, h) => {
                    if (await this.exists(projectId) === false) {
                        return this.notFound(projectId);
                    }
                    if (await Task.query().deleteById(taskId)) {
                        return h.response().code(204);
                    }
                    return this.childNotFound("Task", projectId, taskId);
                }
            },
            "/projects/{projectId}/versions/{versionId}": {
                roles: [ADMIN, MANAGER],
                paramsValidator: this.multiIdValidator("projectId", "versionId"),
                handler: async ({ projectId, versionId }, h) => {
                    if (await this.exists(projectId) === false) {
                        return this.notFound(projectId);
                    }
                    if (await Version.query().deleteById(versionId)) {
                        return h.response().code(204);
                    }
                    return this.childNotFound("Version", projectId, versionId);
                }
            }
        }
    };
}
