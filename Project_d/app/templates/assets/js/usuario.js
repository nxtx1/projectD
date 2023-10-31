document.addEventListener("DOMContentLoaded", function() {
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    
    // Realizar la solicitud fetch
    fetch('http://localhost:3000/status', {
        method: 'GET',
        credentials: 'include' // Para enviar cookies
    })
    .then(response => response.json())
    .then(data => {
        if (data.loggedIn) {
            // Usuario está logueado
            if (loginButton) loginButton.style.display = 'none';
            if (logoutButton) logoutButton.style.display = 'block';

            const usernameDisplay = document.getElementById('usernameDisplay');
            if (usernameDisplay) {
                usernameDisplay.textContent = data.username;
            } else {
                console.error("Elemento 'usernameDisplay' no encontrado");
            }

            // Ocultar mensaje de bienvenida después de 5 segundos
            setTimeout(function() {
                const welcomeMessage = document.getElementById('welcomeMessage');
                if (welcomeMessage) {
                    welcomeMessage.style.display = 'none';
                } else {
                    console.error("Elemento 'welcomeMessage' no encontrado");
                }
            }, 5000);
        } else {
            // Usuario no está logueado
            if (loginButton) loginButton.style.display = 'block';
            if (logoutButton) logoutButton.style.display = 'none';
            window.location.href = '/Login-register.html';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // Botón de cerrar sesión
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            fetch('http://localhost:3000/logout', {
                method: 'POST',
                credentials: 'include'
            })
            .then(response => {
                if (response.ok) {
                    localStorage.removeItem('token');
                    window.location.href = 'http://localhost:3000/';
                } else {
                    console.error('Failed to log out');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    } else {
        console.error("Elemento 'logoutButton' no encontrado");
    }

    // Botón de inicio de sesión
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            window.location.href = '/Login-register.html';
        });
    } else {
        console.error("Elemento 'loginButton' no encontrado");
    }
});