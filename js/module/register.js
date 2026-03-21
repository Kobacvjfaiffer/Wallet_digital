// js/modules/register.js - VERSIÓN CORREGIDA
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
        
        console.log('Registrando:', { fullName, email, password }); // 👈 DEBUG
        
        // Validaciones
        if (!fullName || !email || !password || !confirmPassword) {
            this.showMessage('Por favor completa todos los campos', 'warning');
            return;
        }
        
        if (!Helpers.isValidEmail(email)) {
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
            // Registro CORREGIDO
            const success = await this.registerUser(fullName, email, password);
            
            console.log('Resultado registro:', success); // 👈 DEBUG
            
            if (success) {
                this.showMessage('✅ ¡Registro exitoso! Redirigiendo al login...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                this.showMessage('❌ El email ya está registrado', 'danger');
            }
        } catch (error) {
            console.error('Error detallado:', error);
            this.showMessage('Error de conexión. Intenta de nuevo.', 'danger');
        } finally {
            this.setLoading(false);
        }
    }
    
    async registerUser(fullName, email, password) {
        // Simular delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Verificar si el email ya existe en localStorage
        const users = JSON.parse(localStorage.getItem('guardpal_users') || '[]');
        
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return false;
        }
        
        // Guardar nuevo usuario
        const newUser = {
            id: users.length + 1,
            name: fullName,
            email: email,
            password: password, // En producción NUNCA guardar así
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('guardpal_users', JSON.stringify(users));
        
        console.log('Usuario guardado:', newUser); // 👈 DEBUG
        
        return true;
    }
    
    validateEmail() {
        const email = this.emailInput?.value.trim();
        if (email && !Helpers.isValidEmail(email)) {
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
                if (this.messageDiv) this.messageDiv.innerHTML = '';
            }, 5000);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new RegisterModule();
});