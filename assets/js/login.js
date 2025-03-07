const form = document.getElementById('loginForm');
const user = document.getElementById('inputMail');
const pass = document.getElementById('password');

function login(e){
     e.preventDefault();
     const logged = user.value === 'victor@gmail.com' && pass.value === '12345'
     if (logged){
        sessionStorage.setItem('auth', true);
        location.href = './../menu.html';

     }else{
        alert('usuario y/o contraseña incorrectos');
        
     }
}




form.addEventListener("submit")