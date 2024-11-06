// src/controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

class AuthController {
    public login = async (req: Request, res: Response) => {
        try {
            const { username, password } = req.body;
            console.log('Login attempt:', { username, password });

            // Verificação simples para teste
            if (username === 'admin' && password === 'admin123') {
                const token = jwt.sign(
                    { 
                        id: '1',
                        username: 'admin',
                        role: 'master' 
                    },
                    JWT_SECRET
                );

                console.log('Login successful');
                return res.json({
                    token,
                    user: {
                        id: '1',
                        username: 'admin',
                        role: 'master'
                    }
                });
            }

            console.log('Invalid credentials');
            return res.status(401).json({
                error: 'Credenciais inválidas'
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                error: 'Erro ao realizar login'
            });
        }
    }
}

export default new AuthController();