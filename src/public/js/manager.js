// Exemplo de estrutura de dados
const mockScripts = {
    topo: [
        {
            id: 1,
            title: "Script para estabelecer um primeiro contato",
            description: "Abordagem inicial para novos leads",
            content: "Olá, {Nome do Contato}, meu nome é {Seu Nome} e trabalho na {Sua Empresa}. Recebi seu contato porque você interagiu em nosso anúncio, tenho certeza que nossos serviços podem ser de grande interesse para você. Você tem alguns minutos para conversar?",
            tags: ["primeiro contato", "apresentação"]
        },
        {
            id: 2,
            title: "Script para identificação das necessidades",
            description: "Entender as principais dores do cliente",
            content: "Oi, {Nome do Contato}. Eu sou {Seu Nome}, da {Sua Empresa}. Nós oferecemos soluções para que você volte a sorrir com confiança e acredito que podemos ajudar a dar adeus a insegurança na hora de sorrir ou mastigar. Você tem algum tempo para conversar sobre isso?",
            tags: ["necessidades", "diagnóstico"]
        }
    ],
    meio: [
        {
            id: 3,
            title: "Script de negociação de preço",
            description: "Quando o cliente questiona valores",
            content: "Compreendo sua preocupação com o investimento. Nossos valores são definidos com base na qualidade dos materiais utilizados e na expertise de nossa equipe. Além disso, oferecemos diversas formas de pagamento que podem facilitar esse investimento...",
            tags: ["preço", "negociação", "objeções"]
        }
    ],
    fundo: [
        {
            id: 4,
            title: "Script de fechamento",
            description: "Confirmação final do tratamento",
            content: "Que ótimo que você decidiu investir em seu sorriso! Vou confirmar todos os detalhes do seu tratamento e agendar sua primeira consulta...",
            tags: ["fechamento", "confirmação"]
        }
    ]
};

// Funções de renderização
function renderScripts() {
    renderFunnelSection('topo', document.getElementById('topoFunilScripts'));
    renderFunnelSection('meio', document.getElementById('meioFunilScripts'));
    renderFunnelSection('fundo', document.getElementById('fundoFunilScripts'));
}

function renderFunnelSection(stage, container) {
    if (!container) return;

    const scripts = mockScripts[stage] || [];
    
    container.innerHTML = scripts.map(script => `
        <div class="col-md-6 mb-4">
            <div class="card script-card h-100">
                <div class="script-header">
                    <div class="d-flex justify-content-between align-items-start">
                        <h5 class="card-title mb-0">${script.title}</h5>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-primary" onclick="editScript(${script.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteScript(${script.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <p class="text-muted small mb-0 mt-2">${script.description}</p>
                </div>
                <div class="card-body">
                    <p class="card-text">${script.content}</p>
                    <div class="mt-3">
                        ${script.tags.map(tag => 
                            `<span class="badge bg-secondary me-1">${tag}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        </div>
    `).join('') || `
        <div class="col-12">
            <div class="alert alert-info">
                Nenhum script cadastrado para esta etapa do funil.
            </div>
        </div>
    `;
}

// Funções de CRUD
function editScript(id) {
    // Encontrar o script em mockScripts
    let scriptToEdit;
    let stage;
    
    for (const [key, scripts] of Object.entries(mockScripts)) {
        const found = scripts.find(s => s.id === id);
        if (found) {
            scriptToEdit = found;
            stage = key;
            break;
        }
    }

    if (!scriptToEdit) return;

    // Preencher o formulário
    const form = document.getElementById('scriptForm');
    form.querySelector('[name="funnelStage"]').value = stage;
    form.querySelector('[name="title"]').value = scriptToEdit.title;
    form.querySelector('[name="description"]').value = scriptToEdit.description;
    form.querySelector('[name="content"]').value = scriptToEdit.content;
    form.querySelector('[name="tags"]').value = scriptToEdit.tags.join(', ');

    // Abrir o modal
    const modal = new bootstrap.Modal(document.getElementById('newScriptModal'));
    modal.show();
}

function deleteScript(id) {
    if (!confirm('Tem certeza que deseja excluir este script?')) return;

    // Em produção, aqui faria uma chamada à API
    for (const stage in mockScripts) {
        mockScripts[stage] = mockScripts[stage].filter(s => s.id !== id);
    }

    renderScripts();
    showToast('Sucesso', 'Script excluído com sucesso!', 'success');
}

function saveScript() {
    const form = document.getElementById('scriptForm');
    const formData = new FormData(form);

    const scriptData = {
        id: Date.now(), // Em produção, o ID viria do backend
        title: formData.get('title'),
        description: formData.get('description'),
        content: formData.get('content'),
        tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(Boolean)
    };

    const stage = formData.get('funnelStage');
    
    if (!mockScripts[stage]) {
        mockScripts[stage] = [];
    }
    
    mockScripts[stage].push(scriptData);

    // Fechar modal e atualizar vista
    const modal = bootstrap.Modal.getInstance(document.getElementById('newScriptModal'));
    modal.hide();
    form.reset();
    renderScripts();
    showToast('Sucesso', 'Script salvo com sucesso!', 'success');
}

// Função para mostrar notificações
function showToast(title, message, type = 'info') {
    // Implementação do toast (igual ao código anterior)
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderScripts();
});