// login.js - Login que funciona con usuarios registrados
class LoginModule {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.submitBtn = document.getElementById('submitBtn');
        this.messageDiv = document.getElementById('loginMessage');
        
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        this.emailInput?.addEventListener('input', () => this.clearMessage());
        this.passwordInput?.addEventListener('input', () => this.clearMessage());
        
        // Verificar si hay sesión activa
        if (this.isAuthenticated()) {
            window.location.href = 'dashboard.html';
        }
    }
    
    isAuthenticated() {
        const sesion = sessionStorage.getItem('guardpal_auth');
        if (!sesion) return false;
        try {
            const data = JSON.parse(sesion);
            return Date.now() < data.expiresAt;
        } catch(e) {
            return false;
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const email = this.emailInput?.value.trim().toLowerCase();
        const password = this.passwordInput?.value;
        
        if (!email || !password) {
            this.showMessage('Por favor completa todos los campos', 'warning');
            return;
        }
        
        if (!this.isValidEmail(email)) {
            this.showMessage('Ingresa un email válido', 'warning');
            return;
        }
        
        this.setLoading(true);
        
        try {
            const user = await this.authenticate(email, password);
            
            if (user) {
                // Crear sesión
                const token = btoa(`${email}:${Date.now()}`);
                const session = {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role || 'user'
                    },
                    token: token,
                    expiresAt: Date.now() + (24 * 60 * 60 * 1000)
                };
                
                sessionStorage.setItem('guardpal_auth', JSON.stringify(session));
                
                // Cargar transacciones del usuario
                const userTransactions = localStorage.getItem(`guardpal_transactions_${user.id}`);
                if (userTransactions) {
                    localStorage.setItem('guardpal_transactions', userTransactions);
                }
                
                console.log('✅ Login exitoso:', user.email);
                this.showMessage('✅ Login exitoso! Redirigiendo...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                this.showMessage('❌ Email o contraseña incorrectos', 'danger');
                if (this.passwordInput) this.passwordInput.value = '';
                this.passwordInput?.focus();
            }
        } catch (error) {
            console.error('Error:', error);
            this.showMessage('Error de conexión. Intenta de nuevo.', 'danger');
        } finally {
            this.setLoading(false);
        }
    }
    
    async authenticate(email, password) {
        // Simular delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Obtener usuarios registrados
        const users = JSON.parse(localStorage.getItem('guardpal_users') || '[]');
        
        // Usuario por defecto si no hay usuarios
        if (users.length === 0) {
            // Crear usuario demo
            const demoUser = {
                id: 1,
                name: 'Víctor',
                email: 'victor@gmail.com',
                password: '12345',
                role: 'user',
                createdAt: new Date().toISOString()
            };
            users.push(demoUser);
            localStorage.setItem('guardpal_users', JSON.stringify(users));
            
            // Crear transacciones demo
            const demoTransactions = [
                { id: Date.now(), type: 'deposit', amount: 1000, currency: 'USD', date: new Date().toISOString().split('T')[0], status: 'completed', description: 'Depósito inicial' },
                { id: Date.now() + 1, type: 'deposit', amount: 500, currency: 'USD', date: new Date().toISOString().split('T')[0], status: 'completed', description: 'Transferencia recibida' }
            ];
            localStorage.setItem('guardpal_transactions_1', JSON.stringify(demoTransactions));
        }
        
        // Buscar usuario
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role || 'user'
            };
        }
        
        return null;
    }
    
    isValidEmail(email) {
        const re = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        return re.test(email);
    }
    
    setLoading(isLoading) {
        if (this.submitBtn) {
            this.submitBtn.disabled = isLoading;
            if (isLoading) {
                this.submitBtn.innerHTML = `
                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                    Validando...
                `;
            } else {
                this.submitBtn.innerHTML = 'Iniciar sesión';
            }
        }
    }
    
    showMessage(message, type) {
        if (this.messageDiv) {
            const alertClass = type === 'danger' ? 'alert-danger' : 
                              type === 'success' ? 'alert-success' : 'alert-warning';
            
            this.messageDiv.innerHTML = `
                <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
                    ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
            
            setTimeout(() => {
                if (this.messageDiv.innerHTML) this.messageDiv.innerHTML = '';
            }, 3000);
        }
    }
    
    clearMessage() {
        if (this.messageDiv) {
            this.messageDiv.innerHTML = '';
        }
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    new LoginModule();
});