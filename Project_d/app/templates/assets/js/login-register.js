document.addEventListener("DOMContentLoaded", function() {
    // Registro
    document.getElementById('submit_register').addEventListener('click', function(e) {
        e.preventDefault();

        const nombre_usuario = document.getElementById('nombre_usuario').value;
        const correo = document.getElementById('correo_login').value;
        const contrasena = document.getElementById('contrasena_login').value;

        // Validaciones básicas en el cliente
        if (contrasena.length < 8) {
            alert("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        function validarCorreoElectronico(correo) {
            // Expresión regular para validar el formato del correo electrónico
            var expresionRegular = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
          
            return expresionRegular.test(correo);
          }

          if (!validarCorreoElectronico(correo)) {
            alert("Por favor, introduce un correo electrónico válido");
            return
        }
        
        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre_usuario, correo, contrasena })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => Promise.reject(err));
            }
            return response.json();
        })
        .then(data => {
            if(data.message === 'User registered') {
                Swal.fire({
                    title: "Has sido registrado correctamente!",
                    icon: "success"
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/home.html'; // Asegúrate de que esta es la ruta correcta a tu página de inicio de sesión
                    }
                });
            } else {
                // Si el mensaje no es el esperado, muestra una alerta con el mensaje del servidor
                alert(data.message);
            }
        })
        .catch(error => {
            // Muestra una alerta con el mensaje de error
            alert("Error: " + error.message);
        });
    });

    // Inicio de sesión
document.getElementById('submit_login').addEventListener('click', function(e) {
    e.preventDefault();

    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, contrasena })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => Promise.reject(err));
        }
        return response.json();
    })
    .then(data => {
        if (data.message === 'Logged in') {
            localStorage.setItem('inicioSesionReciente', 'true');
            window.location.href = '/home.html';
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        // Muestra una alerta con el mensaje de error
        alert("Error: " + error.message);
    });
    });
});
