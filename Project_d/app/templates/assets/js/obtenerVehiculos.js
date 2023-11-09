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
      selectVehiculo.add(new Option(vehiculo.descripcion, vehiculo.id_vehiculo));
    });
  } catch (error) {
    console.error('Error al cargar los vehículos:', userId);
  }
});