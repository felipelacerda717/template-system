// src/middleware/clientMiddleware.ts
import { Request, Response, NextFunction } from 'express';

interface Client {
    id: string;
    isBlack: boolean;
}

interface MockClients {
    [key: string]: Client;
}

export interface ClientRequest extends Request {
    client?: Client;
}

export const checkClientType = async (req: ClientRequest, res: Response, next: NextFunction) => {
    try {
        const clientId = req.query.clientId || req.body.clientId;
        
        if (!clientId) {
            return res.status(400).json({
                error: 'ID do cliente não fornecido'
            });
        }

        const client = await getClientFromDatabase(clientId.toString());
        
        if (!client) {
            return res.status(404).json({
                error: 'Cliente não encontrado'
            });
        }

        req.client = client;
        next();
    } catch (error) {
        console.error('Erro ao verificar tipo do cliente:', error);
        res.status(500).json({
            error: 'Erro ao verificar tipo do cliente'
        });
    }
};

// Função mock para simular consulta ao banco
async function getClientFromDatabase(clientId: string): Promise<Client | null> {
    await new Promise(resolve => setTimeout(resolve, 100));

    const mockClients: MockClients = {
        '1': { id: '1', isBlack: true },
        '2': { id: '2', isBlack: false }
    };

    return mockClients[clientId] || null;
}