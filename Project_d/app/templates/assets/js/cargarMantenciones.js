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
        fila.setAttribute('eliminarMan', mantencion.id_mantencion);
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

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

function eliminarMantencion(idMantencion) {
  console.log(`Solicitando eliminación de la mantención ID ${idMantencion}`);

  Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminarlo!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
          fetch(`/eliminar-mantencion/${idMantencion}`, { method: 'DELETE' })
              .then(response => {
                  if (!response.ok) {
                      throw new Error(`HTTP error! status: ${response.status}`);
                  }
                  return response.json();
              })
              .then(result => {
                  try {
                      const filaParaEliminar = document.querySelector(`[eliminarMan="${idMantencion}"]`);
                      if (filaParaEliminar) {
                          filaParaEliminar.remove();
                          Toast.fire({
                            icon: 'success',
                            title: 'La mantención ha sido eliminada'
                        });
                      } else {
                          console.error('No se encontró la fila para eliminar');
                      }
                  } catch (error) {
                      console.error('Error al eliminar la fila del DOM:', error);
                  }
              })
              .catch(error => {
                  console.error('Error al eliminar la mantención:', error);
                  Swal.fire('Error!', 'No se pudo eliminar la mantención.', 'error');
              });
      }
  });
}