
    window.onload = function() {
        const usuarionumero = 2;
        // Realizar solicitud AJAX para verificar el estado del usuario
        fetch('/status', {
            credentials: 'include' // Necesario si estás manejando sesiones con cookies
        })
        .then(response => response.json())
        .then(data => {
            var loginRegisterLink = document.getElementById('loginRegisterLink');
            var userAccountMenu = document.getElementById('userAccountMenu');
            var mechanicMenu = document.getElementById('mechanicMenu'); // Asegúrate de tener este elemento en tu HTML
            var adminMenu = document.getElementById('adminMenu'); // Asegúrate de tener este elemento en tu HTML
            var welcomeMessage = document.getElementById('welcomeMessage'); // Asegúrate de que el ID sea correcto


    
            if (data.loggedIn) {
                            switch(data.rol) {
                case 0: // Usuario normal
                    userAccountMenu.style.display = 'block';
                    break;
                case 1: // Mecánico
                    mechanicMenu.style.display = 'block';
                    break;
                case 2: // Administrador
                    adminMenu.style.display = 'block';
                    break;
            }
                loginRegisterLink.style.display = 'none';
                welcomeMessage.style.display = 'block'; // Muestra el mensaje de bienvenida
                var usernameDisplay = document.getElementById('usernameDisplay');
                if (usernameDisplay) {
                    usernameDisplay.textContent = data.username;
                }
    
                // Mostrar menú basado en el rol del usuario

    
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
            } else {
                // Usuario no ha iniciado sesión
                loginRegisterLink.style.display = 'block';
                userAccountMenu.style.display = 'none';
                mechanicMenu.style.display = 'none';
                adminMenu.style.display = 'none';
                welcomeMessage.style.display = 'none'; // Oculta el mensaje de bienvenida
            }
        })
    


    // Manejar cierre de sesión
    document.querySelectorAll('.logout-button').forEach(function(button) {
        button.addEventListener('click', function() {
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
                        if (window.location.pathname) {
                            // Redirige a la página de inicio después de un retraso
                            setTimeout(() => {
                                window.location.href = 'Home.html';
                            }, 2000);
                        } else {
                            // Recarga la página después de un retraso
                            setTimeout(() => {
                                window.location.reload();
                            }, 1500);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                }
              });
            // Implementa la lógica de cierre de sesión aquí
        });
    }
)};
