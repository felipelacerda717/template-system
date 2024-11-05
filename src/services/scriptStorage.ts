// src/services/scriptStorage.ts

import { Script, CreateScriptDTO, UpdateScriptDTO } from '../models/types';
import fs from 'fs';
import path from 'path';
import { getCategoryById } from '../data/initial-data';

class ScriptStorage {
    private static instance: ScriptStorage;
    private scripts: Script[] = [];
    private readonly dataDir = path.join(__dirname, '../../data');
    private readonly scriptsFile = path.join(this.dataDir, 'scripts.json');

    private constructor() {
        this.initializeStorage();
    }

    public static getInstance(): ScriptStorage {
        if (!ScriptStorage.instance) {
            ScriptStorage.instance = new ScriptStorage();
        }
        return ScriptStorage.instance;
    }

    private initializeStorage() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }

        try {
            if (fs.existsSync(this.scriptsFile)) {
                const data = fs.readFileSync(this.scriptsFile, 'utf8');
                this.scripts = JSON.parse(data);
            } else {
                // Se o arquivo não existir, criar com array vazio
                fs.writeFileSync(this.scriptsFile, '[]');
            }
        } catch (error) {
            console.error('Erro ao carregar scripts:', error);
            this.scripts = [];
        }
    }

    private saveScripts(): void {
        try {
            fs.writeFileSync(this.scriptsFile, JSON.stringify(this.scripts, null, 2));
        } catch (error) {
            console.error('Erro ao salvar scripts:', error);
        }
    }

    // CRUD Operations
    async getAllScripts(): Promise<Script[]> {
        return this.scripts;
    }

    async getScriptsByCategory(categoryId: string): Promise<Script[]> {
        return this.scripts.filter(script => script.categoryId === categoryId);
    }

    async getScript(id: string): Promise<Script | null> {
        return this.scripts.find(script => script.id === id) || null;
    }

    async createScript(data: CreateScriptDTO): Promise<Script> {
        const category = getCategoryById(data.categoryId);
        if (!category) {
            throw new Error('Categoria não encontrada');
        }

        const newScript: Script = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.scripts.push(newScript);
        this.saveScripts();
        return newScript;
    }

    async updateScript(id: string, data: UpdateScriptDTO): Promise<Script | null> {
        const index = this.scripts.findIndex(script => script.id === id);
        if (index === -1) return null;

        if (data.categoryId) {
            const category = getCategoryById(data.categoryId);
            if (!category) {
                throw new Error('Categoria não encontrada');
            }
        }

        const updatedScript = {
            ...this.scripts[index],
            ...data,
            updatedAt: new Date()
        };

        this.scripts[index] = updatedScript;
        this.saveScripts();
        return updatedScript;
    }

    async deleteScript(id: string): Promise<boolean> {
        const initialLength = this.scripts.length;
        this.scripts = this.scripts.filter(script => script.id !== id);
        
        if (this.scripts.length < initialLength) {
            this.saveScripts();
            return true;
        }
        return false;
    }

    // Utility methods
    async searchScripts(query: string): Promise<Script[]> {
        const lowercaseQuery = query.toLowerCase();
        return this.scripts.filter(script => 
            script.title.toLowerCase().includes(lowercaseQuery) ||
            script.content.toLowerCase().includes(lowercaseQuery)
        );
    }
}

export default ScriptStorage.getInstance();