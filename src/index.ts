// src/index.ts

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { funnelSections, getCategoryById } from './data/initial-data';
import scriptRoutes from './routes/scriptRoutes';

const app = express();

// Configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.use('/api/scripts', scriptRoutes);

// Rota principal
app.get('/', (req: Request, res: Response) => {
    res.render('index', {
        title: 'Template System',
        funnelSections
    });
});

// Rota para página de gerenciamento
app.get('/manager', (req: Request, res: Response) => {
    res.render('manager', {
        title: 'Gerenciamento de Scripts'
    });
});

// Rota para visualizar scripts de uma categoria
app.get('/scripts/:categoryId', (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const category = getCategoryById(categoryId);
    
    if (!category) {
        return res.status(404).render('error', {
            message: 'Categoria não encontrada'
        });
    }
    
    res.render('category-scripts', {
        title: category.title,
        category
    });
});

// Rotas não encontradas (404)
app.use((req: Request, res: Response) => {
    res.status(404).render('error', {
        message: 'Página não encontrada'
    });
});

// Tratamento de erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).render('error', {
        message: err.message || 'Algo deu errado!'
    });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;