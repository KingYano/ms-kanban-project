export interface Task {
    id: number;
    title: string;
    description: string;
}

export interface Category {
    id: number;
    name: string;
    tasks: Task[];
}

export interface Project {
    id: number;
    name: string;
    categories: Category[];
}