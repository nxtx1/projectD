document.addEventListener('DOMContentLoaded', () => {
    fetch('/mis-publicaciones')
        .then(response => response.json())
        .then(publicaciones => {
            const container = document.getElementById('resultadosVehiculos');
            container.innerHTML = ''; // Limpiar resultados anteriores

            publicaciones.forEach(vehiculo => {
                // Construye el HTML para cada vehículo
                const vehiculoHTML = `
                    <div class="vehiculo">
                        <img src="data:image/jpeg;base64,${vehiculo.foto}" alt="${vehiculo.modelo}">
                        <h3>${vehiculo.marca} ${vehiculo.modelo}</h3>
                        <p>Año: ${vehiculo.ano}</p>
                        <p>Precio: $${vehiculo.precio}</p>
                        <!-- Agregar más detalles de tu vehículo aquí -->
                    </div>
                `;
                container.innerHTML += vehiculoHTML;
            });
        })
        .catch(error => console.error('Error al cargar las publicaciones:', error));
});
