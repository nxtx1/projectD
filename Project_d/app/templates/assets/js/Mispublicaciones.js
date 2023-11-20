document.addEventListener('DOMContentLoaded', () => {
    // Recuperar el token almacenado para verificar si el usuario está autenticado
    const token = localStorage.getItem('token');

    // Actualizar la solicitud fetch para incluir el token en el encabezado
    fetch('/mis-publicaciones', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('No autorizado'); // O manejar redirección a la página de inicio de sesión
        }
        return response.json();
    })
    .then(publicaciones => {
        const container = document.getElementById('resultadosVehiculos');
        container.innerHTML = ''; // Limpiar resultados anteriores

        publicaciones.forEach(vehiculo => {
            // Aquí asegúrate de que el usuario autenticado es el dueño del vehículo
            const detalleVehiculoURL = token ? `/detalle-vehiculo/${vehiculo.id_vehiculo}` : 'detalle-vehiculo-mispublicaciones.html'; // Cambia 'login.html' por tu página de inicio de sesión
            // Construye el HTML para cada vehículo
            const vehiculoHTML = `
            <div class="col-lg-4 col-md-6 mb-2">
              <div class="rent-item mb-4">
                <img class="img-fluid mb-4" src="data:image/jpeg;base64,${vehiculo.foto}" alt="Foto del vehículo">
                
                <h4 class="text-uppercase mb-4">${vehiculo.marca} ${vehiculo.modelo}</h4>
                <div class="d-flex justify-content-center mb-4">
                    <div class="px-2">
                        <i class="fa fa-car text-primary mr-1"></i>
                        <span>${vehiculo.ano}</span>
                    </div>
                    <div class="px-2 border-left border-right">
                        <i class="fa fa-cogs text-primary mr-1"></i>
                        <span>${vehiculo.transmision === 1 ? 'Automático' : 'Mecánico'}</span>
                    </div>
                    <div class="px-2">
                        <i class="fa fa-road text-primary mr-1"></i>
                        <span>${vehiculo.kilometraje}K</span>
                    </div>
                </div>
                <a class="btn btn-primary px-3" href="${detalleVehiculoURL}">$${vehiculo.precio}</a>
              </div>
            </div>
          `;
          container.innerHTML += vehiculoHTML;
            // Resto del código para construir el HTML...
        });
    })
    .catch(error => {
        console.error('Error al cargar las publicaciones:', error);
        // Aquí podrías redirigir al usuario a la página de inicio de sesión
    });
});
