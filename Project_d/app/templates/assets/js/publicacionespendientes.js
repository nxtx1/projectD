document.addEventListener('DOMContentLoaded', function() {
  fetch('/vehiculos-pendientes')
    .then(response => {
      if (!response.ok) {
        console.error('Error en la respuesta del servidor:', response.status);
        throw new Error('Respuesta de red no fue ok. Estado HTTP: ' + response.status);
      }
      return response.json();
    })
    .then(vehiculos => {
      const container = document.querySelector('#pending-posts');
      container.innerHTML = '';

      vehiculos.forEach(vehiculo => {
        const detalleVehiculoURL = `/vehiculo/${vehiculo.id_vehiculo}`;
        const fechaPublicacionFormateada = new Date(vehiculo.fecha_publicacion).toLocaleString();

        const vehiculoCard = `
        <div class="col-lg-4 col-md-6 mb-2" id="vehiculo-${vehiculo.id_vehiculo}">
            <div class="rent-item mb-4">
              <img class="img-fluid mb-4" src="data:image/jpeg;base64,${vehiculo.foto}" alt="Foto del vehículo">
              <h4 class="text-uppercase mb-4">${vehiculo.marca} ${vehiculo.modelo}</h4>
              <h4 class="mb-4">${fechaPublicacionFormateada}</h4>
              <div class="d-flex justify-content-center mb-4">
                <!-- Detalles del vehículo -->
              </div>
              <a class="btn btn-primary px-3 mb-3" href="${detalleVehiculoURL}">Vista Previa</a>
              <!-- Botones Aprobar y Rechazar -->
              <div class="d-flex justify-content-center">
                <button onclick="aprobarVehiculo(${vehiculo.id_vehiculo})" class="btn btn-success mx-1">Aprobar</button>
                <button onclick="rechazarVehiculo(${vehiculo.id_vehiculo})" class="btn btn-danger mx-1">Rechazar</button>
              </div>
            </div>
          </div>
        `;

        container.innerHTML += vehiculoCard;
      });
    })
    .catch(error => console.error('Error al cargar los vehículos:', error));
});
function aprobarVehiculo(idVehiculo) {
  fetch(`/aprobar-vehiculo/${idVehiculo}`, { method: 'POST' })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al aprobar el vehículo');
      }
      return response.json();
    })
    .then(data => {
      console.log('Vehículo aprobado:', data);
      // Aquí puedes quitar el vehículo de la lista o actualizar su estado en la interfaz
      document.querySelector(`#vehiculo-${idVehiculo}`).remove();
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function rechazarVehiculo(idVehiculo) {
  fetch(`/rechazar-vehiculo/${idVehiculo}`, { method: 'POST' })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al rechazar el vehículo');
      }
      return response.json();
    })
    .then(data => {
      console.log('Vehículo rechazado:', data);
      // Eliminar el vehículo de la lista en la interfaz
      document.querySelector(`#vehiculo-${idVehiculo}`).remove();
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
