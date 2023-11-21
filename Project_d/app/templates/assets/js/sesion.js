window.onload = function() {
    // Realizar solicitud AJAX para verificar el estado del usuario
    fetch('/status', {
        credentials: 'include' // Necesario si estás manejando sesiones con cookies
    })
    .then(response => response.json())
    .then(data => {
        var loginRegisterLink = document.getElementById('loginRegisterLink');
        var userAccountMenu = document.getElementById('userAccountMenu');
        var welcomeMessage = document.getElementById('welcomeMessage'); // Asegúrate de que el ID sea correcto
    // Realizar solicitud AJAX para verificar el estado del usuario
    fetch('/status', {
        credentials: 'include' // Necesario si estás manejando sesiones con cookies
    })
    .then(response => response.json())
    .then(data => {
        var loginRegisterLink = document.getElementById('loginRegisterLink');
        var userAccountMenu = document.getElementById('userAccountMenu');
        var welcomeMessage = document.getElementById('welcomeMessage'); // Asegúrate de que el ID sea correcto

        if (data.loggedIn) {
            if (localStorage.getItem('inicioSesionReciente') === 'true') {
                const Toast = Swal.mixin({
                toast: true,
                position: "top",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
              });
              Toast.fire({
                icon: "null",
                title: `<div style="text-align: center;">Bienvenido, ${data.username}</div>`
              });
              localStorage.removeItem('inicioSesionReciente');
            }

            // Usuario ha iniciado sesión
            loginRegisterLink.style.display = 'none';
            userAccountMenu.style.display = 'block';
            welcomeMessage.style.display = 'block'; // Muestra el mensaje de bienvenida
            var usernameDisplay = document.getElementById('usernameDisplay');
            if (usernameDisplay) {
                usernameDisplay.textContent = data.username;
            }
        } else {
            // Usuario no ha iniciado sesión
            loginRegisterLink.style.display = 'block';
            userAccountMenu.style.display = 'none';
            welcomeMessage.style.display = 'none'; // Oculta el mensaje de bienvenida
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
        if (data.loggedIn) {
            if (localStorage.getItem('inicioSesionReciente') === 'true') {
                const Toast = Swal.mixin({
                toast: true,
                position: "top",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
              });
              Toast.fire({
                icon: "null",
                title: `<div style="text-align: center;">Bienvenido, ${data.username}</div>`
              });
              localStorage.removeItem('inicioSesionReciente');
            }

            // Usuario ha iniciado sesión
            loginRegisterLink.style.display = 'none';
            userAccountMenu.style.display = 'block';
            welcomeMessage.style.display = 'block'; // Muestra el mensaje de bienvenida
            var usernameDisplay = document.getElementById('usernameDisplay');
            if (usernameDisplay) {
                usernameDisplay.textContent = data.username;
            }
        } else {
            // Usuario no ha iniciado sesión
            loginRegisterLink.style.display = 'block';
            userAccountMenu.style.display = 'none';
            welcomeMessage.style.display = 'none'; // Oculta el mensaje de bienvenida
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // Manejar cierre de sesión
    var logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            Swal.fire({
                title: "¿Estás seguro de cerrar sesión?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Aceptar"
              }).then((result) => {
                if (result.isConfirmed) {
                    fetch('/logout', {
                        method: 'POST',
                        credentials: 'include' // Necesario si estás manejando sesiones con cookies
                    })
                    .then(response => {
                        if (response.ok) {
                            const Toast = Swal.mixin({
                                toast: true,
                                position: "bottom-end",
                                showConfirmButton: false,
                                timer: 2000,
                                timerProgressBar: true,
                                didOpen: (toast) => {
                                  toast.onmouseenter = Swal.stopTimer;
                                  toast.onmouseleave = Swal.resumeTimer;
                                }
                              });
                              Toast.fire({
                                icon: "success",
                                title: "Cerraste sesión correctamente"
                              });
                            // Cierre de sesión exitoso
                            return response.json();
                        }
                        throw new Error('Problema al cerrar sesión');
                    })
                    .then(data => {
                        // Actualizar la UI para reflejar que el usuario ha cerrado sesión
                        loginRegisterLink.style.display = 'block';
                        userAccountMenu.style.display = 'none';
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                }
              });
            // Implementa la lógica de cierre de sesión aquí
        });
    }
};


