// src/public/js/scripts-manager.js

// Estado global
const state = {
    scripts: {
        topo: [],
        meio: [],
        fundo: []
    }
};

// Funções de API
// Função para carregar scripts
// Função para debug
function logState() {
    console.log('Current state:', state);
}

// Adicione esta chamada ao final do fetchScripts
async function fetchScripts() {
    try {
        const response = await fetch('/api/scripts');
        const scripts = await response.json();
        console.log('Fetched scripts:', scripts); // Debug log
        
        // Organizar scripts por categoria
        state.scripts = {
            topo: scripts.filter(s => s.categoryId === 'primeiro-contato' || s.categoryId === 'identificacao-necessidades'),
            meio: scripts.filter(s => s.categoryId === 'negociacao-preco'),
            fundo: scripts.filter(s => s.categoryId === 'fechamento')
        };
        
        renderAllSections();
        logState(); // Debug log
    } catch (error) {
        showToast('Erro', 'Não foi possível carregar os scripts', 'danger');
        console.error('Erro ao carregar scripts:', error);
    }
}

async function createScript(scriptData) {
    try {
        const response = await fetch('/api/scripts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(scriptData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.details || error.error || 'Erro ao criar script');
        }

        await fetchScripts(); // Recarregar lista
        showToast('Sucesso', 'Script criado com sucesso!', 'success');
        return true;
    } catch (error) {
        showToast('Erro', error.message, 'danger');
        return false;
    }
}

async function updateScript(id, scriptData) {
    try {
        const response = await fetch(`/api/scripts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(scriptData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.details || error.error || 'Erro ao atualizar script');
        }

        await fetchScripts(); // Recarregar lista
        showToast('Sucesso', 'Script atualizado com sucesso!', 'success');
        return true;
    } catch (error) {
        showToast('Erro', error.message, 'danger');
        return false;
    }
}

async function deleteScript(id) {
    if (!confirm('Tem certeza que deseja excluir este script?')) return;

    try {
        const response = await fetch(`/api/scripts/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.details || error.error || 'Erro ao deletar script');
        }

        await fetchScripts(); // Recarregar lista
        showToast('Sucesso', 'Script excluído com sucesso!', 'success');
    } catch (error) {
        showToast('Erro', error.message, 'danger');
    }
}

// Funções de Renderização
function renderAllSections() {
    renderFunnelSection('topo', document.getElementById('topoFunilScripts'));
    renderFunnelSection('meio', document.getElementById('meioFunilScripts'));
    renderFunnelSection('fundo', document.getElementById('fundoFunilScripts'));
}

