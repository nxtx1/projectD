document.addEventListener('DOMContentLoaded', function() {
  fetch('/api/fechas')
      .then(response => response.json())
      .then(fechasConHoras => {
          let select = document.getElementById('fecha_mantencion');
          fechasConHoras.forEach(fecha => {
              let option = document.createElement('option');
              option.textContent = fecha.paraMostrar; // Mostrar en el formato DD-MM-YYYY HH:mm
              option.value = fecha.paraBaseDatos; // Valor en el formato YYYY-MM-DD HH:mm para la base de datos
              select.appendChild(option);
          });
      })
      .catch(error => console.error('Error:', error));
});