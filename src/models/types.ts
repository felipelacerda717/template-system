// src/models/types.ts

export interface Script {
    id: string;
    title: string;
    content: string;
    categoryId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Category {
    id: string;
    title: string;
    icon: string;
    funnelStage: 'topo' | 'meio' | 'fundo';
    briefing: string;
    description: string;
}

export interface FunnelSection {
    id: string;
    title: string;
    description: string;
    categories: Category[];
}

// DTOs
export interface CreateScriptDTO {
    title: string;
    content: string;
    categoryId: string;
}

export interface UpdateScriptDTO {
    title?: string;
    content?: string;
    categoryId?: string;
}