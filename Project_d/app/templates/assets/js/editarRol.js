document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/rol')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(rol => {
        const tabla = document.getElementById('tabla-rol').getElementsByTagName('tbody')[0];
        rol.forEach(usuario => {
          console.log('Agregando rol:', rol);
          let fila = tabla.insertRow();
          fila.insertCell().textContent = usuario.id_usuario;
          fila.insertCell().textContent = usuario.nombre_usuario;
          fila.insertCell().textContent = usuario.correo;
          var cell = fila.insertCell(); 
            // Verifica el valor de usuario.rol y asigna el texto correspondiente
            if (usuario.rol === 0) {
                cell.textContent = "Usuario";
            } else if (usuario.rol === 1) {
                cell.textContent = "Mecánico";
            } else if (usuario.rol === 2) {
                cell.textContent = "Administrador";
            } else {
                cell.textContent = "Rol no definido"; // En caso de que usuario.rol no sea 0, 1 o 2
            }
            
          let celdaAcciones = fila.insertCell();
          let botonEditar = document.createElement('button');
          botonEditar.textContent = 'Cambiar Rol';
          botonEditar.onclick = function() {
            try {
              abrirModalCambioEstado(usuario.id_usuario);
            } catch (error) {
              console.error('Error al abrir el modal:', error);
            }
          };
          
          celdaAcciones.appendChild(botonEditar);
        });
      })
      .catch(error => console.error('Error al cargar las mantenciones:', error));
  });
  
  function abrirModalCambioEstado(idUsuario) {
    try {
      const modal = document.getElementById('modalCambioRol');
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
        const nuevoEstado = document.getElementById('estadoRol').value;
        actualizarEstadoRol(idUsuario, nuevoEstado);
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
  
  function actualizarEstadoRol(idUsuario, nuevoEstado) {
    fetch(`/api/roles/${idUsuario}/cambiar-estado`, {
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
      document.getElementById('modalCambioRol').style.display = "none";
      location.reload();
    })
    .catch(error => {
      console.error('Error en actualizarEstadoMantencion:', error);
      alert('No se pudo cambiar el estado');
    });
  }