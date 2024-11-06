// src/public/js/auth.js

// Gerenciamento de autenticação
const auth = {
    // Verifica se o usuário está autenticado
    isAuthenticated() {
        return !!localStorage.getItem('authToken');
    },

    // Verifica se o usuário é master
    isMasterUser() {
        return localStorage.getItem('userRole') === 'master';
    },

    // Obter token
    getToken() {
        return localStorage.getItem('authToken');
    },

    // Logout
    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
    },

    // Adicionar token em todas as requisições
    setupAxiosInterceptors() {
        axios.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Interceptar respostas para tratar erros de autenticação
        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    this.logout();
                }
                return Promise.reject(error);
            }
        );
    },

    // Mostrar/esconder elementos baseado no tipo de usuário
    updateUI() {
        const isMaster = this.isMasterUser();
        
        // Elementos que só devem ser visíveis para usuários master
        document.querySelectorAll('[data-master-only]').forEach(el => {
            el.style.display = isMaster ? '' : 'none';
        });

        // Atualizar nome/role do usuário no navbar
        const userRoleElement = document.getElementById('userRole');
        if (userRoleElement) {
            userRoleElement.textContent = isMaster ? 'Usuário Master' : 'Usuário Regular';
        }
    }
};

// Verificar autenticação em todas as páginas (exceto login)
document.addEventListener('DOMContentLoaded', () => {
    // Não verificar na página de login
    if (window.location.pathname === '/login') return;

    // Verificar autenticação
    if (!auth.isAuthenticated()) {
        window.location.href = '/login';
        return;
    }

    // Configurar interceptors do axios
    auth.setupAxiosInterceptors();

    // Atualizar UI baseado no tipo de usuário
    auth.updateUI();

    // Setup do botão de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => auth.logout());
    }
});

// Exportar para uso em outros arquivos
window.auth = auth;