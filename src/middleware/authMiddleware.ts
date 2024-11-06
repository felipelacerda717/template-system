// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        username: string;
        role: string;
    };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded as any;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
};

export const isMasterUser = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'master') {
        return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
};