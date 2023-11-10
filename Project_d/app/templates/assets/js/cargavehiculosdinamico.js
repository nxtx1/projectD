document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/vehiculos')
      .then(response => response.json())
      .then(vehiculos => {
        const container = document.querySelector('.row');
        container.innerHTML = '';
  
        vehiculos.forEach(vehiculo => {
          // Asumiendo que tienes una página que muestra los detalles para cada vehículo
          // y que utiliza el ID del vehículo en la URL (por ejemplo, /vehiculo/1)
          const detalleVehiculoURL = `/vehiculo/${vehiculo.id_vehiculo}`;
  
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
        });
      })
      .catch(error => console.error('Error al cargar los vehículos:', error));
  });
  