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
        clearErrors(); // Asegúrese de llamar a clearErrors para limpiar errores anteriores
    
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
        .then(response => response.json()) // Siempre convierte la respuesta a JSON
        .then(data => {
            if (data.message === 'Logged in') {
                localStorage.setItem('inicioSesionReciente', 'true');
                window.location.href = '/home.html';
            } else if (data.message === 'Usuario no encontrado') {
                showError(document.getElementById('correo'), 'Correo electrónico no encontrado');
            } else if (data.message === 'Incorrect password') {
                showError(document.getElementById('contrasena'), 'Contraseña incorrecta'); // Asegúrese de que el ID es 'contrasena'
            } else {
                // Si hay otro tipo de mensaje de error, decide cómo quieres mostrarlo
                showError(document.getElementById('correo'), data.message); // Asumiendo que quieres mostrar otros errores aquí
            }
        })
        .catch(error => {
            // Aquí podrías manejar errores de la red o problemas al hacer la petición fetch
            console.error('Error:', error);
        });
    };
});

function showRecoverPassword() {
    var modalContent = document.querySelector('.formulario__login');
    modalContent.innerHTML = `
        <i class="fa-solid fa-arrow-left back-arrow" onclick="showLogin()"></i>
        <h2>Recuperar Contraseña</h2>
        <p>Por favor, ingresa tu correo electrónico y te enviaremos instrucciones para recuperar tu contraseña.</p>
        <input type="email" placeholder="Correo electrónico" id="email-recovery">
        <div class="contenedor__acciones">
        <button onclick="sendRecoveryEmail()">Recuperar</button>
        </div>
    `;
    // Ajusta el estilo del formulario para incluir la flecha de retroceso
}

function showLogin() {
    // Restaura el contenido original del modal de inicio de sesión
    var modalContent = document.querySelector('.formulario__login');
    modalContent.innerHTML = `
        <h2>Iniciar Sesión</h2>
        <input type="text" placeholder="Correo electrónico" id="correo">
        <input type="password" placeholder="Contraseña" id="contrasena">
        <div class="contenedor__acciones">
            <button type="submit" id="submit_login">Entrar</button>
            <a href="#" onclick="showRecoverPassword()" class="forgot-password-link">¿Has olvidado tu contraseña?</a>
        </div>
    `;
}


function sendRecoveryEmail() {
    var email = document.getElementById('email-recovery').value;
    // Envía una petición al servidor para iniciar el proceso de recuperación de contraseña
    fetch('/recover-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud de recuperación de contraseña');
        }
        return response.json();
    })
    .then(data => {
        console.log('Correo de recuperación enviado.');
        showLogin(); // Muestra el formulario de inicio de sesión
    })
    .catch(error => {
        console.error('Error:', error);
    });
}