// Estado global para cache de dados
const state = {
    categories: [],
    templates: [],
    setCategories(newCategories) {
        this.categories = newCategories;
        this.updateCategorySelects();
    },
    updateCategorySelects() {
        const selects = document.querySelectorAll('select[name="categoryId"]');
        selects.forEach(select => {
            const currentValue = select.value;
            select.innerHTML = `
                <option value="">Selecione uma categoria...</option>
                ${this.categories.map(category => `
                    <option value="${category.id}" ${category.id === currentValue ? 'selected' : ''}>
                        ${category.name}
                    </option>
                `).join('')}
            `;
        });
    }
};

// Funções Utilitárias
function showToast(title, message, type = 'info') {
    // Criar container de toast se não existir
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }

    const toastHtml = `
        <div class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
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

function setFormLoading(formId, loading) {
    const form = document.getElementById(formId);
    if (!form) return;

    const submitButton = form.querySelector('button[type="submit"]');
    const inputs = form.querySelectorAll('input, textarea, select, button');
    
    submitButton.disabled = loading;
    inputs.forEach(input => input.disabled = loading);
}

function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
        const weightInput = form.querySelector('input[name="weight"]');
        if (weightInput) weightInput.value = "1";
    }
}

// Funções de API
async function handleRequestError(response) {
    if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let error = 'Ocorreu um erro na operação';
        
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            error = data.error || data.message || error;
        }
        
        throw new Error(error);
    }
    return response.json();
}

// Gerenciamento de Categorias
async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        const categories = await handleRequestError(response);
        state.setCategories(categories);
        displayCategories(categories);
    } catch (error) {
        showToast('Erro', error.message, 'danger');
    }
}

function displayCategories(categories) {
    const categoriesList = document.getElementById('categoriesList');
    if (!categoriesList) return;

    if (!categories.length) {
        categoriesList.innerHTML = `
            <div class="col-12 text-center text-muted py-5">
                <i class="fas fa-folder-open fa-3x mb-3"></i>
                <p>Nenhuma categoria cadastrada ainda.</p>
            </div>
        `;
        return;
    }

    categoriesList.innerHTML = categories.map(category => `
        <div class="col-12">
            <div class="card h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h5 class="card-title">${category.name}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">Peso: ${category.weight}</h6>
                        </div>
                        <div>
                            <button class="btn btn-sm btn-outline-primary me-1" onclick="editCategory('${category.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteCategory('${category.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="mt-2">
                        ${category.keywords.map(keyword => `
                            <span class="badge bg-secondary me-1 mb-1">${keyword}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

async function handleCategorySubmit(event) {
    event.preventDefault();
    setFormLoading('categoryForm', true);

    const formData = new FormData(event.target);
    const categoryData = {
        name: formData.get('name').trim(),
        keywords: formData.get('keywords')
            .split(',')
            .map(k => k.trim())
            .filter(k => k.length > 0),
        weight: Number(formData.get('weight'))
    };

    try {
        const response = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoryData)
        });

        await handleRequestError(response);
        showToast('Sucesso', 'Categoria criada com sucesso!', 'success');
        resetForm('categoryForm');
        loadCategories();
    } catch (error) {
        showToast('Erro', error.message, 'danger');
    } finally {
        setFormLoading('categoryForm', false);
    }
}

// Gerenciamento de Templates
async function loadTemplates() {
    try {
        const response = await fetch('/api/templates');
        const templates = await handleRequestError(response);
        state.templates = templates;
        displayTemplates(templates);
    } catch (error) {
        showToast('Erro', error.message, 'danger');
    }
}

function displayTemplates(templates) {
    const templatesList = document.getElementById('templatesList');
    if (!templatesList) return;

    if (!templates.length) {
        templatesList.innerHTML = `
            <div class="col-12 text-center text-muted py-5">
                <i class="fas fa-file-alt fa-3x mb-3"></i>
                <p>Nenhum template cadastrado ainda.</p>
            </div>
        `;
        return;
    }

    templatesList.innerHTML = templates.map(template => {
        const category = state.categories.find(c => c.id === template.categoryId);
        return `
            <div class="col-12">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <span class="badge bg-primary mb-2">
                                    ${category ? category.name : 'Categoria não encontrada'}
                                </span>
                                <p class="card-text">${template.text}</p>
                            </div>
                            <div>
                                <button class="btn btn-sm btn-outline-primary me-1" onclick="editTemplate('${template.id}')">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" onclick="deleteTemplate('${template.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

async function handleTemplateSubmit(event) {
    event.preventDefault();
    setFormLoading('templateForm', true);

    const formData = new FormData(event.target);
    const templateData = {
        categoryId: formData.get('categoryId'),
        text: formData.get('text').trim()
    };

    try {
        const response = await fetch('/api/templates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(templateData)
        });

        await handleRequestError(response);
        showToast('Sucesso', 'Template criado com sucesso!', 'success');
        resetForm('templateForm');
        loadTemplates();
    } catch (error) {
        showToast('Erro', error.message, 'danger');
    } finally {
        setFormLoading('templateForm', false);
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Carregar dados iniciais
    loadCategories();
    loadTemplates();

    // Setup forms
    const categoryForm = document.getElementById('categoryForm');
    const templateForm = document.getElementById('templateForm');

    if (categoryForm) {
        categoryForm.addEventListener('submit', handleCategorySubmit);
    }

    if (templateForm) {
        templateForm.addEventListener('submit', handleTemplateSubmit);
    }

    // Setup tabs
    const tabs = document.querySelectorAll('button[data-bs-toggle="tab"]');
    tabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', (event) => {
            if (event.target.getAttribute('data-bs-target') === '#categories') {
                loadCategories();
            } else if (event.target.getAttribute('data-bs-target') === '#templates') {
                loadTemplates();
            }
        });
    });
});