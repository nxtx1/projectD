document.addEventListener('DOMContentLoaded', function() {
  const urlParts = window.location.pathname.split('/');
  const vehiculoId = urlParts[urlParts.length - 1]; // Obtiene el ID del vehículo de la URL

  // Asegúrate de que la ruta aquí coincide con la que devuelve los datos del vehículo en tu servidor
  fetch(`/api/vehiculos/${vehiculoId}`, { 
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Usa el token guardado en localStorage
      }
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Error al cargar los detalles del vehículo');
      }
      return response.json();
  })
  .then(vehiculo => {
      // Asegúrate de que los IDs de los elementos HTML coinciden con estos
      document.getElementById('nombre-vehiculo').textContent = `${vehiculo.ano} ${vehiculo.marca} ${vehiculo.modelo}`;
      document.getElementById('imagen-vehiculo').src = vehiculo.foto;
      document.getElementById('imagen-vehiculo').classList.add('sombreado');
      document.getElementById('modelo-vehiculo').textContent = vehiculo.modelo;
      document.getElementById('ano-vehiculo').textContent = vehiculo.ano;
      document.getElementById('transmision-vehiculo').textContent = vehiculo.transmision === 1 ? 'Automático' : 'Manual';
      document.getElementById('kilometraje-vehiculo').textContent = `${vehiculo.kilometraje}`;
      document.getElementById('gasolina-vehiculo').textContent = vehiculo.transmision === 1 ? 'Diesel' : 'Gasolina';
      document.getElementById('precio-vehiculo').textContent = `$${vehiculo.precio}`;
      document.getElementById('descripcion-vehiculo').textContent = `${vehiculo.descripcion}`;
  })
  .catch(error => {
      console.error('Error:', error);
      // Aquí podrías manejar el error, tal vez mostrando un mensaje al usuario
  });
});
