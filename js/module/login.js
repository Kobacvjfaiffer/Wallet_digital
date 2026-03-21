
// js/modules/login.js - VERSIÓN CORREGIDA
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
        
        // Limpiar mensajes al escribir
        this.emailInput?.addEventListener('input', () => this.clearMessage());
        this.passwordInput?.addEventListener('input', () => this.clearMessage());
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const email = this.emailInput?.value.trim().toLowerCase();
        const password = this.passwordInput?.value;
        
        console.log('Intentando login con:', email, password); // 👈 DEBUG
        
        // Validaciones
        if (!email || !password) {
            this.showMessage('Por favor completa todos los campos', 'warning');
            return;
        }
        
        if (!Helpers.isValidEmail(email)) {
            this.showMessage('Por favor ingresa un email válido', 'warning');
            return;
        }
        
        this.setLoading(true);
        
        try {
            // AUTENTICACIÓN CORREGIDA
            const isValid = await this.authenticate(email, password);
            
            console.log('Resultado autenticación:', isValid); // 👈 DEBUG
            
            if (isValid) {
                // Crear sesión
                const userData = {
                    id: 1,
                    name: email.split('@')[0],
                    email: email,
                    role: 'user',
                    memberSince: new Date().toISOString()
                };
                
                const token = btoa(`${email}:${Date.now()}`);
                
                // Usar el método correcto de auth
                if (auth && auth.setSession) {
                    auth.setSession(userData, token);
                } else {
                    // Fallback si auth no tiene setSession
                    const session = {
                        user: userData,
                        token: token,
                        expiresAt: Date.now() + (24 * 60 * 60 * 1000)
                    };
                    sessionStorage.setItem('guardpal_auth', JSON.stringify(session));
                }
                
                this.showMessage('✅ Login exitoso! Redirigiendo...', 'success');
                
                setTimeout(() => {
                    // Redirigir a dashboard (verificar ruta correcta)
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                this.showMessage('❌ Email o contraseña incorrectos', 'danger');
                if (this.passwordInput) this.passwordInput.value = '';
                this.passwordInput?.focus();
            }
        } catch (error) {
            console.error('Error detallado:', error);
            this.showMessage('Error de conexión. Intenta de nuevo.', 'danger');
        } finally {
            this.setLoading(false);
        }
    }
    
    async authenticate(email, password) {
        // AUTENTICACIÓN CORREGIDA - SIMULACIÓN FUNCIONAL
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // CREDENCIALES VÁLIDAS
        const validEmail = 'victor@gmail.com';
        const validPassword = '12345';
        
        // Comparación EXACTA
        const isValid = email === validEmail && password === validPassword;
        
        console.log('Comparando:', email, '===', validEmail, '?', email === validEmail);
        console.log('Comparando contraseña:', password, '===', validPassword, '?', password === validPassword);
        
        return isValid;
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
            
            // Auto-cerrar después de 3 segundos para mensajes de éxito
            if (type === 'success') {
                setTimeout(() => {
                    if (this.messageDiv) this.messageDiv.innerHTML = '';
                }, 3000);
            } else {
                setTimeout(() => {
                    if (this.messageDiv) this.messageDiv.innerHTML = '';
                }, 5000);
            }
        }
    }
    
    clearMessage() {
        if (this.messageDiv) {
            this.messageDiv.innerHTML = '';
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new LoginModule();
});