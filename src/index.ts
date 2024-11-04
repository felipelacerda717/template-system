import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar EJS como template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota básica para teste
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Sistema de Templates'
    });
});

// Rota para a página de gerenciamento
app.get('/manager', (req, res) => {
    res.render('manager', {
        title: 'Gerenciamento de Templates'
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});