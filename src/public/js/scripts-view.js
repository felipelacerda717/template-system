// public/js/scripts-view.js

// Estado global
const state = {
    scripts: [],
    currentCategory: null
};

// Funções de API
async function fetchScripts() {
    try {
        // Pegar o categoryId da URL
        const categoryId = window.location.pathname.split('/').pop();
        
        const response = await fetch(`/api/scripts?categoryId=${categoryId}`);
        const scripts = await response.json();
        
        state.scripts = scripts;
        renderScripts();
    } catch (error) {
        showToast('Erro', 'Não foi possível carregar os scripts', 'danger');
        console.error('Erro ao carregar scripts:', error);
    }
}

// Funções de Renderização
function renderScripts() {
    const container = document.getElementById('scriptsList');
    if (!container) return;

    if (state.scripts.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                Nenhum script cadastrado para esta categoria.
            </div>
        `;
        return;
    }

    container.innerHTML = state.scripts.map(script => `
        <div class="card mb-3">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">${script.title}</h5>
                <button class="btn btn-sm btn-outline-primary" onclick="copyToClipboard('${script.id}')">
                    <i class="fas fa-copy"></i>
                </button>
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
        </div>
    `).join('');
}

// Funções Utilitárias
async function copyToClipboard(scriptId) {
    const script = state.scripts.find(s => s.id === scriptId);
    if (!script) return;

    try {
        await navigator.clipboard.writeText(script.content);
        showToast('Sucesso', 'Script copiado para a área de transferência!', 'success');
    } catch (error) {
        showToast('Erro', 'Não foi possível copiar o script', 'danger');
    }
}

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

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    fetchScripts();

    // Setup da busca
    const searchInput = document.getElementById('searchScript');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            state.scripts = state.scripts.filter(script => 
                script.title.toLowerCase().includes(searchTerm) ||
                script.content.toLowerCase().includes(searchTerm) ||
                script.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
            );
            renderScripts();
        });
    }
});