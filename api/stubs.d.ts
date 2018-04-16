export interface ProjectStub {
    id?: number;
    name?: string;
    due_date?: Date;
    status?: string;
    manager_id?: number;
    manager?: UserStub;
    versions?: VersionStub;
    tasks?: TaskStub[];
    users?: UserStub[];
    tags?: TagStub[];
    created_at?: string;
    updated_at?: string;
}

export interface RoleStub {
    id?: number;
    name?: string;
}

export interface TagStub {
    id?: number;
    name?: string;
}

export interface TaskStub {
    id?: number;
    description?: string;
    due_date?: Date;
    estimate_work_hour?: number;
    type?: string;
    status?: string;
    progress?: number;
    project_id?: number;
    parent_id?: number;
    version_id?: number;
    project?: ProjectStub;
    parent?: TaskStub;
    children?: TaskStub[];
    version?: VersionStub;
    work_items?: WorkStub[];
    users?: UserStub[];
}

export interface UserStub {
    id?: number;
    username?: string;
    email?: string;
    password?: string;
    fullname?: string;
    role_id?: number;
    work_items?: WorkStub[];
    projects?: ProjectStub[];
    tasks?: TaskStub[];
    role?: RoleStub;
    created_at?: string;
    updated_at?: string;
}

export interface VersionStub {
    id?: number;
    name?: string;
    type?: string;
}

export interface WorkStub {
    id?: number;
    hours?: number;
    start_time?: Date;
    end_time?: Date;
    task_id?: number;
    user_id?: number;
}
