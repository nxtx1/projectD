function generarFechasConHoras(horaInicio, horaFin) {
  const fechasConHoras = [];
  const fechaActual = new Date();
  let diaActual = fechaActual.getDay(); // Día de la semana (0 es domingo, 1 es lunes, etc.)
  let horaActual = fechaActual.getHours();

  // Si es después de horaFin o hoy es domingo, avanza al siguiente día
  if (horaActual >= horaFin || diaActual === 0) {
    fechaActual.setDate(fechaActual.getDate() + (diaActual === 0 ? 1 : 0));
    diaActual = fechaActual.getDay();
  }

  // Ajustar para el próximo día si es necesario
  if (horaActual >= horaFin - 1 || diaActual === 0) {
    fechaActual.setDate(fechaActual.getDate() + 1);
    horaActual = horaInicio;
  } else if (horaActual < horaInicio - 1) {
    horaActual = horaInicio;
  } else {
    horaActual++;
  }

  fechaActual.setHours(horaActual, 0, 0, 0);

  // Establecer la fecha de inicio y fin
  const fechaInicio = new Date(fechaActual);
  const fechaFin = new Date(fechaInicio);
  fechaFin.setDate(fechaFin.getDate() + 13); // Dos semanas después

  // Asegurarse de que no se incluyan los domingos
  for (let dia = fechaInicio; dia <= fechaFin; dia.setDate(dia.getDate() + 1)) {
    if (dia.getDay() !== 0) { // Si no es domingo
      let inicioDeHoras = dia.getDate() === fechaInicio.getDate() ? fechaInicio.getHours() : horaInicio;
      for (let hora = inicioDeHoras; hora <= horaFin; hora++) {
        let fechaHora = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), hora);
        fechasConHoras.push(fechaHora);
      }
    }
  }

  return fechasConHoras;
}



  
  // Esta función formatea la fecha y hora en el formato deseado para mostrarlo en las opciones
  function formatearFechaHora(fechaHora) {
    return fechaHora.toISOString().substring(0, 16).replace('T', ' '); // Formato 'AAAA-MM-DD HH:MM'
  }
  
  // Cargar las fechas con horas en el selector cuando el contenido del DOM esté listo
  document.addEventListener('DOMContentLoaded', () => {
    const selectFechaHora = document.getElementById('fecha_mantencion');
    const fechasConHoras = generarFechasConHoras(5, 14, 1, 14); // de 8 AM a 5 PM, cada hora, desde 2 semanas en adelante
    
    // Limpia las opciones existentes
    selectFechaHora.innerHTML = '';
  
    // Crea y añade las opciones al selector de fechas con horas
    fechasConHoras.forEach((fechaHora) => {
      const opcionTexto = formatearFechaHora(fechaHora);
      const opcion = new Option(opcionTexto, opcionTexto);
      selectFechaHora.add(opcion);
    });
  });