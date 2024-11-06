// src/models/types.ts

export interface Script {
    id: string;
    title: string;
    content: string;
    categoryId: string;
    tags?: string[];
    blackOnly: boolean;  // Nova propriedade
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
    tags?: string[];
    blackOnly?: boolean;  // Opcional no DTO
}

export interface UpdateScriptDTO {
    title?: string;
    content?: string;
    categoryId?: string;
    tags?: string[];
    blackOnly?: boolean;  // Opcional no DTO
}   

// src/models/types.ts
export interface User {
    id: string;
    username: string;
    password: string;
    role: 'master' | 'regular';
    createdAt: Date;
    updatedAt: Date;
}