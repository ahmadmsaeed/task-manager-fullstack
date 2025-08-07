// interface für tasks - muss exakt wie backend dto aussehen
export interface Task {
    id: number;
    title: string;
    description: string;
    isCompleted: boolean;
    createdAt: Date;
    completedAt?: Date; // optional - nur gesetzt wenn task fertig
    priority: Priority;
}

// priority enum - muss gleiche werte wie backend haben
// angular sendet diese als strings aber backend erwartet integers
export enum Priority {
    Low = 0,
    Medium = 1,
    High = 2
}

// interface für neue tasks - ohne id weil server generiert das
export interface CreateTask {
    title: string;
    description: string;
    priority: Priority;
}

// interface für task updates - alle felder die geändert werden können
export interface UpdateTask {
  title: string;
  description: string;
  isCompleted: boolean;
  priority: Priority;
}