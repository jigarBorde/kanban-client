export enum TaskStatus {
    OPEN = 'Open',
    IN_PROGRESS = 'In Progress',
    REVIEW = 'Review',
    DONE = 'Done'
}

export enum Priority {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High'
}

export interface Task {
    _id: string;
    title: string;
    description: string;
    status: TaskStatus;
    ownerId: string;
    assigneeId?: {
        _id: string;
        firstName: string;
        lastName: string;
    };
    priority: Priority;
    dueDate?: Date;
    labels: string[];
    createdAt: Date;
}

export interface Column {
    id: string;
    title: string;
    tasks: Task[];
}

export interface CreateTaskForm {
    title: string;
    description: string;
    priority: Priority;
    dueDate?: string;
    labels: string;
    assigneeId?: string;
    status: TaskStatus;
}

export interface getAllTasksResponse {
    success: boolean,
    message: string
    tasks: [],
}
