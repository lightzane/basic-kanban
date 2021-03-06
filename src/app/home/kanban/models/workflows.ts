export interface Workflows {
    name: string;
    items: Item[];
}

export interface Item {
    name: string;
    description?: string;
    comments: Comment[];
    color: string;
}

interface Comment {
    content: string;
    timestamp: number;
    edited?: boolean;
}

