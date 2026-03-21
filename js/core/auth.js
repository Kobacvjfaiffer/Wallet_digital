
// auth.js - Sistema de autenticación mejorado
class AuthManager {
    constructor() {
        this.sessionData = null;
        this.init();
    }
    
    init() {
        this.loadSession();
        this.setupListeners();
    }
    
    loadSession() {
        try {
            const stored = sessionStorage.getItem(APP_CONFIG.AUTH_KEY);
            if (stored) {
                this.sessionData = JSON.parse(stored);
                this.validateSession();
            }
        } catch (error) {
            console.error('Error cargando sesión:', error);
            this.clearSession();
        }
    }
    
    validateSession() {
        if (!this.sessionData) return false;
        
        const now = Date.now();
        
        // Verificar expiración
        if (this.sessionData.expiresAt && now > this.sessionData.expiresAt) {
            console.warn('Sesión expirada');
            this.clearSession();
            return false;
        }
        
        return true;
    }
    
    isAuthenticated() {
        return this.validateSession();
    }
    
    getCurrentUser() {
        return this.sessionData?.user || null;
    }
    
    getToken() {
        return this.sessionData?.token || null;
    }
    
    setSession(user, token, remember = false) {
        const expiresAt = remember 
            ? Date.now() + (APP_CONFIG.SESSION_DURATION * 7)
            : Date.now() + APP_CONFIG.SESSION_DURATION;
        
        this.sessionData = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role || 'user'
            },
            token: token,
            expiresAt: expiresAt,
            loginAt: Date.now()
        };
        
        sessionStorage.setItem(APP_CONFIG.AUTH_KEY, JSON.stringify(this.sessionData));
        this.dispatchEvent('login', this.sessionData.user);
    }
    
    clearSession() {
        this.sessionData = null;
        sessionStorage.removeItem(APP_CONFIG.AUTH_KEY);
        this.dispatchEvent('logout');
    }
    
    logout(redirect = true) {
        this.clearSession();
        if (redirect) {
            window.location.href = '/login.html';
        }
    }
    
    requireAuth(redirectUrl = '/login.html') {
        if (!this.isAuthenticated()) {
            sessionStorage.setItem('auth_redirect', window.location.pathname);
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }
    
    requireGuest(redirectUrl = '/dashboard.html') {
        if (this.isAuthenticated()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }
    
    setupListeners() {
        // Escuchar cambios en storage (múltiples pestañas)
        window.addEventListener('storage', (event) => {
            if (event.key === APP_CONFIG.AUTH_KEY) {
                if (event.newValue) {
                    this.sessionData = JSON.parse(event.newValue);
                } else {
                    this.sessionData = null;
                }
                this.dispatchEvent('change');
            }
        });
    }
    
    dispatchEvent(type, data = null) {
        window.dispatchEvent(new CustomEvent(`auth:${type}`, { detail: data }));
    }
}

// Inicializar
const authManager = new AuthManager();
window.auth = authManager;