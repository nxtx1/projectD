document.addEventListener("DOMContentLoaded", function() {
      // Registro
      document.getElementById('submit_register').addEventListener('click', function(e) {
        e.preventDefault();
    
        const nombre_usuario = document.getElementById('nombre_usuario').value;
        const correo = document.getElementById('correo_login').value;
        const contrasena = document.getElementById('contrasena_login').value;
    
        fetch('http://localhost:3000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({nombre_usuario, correo , contrasena})
        })
        .then(response => response.json())
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
      });
    
      // Inicio de sesión
      document.getElementById('submit_login').addEventListener('click', function(e) {
        e.preventDefault();
    
        const correo = document.getElementById('correo').value;
        const contrasena = document.getElementById('contrasena').value;
    console.log( correo , contrasena)
    
        fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({correo, contrasena})
        })
        .then(response => response.json())
        .then(data => {
          console.log(data);
            if (data.message === 'Logged in'){
                window.location.href = '/home.html';
            }
        })
        .catch(error => {
          console.error('Error:', error);
        });
      });
    });