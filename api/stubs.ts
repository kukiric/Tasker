export interface ProjectStub {
    id: number;
    name: string;
    due_date: Date;
    status: string;
    manager_id?: number;
    manager?: Partial<UserStub>;
    versions?: Partial<VersionStub>;
    tasks?: Partial<TaskStub>[];
    users?: Partial<UserStub>[];
    tags?: Partial<TagStub>[];
    created_at?: Date;
    updated_at?: Date;
}

export interface RoleStub {
    id: number;
    name: string;
}

export interface TagStub {
    id: number;
    name: string;
    color?: string;
}

export interface TaskStub {
    id: number;
    title: string;
    due_date?: Date;
    estimate_work_hour?: number;
    type: TaskType;
    status: TaskStatus;
    progress: number;
    project_id?: number;
    parent_id?: number;
    version_id?: number;
    description: string;
    project?: Partial<ProjectStub>;
    parent?: Partial<TaskStub>;
    children?: Partial<TaskStub>[];
    version?: Partial<VersionStub>;
    work_items?: Partial<WorkStub>[];
    users?: Partial<UserStub>[];
}

export interface UserStub {
    id: number;
    username: string;
    email: string;
    password: string;
    fullname: string;
    role_id?: number;
    work_items?: WorkStub[];
    projects?: ProjectStub[];
    tasks?: TaskStub[];
    role?: Partial<RoleStub>;
    created_at?: Date;
    updated_at?: Date;
}

export interface VersionStub {
    id: number;
    name: string;
    type: string;
}

export interface WorkStub {
    id: number;
    hours: number;
    start_time?: Date;
    end_time?: Date;
    task_id?: number;
    user_id?: number;
    task?: Partial<TaskStub>;
    user?: Partial<UserStub>;
}

// Valores do banco de dados
export enum ProjectStatus {
    NEW = "Novo",
    IN_PROGRESS = "Em Andamento",
    DONE = "Concluído"
}

export enum TaskType {
    BUG = "Bug",
    FEATURE = "Funcionalidade"
}

export enum TaskStatus {
    NEW = "Nova",
    ASSIGNED = "Atribuída",
    IN_PROGRESS = "Em Desenvolvimento",
    TESTING = "Requer Teste",
    DONE = "Concluída"
}

export enum RoleType {
    ADMIN = 1,
    MANAGER = 2,
    TEAM_MEMBER = 3
}

/**
 * Token JWT assinada
 */
export type EncodedToken = string;

/**
 * Token JWT decodificada
 */
export interface DecodedToken {
    uid: number;
    role: RoleType;
}

/**
 * Objeto retornado do AuthController com token e dados do usuário
 */
export interface AuthResponse {
    user: UserStub;
    token: string;
}
