document.addEventListener('DOMContentLoaded', function() {
    console.log('Cargando mantenciones...');
    fetch('/mis-mantenciones')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('Respuesta recibida del servidor.');
        return response.json();
      })
      .then(mantenciones => {
        console.log('Procesando mantenciones recibidas:', mantenciones);
        const tabla = document.getElementById('tablaMantenciones').getElementsByTagName('tbody')[0];
        mantenciones.forEach((mantencion) => {
          const fila = tabla.insertRow();
          fila.insertCell().textContent = mantencion.id_mantencion;
          fila.insertCell().textContent = new Date(mantencion.fecha_mantencion).toLocaleString();
          fila.insertCell().textContent = mantencion.marca + '  ' + mantencion.modelo;
          fila.insertCell().innerHTML = `
            <button class="btn btn-danger btn-sm" onclick="eliminarMantencion(${mantencion.id_mantencion})">Eliminar</button>
          `;
        });
      })
      .catch(error => {
        console.error('Error al cargar las mantenciones:', error);
      });
  });
  
  function eliminarMantencion(idMantencion) {
    console.log(`Solicitando eliminación de la mantención ID ${idMantencion}`);
    if (confirm('¿Estás seguro de que quieres eliminar esta mantención?')) {
      fetch(`/eliminar-mantencion/${idMantencion}`, { method: 'DELETE' })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          console.log('Mantención eliminada en el servidor.');
          return response.json();
        })
        .then(result => {
          console.log('Respuesta del servidor tras eliminación:', result);
          alert('Mantención eliminada con éxito.');
          location.reload();
        })
        .catch(error => {
          console.error('Error al eliminar la mantención:', error);
          alert('No se pudo eliminar la mantención.');
        });
    }
  }
  