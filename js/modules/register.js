// register.js
console.log('✅ register.js cargado');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando registro');
    
    const form = document.getElementById('registerForm');
    if (!form) {
        console.error('❌ Formulario no encontrado');
        return;
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName')?.value.trim();
        const email = document.getElementById('email')?.value.trim().toLowerCase();
        const password = document.getElementById('password')?.value;
        const confirmPassword = document.getElementById('confirmPassword')?.value;
        const terms = document.getElementById('terms')?.checked;
        const messageDiv = document.getElementById('registerMessage');
        const submitBtn = document.getElementById('submitBtn');
        
        function showMessage(msg, type) {
            if (messageDiv) {
                const alertClass = type === 'danger' ? 'alert-danger' : 'alert-success';
                messageDiv.innerHTML = `<div class="alert ${alertClass}">${msg}</div>`;
                setTimeout(() => messageDiv.innerHTML = '', 3000);
            }
        }
        
        // Validaciones
        if (!fullName || !email || !password || !confirmPassword) {
            showMessage('❌ Completa todos los campos', 'danger');
            return;
        }
        
        if (password !== confirmPassword) {
            showMessage('❌ Las contraseñas no coinciden', 'danger');
            return;
        }
        
        if (password.length < 6) {
            showMessage('❌ La contraseña debe tener al menos 6 caracteres', 'danger');
            return;
        }
        
        if (!terms) {
            showMessage('❌ Acepta los términos', 'danger');
            return;
        }
        
        // Obtener usuarios existentes
        let users = [];
        const storedUsers = localStorage.getItem('guardpal_users');
        if (storedUsers) {
            users = JSON.parse(storedUsers);
        }
        
        // Verificar si ya existe
        if (users.find(u => u.email === email)) {
            showMessage('❌ Este email ya está registrado', 'danger');
            return;
        }
        
        // Crear nuevo usuario
        const newUser = {
            id: Date.now(),
            name: fullName,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('guardpal_users', JSON.stringify(users));
        
        console.log('✅ Usuario registrado:', newUser);
        console.log('📋 Total usuarios:', users.length);
        
        showMessage('✅ ¡Registro exitoso! Redirigiendo...', 'success');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });
});