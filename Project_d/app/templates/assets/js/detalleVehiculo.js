document.addEventListener('DOMContentLoaded', function() {
  // Obtener el ID del vehículo de la URL
  const vehiculoId = window.location.pathname.split('/').pop();

  fetch(`/api/vehiculos/${vehiculoId}`)
    .then(response => response.json())
    .then(vehiculo => {
      // Formatear el precio y el kilometraje
      const precioFormateado = formatNumberWithDots(String(vehiculo.precio));
      const kilometrajeFormateado = formatNumberWithDots(String(vehiculo.kilometraje));

      // Ahora actualiza los elementos de tu página con la información del vehículo
      document.getElementById('nombre-vehiculo').textContent = `${vehiculo.ano} ${vehiculo.marca} ${vehiculo.modelo}`;
      document.getElementById('imagen-vehiculo').src = vehiculo.foto;
      document.getElementById('imagen-vehiculo').classList.add('sombreado');
      document.getElementById('modelo-vehiculo').textContent = vehiculo.modelo;
      document.getElementById('ano-vehiculo').textContent = vehiculo.ano;
      document.getElementById('transmision-vehiculo').textContent = vehiculo.transmision === 1 ? 'Automático' : 'Manual';
      document.getElementById('kilometraje-vehiculo').textContent = `${kilometrajeFormateado} Km`;
      document.getElementById('gasolina-vehiculo').textContent = vehiculo.combustible === 0 ? 'Diesel' : 'Gasolina';
      document.getElementById('precio-vehiculo').textContent = `$${precioFormateado}`;
      document.getElementById('descripcion-vehiculo').textContent = `${vehiculo.descripcion}`;
      document.getElementById('numero').textContent = `${vehiculo.numero}`;
    })
    .catch(error => {
      console.error('Error al cargar los detalles del vehículo:', error);
    });
});