function renderFunnelSection(stage, container) {
    if (!container) return;

    const scripts = state.scripts[stage] || [];
    console.log(`Rendering ${stage} scripts:`, scripts); // Debug log
    
    if (scripts.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                Nenhum script cadastrado para esta etapa do funil.
            </div>
        `;
        return;
    }

    container.innerHTML = scripts.map(script => `
        <div class="col-12">
            <div class="card script-card mb-3">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0">${script.title}</h5>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-secondary" onclick="copyToClipboard('${script.id}')">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-primary" onclick="editScript('${script.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteScript('${script.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <p class="card-text">${script.content}</p>
                    ${script.tags && script.tags.length > 0 ? `
                        <div class="mt-2">
                            ${script.tags.map(tag => `
                                <span class="badge bg-secondary me-1">${tag}</span>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="card-footer text-muted">
                    <small>Atualizado em: ${new Date(script.updatedAt).toLocaleString()}</small>
                </div>
            </div>
        </div>
    `).join('');
}

// Função para copiar script para clipboard
async function copyToClipboard(scriptId) {
    const script = Object.values(state.scripts)
        .flat()
        .find(s => s.id === scriptId);
    
    if (!script) return;

    try {
        await navigator.clipboard.writeText(script.content);
        showToast('Sucesso', 'Script copiado para a área de transferência!', 'success');
    } catch (error) {
        showToast('Erro', 'Não foi possível copiar o script', 'danger');
    }
}

// Handlers de Formulário
async function handleScriptSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    // Preparar dados do script
    const scriptData = {
        title: formData.get('title').trim(),
        content: formData.get('content').trim(),
        categoryId: formData.get('categoryId'),
        tags: formData.get('tags')
            ?.split(',')
            .map(tag => tag.trim())
            .filter(Boolean) || []
    };

    try {
        // Mostrar loading
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Salvando...';

        const response = await fetch('/api/scripts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(scriptData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.details || error.error || 'Erro ao criar script');
        }

        // Fechar modal e resetar form
        const modal = bootstrap.Modal.getInstance(document.getElementById('newScriptModal'));
        modal.hide();
        form.reset();

        // Atualizar lista de scripts
        await fetchScripts();

        // Mostrar mensagem de sucesso
        showToast('Sucesso', 'Script criado com sucesso!', 'success');
    } catch (error) {
        showToast('Erro', error.message, 'danger');
    } finally {
        // Restaurar botão
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.innerHTML = 'Salvar Script';
    }
}


function editScript(id) {
    const script = Object.values(state.scripts)
        .flat()
        .find(s => s.id === id);

    if (!script) return;

    const form = document.getElementById('scriptForm');
    form.dataset.scriptId = script.id;
    
    form.querySelector('[name="title"]').value = script.title;
    form.querySelector('[name="content"]').value = script.content;
    form.querySelector('[name="funnelStage"]').value = script.funnelStage;
    if (script.tags) {
        form.querySelector('[name="tags"]').value = script.tags.join(', ');
    }

    // Atualizar título do modal
    const modalTitle = document.querySelector('#newScriptModal .modal-title');
    modalTitle.textContent = 'Editar Script';
    
    // Atualizar texto do botão
    const submitButton = document.querySelector('#newScriptModal .modal-footer .btn-primary');
    submitButton.textContent = 'Atualizar Script';

    // Abrir modal
    const modal = new bootstrap.Modal(document.getElementById('newScriptModal'));
    modal.show();
}

// Funções de UI
function showToast(title, message, type = 'info') {
    const toastContainer = document.querySelector('.toast-container') || createToastContainer();
    
    const toastHtml = `
        <div class="toast align-items-center text-white bg-${type} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    <strong>${title}</strong><br>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    const toast = toastContainer.lastElementChild;
    const bsToast = new bootstrap.Toast(toast, { autohide: true, delay: 3000 });
    
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
    bsToast.show();
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(container);
    return container;
}

// Funções utilitárias
function getCategoryById(categoryId) {
    const funnelSections = {
        topo: {
            categories: [
                { id: 'primeiro-contato', funnelStage: 'topo' },
                { id: 'identificacao-necessidades', funnelStage: 'topo' }
            ]
        },
        meio: {
            categories: [
                { id: 'negociacao-preco', funnelStage: 'meio' }
            ]
        },
        fundo: {
            categories: [
                { id: 'fechamento', funnelStage: 'fundo' }
            ]
        }
    };

    for (const section of Object.values(funnelSections)) {
        const category = section.categories.find(cat => cat.id === categoryId);
        if (category) return category;
    }
    return null;
}
// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Carregar scripts iniciais
    fetchScripts();

    // Setup do formulário
    const form = document.getElementById('scriptForm');
    if (form) {
        form.addEventListener('submit', handleScriptSubmit);
    }
    // Resetar form quando o modal for fechado
    const modal = document.getElementById('newScriptModal');
    if (modal) {
        modal.addEventListener('hidden.bs.modal', () => {
            const form = document.getElementById('scriptForm');
            form.reset();
            delete form.dataset.scriptId;
            
            // Resetar título do modal e botão
            const modalTitle = modal.querySelector('.modal-title');
            modalTitle.textContent = 'Novo Script';
            
            const submitButton = modal.querySelector('.modal-footer .btn-primary');
            submitButton.textContent = 'Salvar Script';
        });
    
    }

});