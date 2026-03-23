// register.js - Registro de usuarios con persistencia
class RegisterModule {
    constructor() {
        this.form = document.getElementById('registerForm');
        this.fullNameInput = document.getElementById('fullName');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.confirmPasswordInput = document.getElementById('confirmPassword');
        this.termsInput = document.getElementById('terms');
        this.submitBtn = document.getElementById('submitBtn');
        this.messageDiv = document.getElementById('registerMessage');
        
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Validación en tiempo real
        this.emailInput?.addEventListener('blur', () => this.validateEmail());
        this.passwordInput?.addEventListener('input', () => this.validatePassword());
        this.confirmPasswordInput?.addEventListener('input', () => this.validateConfirmPassword());
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const fullName = this.fullNameInput?.value.trim();
        const email = this.emailInput?.value.trim().toLowerCase();
        const password = this.passwordInput?.value;
        const confirmPassword = this.confirmPasswordInput?.value;
        const terms = this.termsInput?.checked;
        
        console.log('📝 Intentando registrar:', { fullName, email });
        
        // Validaciones
        if (!fullName || !email || !password || !confirmPassword) {
            this.showMessage('Por favor completa todos los campos', 'warning');
            return;
        }
        
        if (!this.isValidEmail(email)) {
            this.showMessage('Ingresa un email válido', 'danger');
            return;
        }
        
        if (password.length < 6) {
            this.showMessage('La contraseña debe tener al menos 6 caracteres', 'danger');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showMessage('Las contraseñas no coinciden', 'danger');
            return;
        }
        
        if (!terms) {
            this.showMessage('Debes aceptar los términos y condiciones', 'warning');
            return;
        }
        
        this.setLoading(true);
        
        try {
            // Intentar registrar
            const success = await this.registerUser(fullName, email, password);
            
            if (success) {
                this.showMessage('✅ ¡Registro exitoso! Redirigiendo al login...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                this.showMessage('❌ El email ya está registrado. Usa otro email o inicia sesión.', 'danger');
            }
        } catch (error) {
            console.error('Error en registro:', error);
            this.showMessage('Error de conexión. Intenta de nuevo.', 'danger');
        } finally {
            this.setLoading(false);
        }
    }
    
    async registerUser(fullName, email, password) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Obtener usuarios existentes
        let users = JSON.parse(localStorage.getItem('guardpal_users') || '[]');
        
        // Verificar si el email ya existe
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            console.log('❌ Email ya registrado:', email);
            return false;
        }
        
        // Crear nuevo usuario
        const newUser = {
            id: users.length + 1,
            name: fullName,
            email: email,
            password: password, // ⚠️ En producción NUNCA guardar contraseñas así
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('guardpal_users', JSON.stringify(users));
        
        // También crear transacciones iniciales para el nuevo usuario
        const initialTransactions = [
            { id: Date.now(), type: 'deposit', amount: 1000, currency: 'USD', date: new Date().toISOString().split('T')[0], status: 'completed', description: 'Depósito de bienvenida' }
        ];
        localStorage.setItem(`guardpal_transactions_${newUser.id}`, JSON.stringify(initialTransactions));
        
        console.log('✅ Usuario registrado:', newUser);
        console.log('📊 Total usuarios:', users.length);
        
        return true;
    }
    
    isValidEmail(email) {
        const re = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        return re.test(email);
    }
    
    validateEmail() {
        const email = this.emailInput?.value.trim();
        if (email && !this.isValidEmail(email)) {
            this.showFieldError(this.emailInput, 'Ingresa un email válido');
            return false;
        }
        this.clearFieldError(this.emailInput);
        return true;
    }
    
    validatePassword() {
        const password = this.passwordInput?.value;
        if (password && password.length < 6) {
            this.showFieldError(this.passwordInput, 'La contraseña debe tener al menos 6 caracteres');
            return false;
        }
        this.clearFieldError(this.passwordInput);
        return true;
    }
    
    validateConfirmPassword() {
        const password = this.passwordInput?.value;
        const confirm = this.confirmPasswordInput?.value;
        
        if (confirm && password !== confirm) {
            this.showFieldError(this.confirmPasswordInput, 'Las contraseñas no coinciden');
            return false;
        }
        this.clearFieldError(this.confirmPasswordInput);
        return true;
    }
    
    showFieldError(field, message) {
        field.classList.add('is-invalid');
        
        let feedback = field.nextElementSibling;
        if (!feedback || !feedback.classList.contains('invalid-feedback')) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            field.parentNode.insertBefore(feedback, field.nextSibling);
        }
        feedback.textContent = message;
    }
    
    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const feedback = field.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = '';
        }
    }
    
    setLoading(isLoading) {
        if (this.submitBtn) {
            this.submitBtn.disabled = isLoading;
            if (isLoading) {
                this.submitBtn.innerHTML = `
                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                    Registrando...
                `;
            } else {
                this.submitBtn.innerHTML = 'Registrarse';
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
            }, 5000);
        }
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    new RegisterModule();
});