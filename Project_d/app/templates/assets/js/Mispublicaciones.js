
document.addEventListener('DOMContentLoaded', () => {
    // Recuperar el token almacenado en el almacenamiento local o en las cookies
    const token = localStorage.getItem('token'); // o la función correspondiente para obtenerlo de una cookie
    
    // Actualizar la solicitud fetch para incluir el token en el encabezado
    fetch('/mis-publicaciones', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(publicaciones => {
        const container = document.getElementById('resultadosVehiculos');
        container.innerHTML = ''; // Limpiar resultados anteriores

        publicaciones.forEach(vehiculo => {
            // Asegurarse de que se tiene un id de vehículo válido
            const detalleVehiculoURL = `/detalle-vehiculo-mispublicaciones/${vehiculo.id_vehiculo || ''}`;
            // Construye el HTML para cada vehículo
            const vehiculoHTML = `
            <div class="col-lg-4 col-md-6 mb-2">
              <div class="rent-item mb-4">
                <img class="img-fluid mb-4" src="${vehiculo.imagen ? 'data:image/jpeg;base64,' + vehiculo.imagen : 'ruta_a_imagen_por_defecto.jpg'}" alt="Foto del vehículo">
                
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
        });
    })
    .catch(error => console.error('Error al cargar las publicaciones:', error));
});
