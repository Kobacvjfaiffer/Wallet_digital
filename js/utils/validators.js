// validators.js - Validaciones de formularios
const Validators = {
    // Validar campo requerido
    required: (value, fieldName = 'Campo') => {
        if (!value || value.trim() === '') {
            return `${fieldName} es requerido`;
        }
        return null;
    },
    
    // Validar email
    email: (value) => {
        if (!Helpers.isValidEmail(value)) {
            return 'Ingresa un email válido';
        }
        return null;
    },
    
    // Validar longitud mínima
    minLength: (value, min, fieldName = 'Campo') => {
        if (value.length < min) {
            return `${fieldName} debe tener al menos ${min} caracteres`;
        }
        return null;
    },
    
    // Validar longitud máxima
    maxLength: (value, max, fieldName = 'Campo') => {
        if (value.length > max) {
            return `${fieldName} no puede tener más de ${max} caracteres`;
        }
        return null;
    },
    
    // Validar contraseña (al menos 1 número, 1 letra, 6 caracteres)
    password: (value) => {
        if (value.length < 6) {
            return 'La contraseña debe tener al menos 6 caracteres';
        }
        if (!/[A-Za-z]/.test(value)) {
            return 'La contraseña debe contener al menos una letra';
        }
        if (!/[0-9]/.test(value)) {
            return 'La contraseña debe contener al menos un número';
        }
        return null;
    },
    
    // Validar que las contraseñas coincidan
    passwordsMatch: (password, confirmPassword) => {
        if (password !== confirmPassword) {
            return 'Las contraseñas no coinciden';
        }
        return null;
    },
    
    // Validar monto (número positivo)
    amount: (value) => {
        const num = parseFloat(value);
        if (isNaN(num)) {
            return 'Ingresa un monto válido';
        }
        if (num <= 0) {
            return 'El monto debe ser mayor a 0';
        }
        return null;
    },
    
    // Validar formulario completo
    validateForm: (formData, rules) => {
        const errors = {};
        
        for (const [field, fieldRules] of Object.entries(rules)) {
            const value = formData[field] || '';
            
            for (const rule of fieldRules) {
                let error = null;
                
                if (typeof rule === 'function') {
                    error = rule(value);
                } else if (rule.validator) {
                    error = rule.validator(value, ...(rule.params || []));
                }
                
                if (error) {
                    errors[field] = error;
                    break;
                }
            }
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    },
    
    // Mostrar errores en el formulario
    showErrors: (form, errors) => {
        // Limpiar errores anteriores
        form.querySelectorAll('.is-invalid').forEach(el => {
            el.classList.remove('is-invalid');
        });
        form.querySelectorAll('.invalid-feedback').forEach(el => {
            el.remove();
        });
        
        // Mostrar nuevos errores
        for (const [field, error] of Object.entries(errors)) {
            const input = form.querySelector(`[name="${field}"], #${field}`);
            if (input) {
                input.classList.add('is-invalid');
                
                const feedback = document.createElement('div');
                feedback.className = 'invalid-feedback';
                feedback.textContent = error;
                input.parentNode.insertBefore(feedback, input.nextSibling);
            }
        }
    },
    
    // Limpiar errores del formulario
    clearErrors: (form) => {
        form.querySelectorAll('.is-invalid').forEach(el => {
            el.classList.remove('is-invalid');
        });
        form.querySelectorAll('.invalid-feedback').forEach(el => {
            el.remove();
        });
    }
};

window.Validators = Validators;