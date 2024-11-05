// src/models/types.ts

export interface Script {
    id: string;
    title: string;
    content: string;
    funnelStage: 'topo' | 'meio' | 'fundo';
    createdAt: Date;
    updatedAt: Date;
    briefing?: string;
    tags?: string[];
}

export interface CreateScriptDTO {
    title: string;
    content: string;
    funnelStage: 'topo' | 'meio' | 'fundo';
    briefing?: string;
    tags?: string[];
}

export interface UpdateScriptDTO {
    title?: string;
    content?: string;
    funnelStage?: 'topo' | 'meio' | 'fundo';
    briefing?: string;
    tags?: string[];
}