export interface Task {
    id: number;
    title: string;
    description: string;
    isCompleted: boolean;
    createdAt: Date;
    completedAt?: Date;
    priority: Priority;
}
export enum Priority {
    Low = 0,
    Medium = 1,
    High = 2
}

export interface CreateTask {
    title: string;
    description: string;
    priority: Priority;
}

export interface UpdateTask {
  title: string;
  description: string;
  isCompleted: boolean;
  priority: Priority;
}