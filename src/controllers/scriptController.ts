// src/controllers/scriptController.ts

import { Request, Response, NextFunction } from 'express';
import { CreateScriptDTO, UpdateScriptDTO } from '../models/types';
import scriptStorage from '../services/scriptStorage';

class ScriptController {
    /**
     * GET /api/scripts
     * Retorna todos os scripts ou filtrados por etapa do funil
     */
    public async getAllScripts(req: Request, res: Response, next: NextFunction) {
        try {
            const { stage, search } = req.query;
            
            if (search && typeof search === 'string') {
                const scripts = await scriptStorage.searchScripts(search);
                return res.json(scripts);
            }
            
            if (stage && ['topo', 'meio', 'fundo'].includes(stage as string)) {
                const scripts = await scriptStorage.getScriptsByFunnelStage(stage as 'topo' | 'meio' | 'fundo');
                return res.json(scripts);
            }

            const scripts = await scriptStorage.getAllScripts();
            res.json(scripts);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/scripts/:id 
     * Retorna um script específico
     */
    public async getScript(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const script = await scriptStorage.getScript(id);
            
            if (!script) {
                return res.status(404).json({
                    error: 'Script não encontrado',
                    details: `Não foi possível encontrar um script com o ID: ${id}`
                });
            }
            
            res.json(script);
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/scripts
     * Cria um novo script
     */
    public async createScript(req: Request, res: Response, next: NextFunction) {
        try {
            const scriptData: CreateScriptDTO = req.body;

            // Validação básica
            if (!scriptData.title?.trim()) {
                return res.status(400).json({
                    error: 'Título inválido',
                    details: 'O título do script é obrigatório'
                });
            }

            if (!scriptData.content?.trim()) {
                return res.status(400).json({
                    error: 'Conteúdo inválido',
                    details: 'O conteúdo do script é obrigatório'
                });
            }

            if (!['topo', 'meio', 'fundo'].includes(scriptData.funnelStage)) {
                return res.status(400).json({
                    error: 'Etapa do funil inválida',
                    details: 'A etapa do funil deve ser: topo, meio ou fundo'
                });
            }

            const newScript = await scriptStorage.createScript(scriptData);
            res.status(201).json(newScript);
        } catch (error) {
            next(error);
        }
    }

    /**
     * PUT /api/scripts/:id
     * Atualiza um script existente
     */
    public async updateScript(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const updateData: UpdateScriptDTO = req.body;

            // Validações
            if (updateData.title !== undefined && !updateData.title.trim()) {
                return res.status(400).json({
                    error: 'Título inválido',
                    details: 'O título do script não pode estar vazio'
                });
            }

            if (updateData.content !== undefined && !updateData.content.trim()) {
                return res.status(400).json({
                    error: 'Conteúdo inválido',
                    details: 'O conteúdo do script não pode estar vazio'
                });
            }

            if (updateData.funnelStage !== undefined && 
                !['topo', 'meio', 'fundo'].includes(updateData.funnelStage)) {
                return res.status(400).json({
                    error: 'Etapa do funil inválida',
                    details: 'A etapa do funil deve ser: topo, meio ou fundo'
                });
            }

            const updatedScript = await scriptStorage.updateScript(id, updateData);

            if (!updatedScript) {
                return res.status(404).json({
                    error: 'Script não encontrado',
                    details: `Não foi possível encontrar um script com o ID: ${id}`
                });
            }

            res.json(updatedScript);
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /api/scripts/:id
     * Remove um script
     */
    public async deleteScript(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const deleted = await scriptStorage.deleteScript(id);

            if (!deleted) {
                return res.status(404).json({
                    error: 'Script não encontrado',
                    details: `Não foi possível encontrar um script com o ID: ${id}`
                });
            }

            res.json({
                message: 'Script deletado com sucesso'
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new ScriptController();