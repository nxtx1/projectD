document.addEventListener("DOMContentLoaded", function() {
    // Función para validar el correo electrónico
    function validarCorreoElectronico(email) {
        var expresionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return expresionRegular.test(email);
    }

    // Función para mostrar errores
    function showError(input, message) {
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('error-message');
        errorMessage.textContent = message;
        input.classList.add('input-error');
        input.insertAdjacentElement('afterend', errorMessage);
    }

    // Función para limpiar errores
    function clearErrors() {
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
        document.querySelectorAll('.error-message').forEach(el => el.remove());
    }

    // Registro
    document.getElementById('submit_register').addEventListener('click', function(e) {
        e.preventDefault();
        clearErrors();

        const nombre_usuario = document.getElementById('nombre_usuario').value;
        const correo = document.getElementById('correo_login').value;
        const contrasena = document.getElementById('contrasena_login').value;
        let isValid = true;

        // Validaciones básicas en el cliente
        if (contrasena.length < 8) {
            showError(document.getElementById('contrasena_login'), "La contraseña debe tener al menos 8 caracteres.");
            isValid = false;
        }

        if (!validarCorreoElectronico(correo)) {
            showError(document.getElementById('correo_login'), "Por favor, introduce un correo electrónico válido.");
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        //
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
                        inicioSesion(correo, contrasena) // Asegúrate de que esta es la ruta correcta a tu página de inicio de sesión
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

    document.getElementById('submit_login').addEventListener('click', (e) => {
        e.preventDefault();
        inicioSesion();
    });
    
    const inicioSesion = (correo, contrasena) => {
        if (!correo || !contrasena) {
            correo = document.getElementById('correo').value;
            contrasena = document.getElementById('contrasena').value;
        }

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
    };
    
})