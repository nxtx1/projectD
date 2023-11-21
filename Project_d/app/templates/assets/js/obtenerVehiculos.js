// Esperar a que el contenido del DOM se cargue antes de realizar acciones
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Realizar una solicitud GET para obtener los vehículos
    const response = await fetch('/obtener-vehiculos', {
      method: 'GET',
      credentials: 'include' // Necesario para incluir las cookies (que podrían contener el token JWT)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const vehiculos = await response.json();
    // Obtener la referencia del select en el formulario
    const selectVehiculo = document.getElementById('vehiculo_id_vehiculo');

    // Limpiar las opciones existentes
    selectVehiculo.innerHTML = '';

    // Añadir una opción por defecto
    selectVehiculo.add(new Option('Seleccione su vehículo', ''));

    // Iterar sobre los vehículos y añadirlos como opciones al select
    vehiculos.forEach(vehiculo => {
      const textoOpcion = vehiculo.marca + ' ' + vehiculo.modelo + ' ' + vehiculo.ano;
  
      // Crea una nueva opción con el texto combinado y el id del vehículo
      selectVehiculo.add(new Option(textoOpcion, vehiculo.id_vehiculo));
    });
  } catch (error) {
    console.error('Error al cargar los vehículos:', userId);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const mantencionForm = document.getElementById('mantencionForm');
  if (mantencionForm) {
      mantencionForm.addEventListener('submit', async (e) => {
          e.preventDefault();

          // Recopilar los datos del formulario
          const formData = new FormData(mantencionForm);
          const fechaMantencion = formData.get('fecha_mantencion');
          const vehiculoId = formData.get('vehiculo_id_vehiculo');

          try {
              // Realizar la solicitud POST al servidor
              const response = await fetch('/crear-mantencion', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      // Asegúrate de agregar aquí el token si es necesario
                  },
                  body: JSON.stringify({
                      fecha_mantencion: fechaMantencion,
                      vehiculo_id_vehiculo: vehiculoId
                  })
              });

              const data = await response.json();

              // Mostrar la alerta basada en la respuesta
              if (response.ok) {
                  Swal.fire({
                      icon: 'success',
                      title: '¡Éxito!',
                      text: data.message
                  }).then(() => {
                      window.location.href = '/mantencionesUsuario.html'; // Redirige después de la alerta
                  });
              } else {
                  Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: data.message
                  });
              }
          } catch (error) {
              // Manejar errores de conexión, etc.
              Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'No se pudo conectar con el servidor'
              });
          }
      });
  }
});

