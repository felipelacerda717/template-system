// src/controllers/scriptController.ts

import { Request, Response, NextFunction } from 'express';
import { CreateScriptDTO, UpdateScriptDTO } from '../models/types';
import scriptStorage from '../services/scriptStorage';
import { getCategoryById } from '../data/initial-data';

class ScriptController {
    /**
     * GET /api/scripts
     * Retorna todos os scripts ou filtrados por categoria
     */
    public async getAllScripts(req: Request, res: Response, next: NextFunction) {
        try {
            const { categoryId } = req.query;
            
            if (categoryId && typeof categoryId === 'string') {
                // Verificar se a categoria existe
                const category = getCategoryById(categoryId);
                if (!category) {
                    return res.status(404).json({
                        error: 'Categoria não encontrada',
                        details: `Não existe uma categoria com o ID: ${categoryId}`
                    });
                }

                const scripts = await scriptStorage.getScriptsByCategory(categoryId);
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

            if (!scriptData.categoryId?.trim()) {
                return res.status(400).json({
                    error: 'Categoria inválida',
                    details: 'A categoria é obrigatória'
                });
            }

            // Verificar se a categoria existe
            const category = getCategoryById(scriptData.categoryId);
            if (!category) {
                return res.status(400).json({
                    error: 'Categoria inválida',
                    details: 'A categoria especificada não existe'
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

            if (updateData.categoryId !== undefined) {
                const category = getCategoryById(updateData.categoryId);
                if (!category) {
                    return res.status(400).json({
                        error: 'Categoria inválida',
                        details: 'A categoria especificada não existe'
                    });
                }
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