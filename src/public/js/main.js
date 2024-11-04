// Dados das questões
const questions = [
    { 
        id: 1, 
        title: "Como gerenciar templates de mensagem?",
        answer: `
            <p>Para gerenciar seus templates de mensagem, siga os passos abaixo:</p>
            <ol>
                <li>Acesse o painel de controle</li>
                <li>Navegue até a seção "Templates"</li>
                <li>Aqui você pode criar, editar ou excluir templates</li>
                <li>Cada template pode ser associado a uma categoria</li>
            </ol>
        `
    },
    { 
        id: 2, 
        title: "Como criar um novo template?",
        answer: `
            <p>Para criar um novo template:</p>
            <ol>
                <li>Clique no botão "Novo Template"</li>
                <li>Selecione a categoria desejada</li>
                <li>Digite o texto do template</li>
                <li>Salve as alterações</li>
            </ol>
        `
    },
    { 
        id: 3, 
        title: "Como filtrar mensagens por categoria?",
        answer: `
            <p>Para filtrar suas mensagens:</p>
            <ol>
                <li>Use o botão de filtros no topo da página</li>
                <li>Selecione as categorias desejadas</li>
                <li>Aplique os filtros</li>
                <li>Os resultados serão atualizados automaticamente</li>
            </ol>
        `
    }
];

// Renderizar lista de questões
function renderQuestions() {
    const questionsList = document.getElementById('questionsList');
    questionsList.innerHTML = questions.map(question => `
        <div class="col-12 mb-3">
            <div class="card question-card" data-question-id="${question.id}">
                <div class="card-body">
                    <h5 class="card-title text-primary mb-0">
                        ${question.title}
                    </h5>
                </div>
            </div>
        </div>
    `).join('');

    // Adicionar event listeners
    document.querySelectorAll('.question-card').forEach(card => {
        card.addEventListener('click', () => {
            const questionId = parseInt(card.dataset.questionId);
            const question = questions.find(q => q.id === questionId);
            showAnswer(question);
        });
    });
}

// Mostrar resposta no modal
function showAnswer(question) {
    const modal = new bootstrap.Modal(document.getElementById('questionModal'));
    document.querySelector('#questionModal .modal-title').textContent = question.title;
    document.querySelector('#questionModal .modal-body').innerHTML = question.answer;
    modal.show();
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderQuestions();
});