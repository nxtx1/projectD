document.addEventListener('DOMContentLoaded', function() {
  // Obtener el ID del vehículo de la URL
  const vehiculoId = window.location.pathname.split('/').pop();

  fetch(`/api/vehiculos/${vehiculoId}`)
    .then(response => response.json())
    .then(vehiculo => {
      // Ahora actualiza los elementos de tu página con la información del vehículo
      document.getElementById('nombre-vehiculo').textContent = `${vehiculo.marca} ${vehiculo.modelo}`;
      document.getElementById('imagen-vehiculo').src = vehiculo.foto;
      document.getElementById('modelo-vehiculo').textContent = vehiculo.modelo;
      document.getElementById('ano-vehiculo').textContent = vehiculo.ano;
      document.getElementById('transmision-vehiculo').textContent = vehiculo.transmision === 1 ? 'Automático' : 'Mecánico';
      document.getElementById('kilometraje-vehiculo').textContent = `${vehiculo.kilometraje}`;
      document.getElementById('gasolina-vehiculo').textContent = vehiculo.transmision === 1 ? 'Diesel' : 'Gasolina';
      document.getElementById('precio-vehiculo').textContent = `$${vehiculo.precio}`;
      document.getElementById('descripcion-vehiculo').textContent = `${vehiculo.descripcion}`;
    })
    .catch(error => {
      console.error('Error al cargar los detalles del vehículo:', error);
    });
});

