document.addEventListener('DOMContentLoaded', function() {
  const urlParts = window.location.pathname.split('/');
  const vehiculoId = urlParts[urlParts.length - 1];

  fetch(`/api/vehiculos/${vehiculoId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }
    return response.json();
  })
  .then(vehiculo => {
    // Actualiza los elementos de la página con la información del vehículo
    document.getElementById('nombre-vehiculo').textContent = `${vehiculo.marca} ${vehiculo.modelo}`;
    document.getElementById('imagen-vehiculo').src = vehiculo.foto;
    document.getElementById('modelo-vehiculo').textContent = vehiculo.modelo;
    document.getElementById('ano-vehiculo').textContent = vehiculo.ano;
    document.getElementById('transmision-vehiculo').textContent = vehiculo.transmision === 1 ? 'Automático' : 'Manual';
    document.getElementById('kilometraje-vehiculo').textContent = `${vehiculo.kilometraje}`;
    document.getElementById('combustible-vehiculo').textContent = vehiculo.transmision === 1 ? 'Diesel' : 'Gasolina'; // Cambié 'gasolina-vehiculo' por 'combustible-vehiculo'
    document.getElementById('precio-vehiculo').textContent = `$${vehiculo.precio}`;
    document.getElementById('descripcion-vehiculo').textContent = `${vehiculo.descripcion}`;
  })
  .catch(error => {
    console.error('Error al cargar los detalles del vehículo:', error);
  });
});
