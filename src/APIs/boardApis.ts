import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import envConfig from "@/config/envConfig";
import { CreateTaskForm, getAllTasksResponse, Task, UpdateTaskRequest } from "../types/boardTypes";
import { User } from "@/types/reduxTypes";


const serverURI = envConfig.get('serverURI') as string;


const jsonConfig: AxiosRequestConfig = {
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
};

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: any;
}

// Helper function for making API requests
async function apiRequest<T>(
    endpoint: string,
    method: "get" | "post" | "put" | "delete" | "patch",
    data?: any,
    config: AxiosRequestConfig = jsonConfig
): Promise<ApiResponse<T>> {
    try {
        const response: AxiosResponse<T> = await axios({
            url: `${serverURI}${endpoint}`,
            method,
            data,
            ...config,
        });
        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data || "An unexpected error occurred",
        };
    }
}

interface LoginResponse {
    token: string;
}

interface UpdateTaskStatusResponse {
    task: Task;
    previousStatus: string;
    newStatus: string;
}


// API for create task
export const createTask = async (
    creatTask: CreateTaskForm
): Promise<ApiResponse<LoginResponse>> => {
    const result = await apiRequest<LoginResponse>(`/task/create`, "post", creatTask);
    return result;
};


// API for getall tasks
export const getAllTasks = async (): Promise<ApiResponse<getAllTasksResponse>> => {
    const result = await apiRequest<getAllTasksResponse>(`/task/get`, "get");
    console.log(result);
    return result;
};

// Update Task Status API
interface UpdateTaskStatusParams {
    taskId: string;
    status: string;
    comment?: string;
    lastModifiedBy: string;
}

export const updateTaskStatus = async ({
    taskId,
    status,
    comment,
    lastModifiedBy
}: UpdateTaskStatusParams): Promise<ApiResponse<UpdateTaskStatusResponse>> => {
    return await apiRequest<UpdateTaskStatusResponse>(
        `/task/${taskId}`,
        'patch',
        { status, comment, lastModifiedBy }
    );
};


// Get all users
export const getAllUsers = async (): Promise<ApiResponse<User[]>> => {
    return await apiRequest<User[]>('/task/users/getall', 'get');
};


// API for updating task
export const updateTask = async (
    taskData: UpdateTaskRequest
): Promise<ApiResponse<Task>> => {
    return await apiRequest<Task>(
        `/task/${taskData.taskId}`,
        "put",
        taskData
    );
};

// API for deleting task
export const deleteTask = async (
    taskId: string
): Promise<ApiResponse<{ message: string }>> => {
    return await apiRequest<{ message: string }>(
        `/task/${taskId}`,
        "delete"
    );
};