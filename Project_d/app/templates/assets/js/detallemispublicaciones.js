let vehiculoId; // Declaración de la variable global

document.addEventListener('DOMContentLoaded', function() {
    const urlParts = window.location.pathname.split('/');
    vehiculoId = urlParts[urlParts.length - 1]; // Asigna el valor a la variable global vehiculoId

    fetch(`/api/vehiculos/${vehiculoId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar los detalles del vehículo');
        }
        return response.json();
    })
    .then(vehiculo => {
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

function eliminarVehiculo() {
    if (!confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
        return;
    }

    fetch(`/api/vehiculos/${vehiculoId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar el vehículo');
        }
        return response.json();
    })
    .then(data => {
        alert('Publicación eliminada correctamente.');
        window.location.href = '/Mis_publicaciones.html';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('No se pudo eliminar la publicación.');
    });
}
