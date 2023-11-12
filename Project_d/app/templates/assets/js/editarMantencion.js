document.addEventListener('DOMContentLoaded', function() {
  fetch('/api/mantenciones')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(mantenciones => {
      const tabla = document.getElementById('tabla-mantenciones').getElementsByTagName('tbody')[0];
      mantenciones.forEach(mantencion => {
        console.log('Agregando mantención:', mantencion);
        let fila = tabla.insertRow();
        fila.insertCell().textContent = mantencion.id_mantencion;
        fila.insertCell().textContent = new Date(mantencion.fecha_mantencion).toLocaleString();
        fila.insertCell().textContent = mantencion.nombre_usuario; // Asumiendo que tienes el nombre del usuario
        fila.insertCell().textContent = mantencion.marca; // Asumiendo que tienes el nombre del vehículo
        fila.insertCell().textContent = mantencion.modelo; // Asumiendo que tienes el nombre del vehículo
        fila.insertCell().textContent = mantencion.estado;

        let celdaAcciones = fila.insertCell();
        let botonEditar = document.createElement('button');
        botonEditar.textContent = 'Cambiar Estado';
        botonEditar.onclick = function() {
          try {
            abrirModalCambioEstado(mantencion.id_mantencion);
          } catch (error) {
            console.error('Error al abrir el modal:', error);
          }
        };
        
        celdaAcciones.appendChild(botonEditar);
      });
    })
    .catch(error => console.error('Error al cargar las mantenciones:', error));
});

function abrirModalCambioEstado(idMantencion) {
  try {
    const modal = document.getElementById('modalCambioEstado');
    const span = document.querySelector('.close'); // Usar querySelector que es más específico
    const guardar = document.getElementById("guardarEstado");

    if (!modal) throw new Error('El modal no se encontró en el DOM');
    if (!span) throw new Error('El botón de cerrar no se encontró en el DOM');
    if (!guardar) throw new Error('El botón de guardar no se encontró en el DOM');
    
    modal.style.display = "block";

    span.onclick = function() {
      modal.style.display = "none";
    };

    guardar.onclick = function() {
      const nuevoEstado = document.getElementById('estadoMantencion').value;
      actualizarEstadoMantencion(idMantencion, nuevoEstado);
    };

    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  } catch (error) {
    console.error('Error en abrirModalCambioEstado:', error);
  }
}

function actualizarEstadoMantencion(idMantencion, nuevoEstado) {
  fetch(`/api/mantenciones/${idMantencion}/cambiar-estado`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Aquí deberías incluir también las credenciales de autenticación, como un token JWT
    },
    body: JSON.stringify({ estado: nuevoEstado })
  })
  .then(response => {
    if (!response.ok) throw new Error('Error al cambiar estado');
    return response.text();
  })
  .then(mensaje => {
    alert(mensaje);
    document.getElementById('modalCambioEstado').style.display = "none";
    location.reload();
  })
  .catch(error => {
    console.error('Error en actualizarEstadoMantencion:', error);
    alert('No se pudo cambiar el estado');
  });
}