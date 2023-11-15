window.onload = function() {
        // Realizar solicitud AJAX para verificar el estado del usuario
        fetch('/status')
            .then(response => response.json())
            .then(data => {
                var loginRegisterLink = document.getElementById('loginRegisterLink');
                var userAccountMenu = document.getElementById('userAccountMenu');
                var usernameDisplay = document.getElementById('usernameDisplay');

                if (data.loggedIn) {
                    loginRegisterLink.style.display = 'none';
                    userAccountMenu.style.display = 'block';
                    if (usernameDisplay) {
                        usernameDisplay.textContent = data.username;
                    }
                } else {
                    loginRegisterLink.style.display = 'block';
                    userAccountMenu.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

        // Manejar cierre de sesión
        var logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', function() {
                // Aquí debes implementar la lógica de cierre de sesión
                // Por ejemplo, podría ser otra solicitud AJAX a tu servidor
            });
        }
    };

