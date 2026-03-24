// login.js
console.log('✅ login.js cargado');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando login');
    
    const form = document.getElementById('loginForm');
    if (!form) {
        console.error('❌ Formulario no encontrado');
        return;
    }
    
    // Verificar si ya hay sesión
    const sesion = sessionStorage.getItem('guardpal_auth');
    if (sesion) {
        try {
            const data = JSON.parse(sesion);
            if (Date.now() < data.expiresAt) {
                window.location.href = 'dashboard.html';
                return;
            }
        } catch(e) {}
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email')?.value.trim().toLowerCase();
        const password = document.getElementById('password')?.value;
        const messageDiv = document.getElementById('loginMessage');
        const submitBtn = document.getElementById('submitBtn');
        
        function showMessage(msg, type) {
            if (messageDiv) {
                const alertClass = type === 'danger' ? 'alert-danger' : 'alert-success';
                messageDiv.innerHTML = `<div class="alert ${alertClass}">${msg}</div>`;
                setTimeout(() => messageDiv.innerHTML = '', 3000);
            }
        }
        
        if (!email || !password) {
            showMessage('❌ Completa todos los campos', 'danger');
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Validando...';
        
        // Obtener usuarios
        let users = [];
        const storedUsers = localStorage.getItem('guardpal_users');
        if (storedUsers) {
            users = JSON.parse(storedUsers);
        }
        
        // Si no hay usuarios, crear demo
        if (users.length === 0) {
            users = [{
                id: 1,
                name: 'Víctor',
                email: 'victor@gmail.com',
                password: '12345',
                createdAt: new Date().toISOString()
            }];
            localStorage.setItem('guardpal_users', JSON.stringify(users));
        }
        
        console.log('🔐 Buscando usuario:', email);
        console.log('📋 Usuarios disponibles:', users.map(u => u.email));
        
        // Buscar usuario
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            console.log('✅ Login exitoso:', user.email);
            
            const session = {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
                token: btoa(email + Date.now()),
                expiresAt: Date.now() + 86400000
            };
            sessionStorage.setItem('guardpal_auth', JSON.stringify(session));
            
            showMessage('✅ Login exitoso! Redirigiendo...', 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            console.log('❌ Login fallido para:', email);
            showMessage('❌ Email o contraseña incorrectos', 'danger');
            document.getElementById('password').value = '';
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Iniciar sesión';
        }
    });
});