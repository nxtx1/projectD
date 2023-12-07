document.addEventListener('DOMContentLoaded', function() {
  const vehiculoId = window.location.pathname.split('/').pop();

  fetch(`/api/vehiculos/${vehiculoId}`)
      .then(response => response.json())
      .then(vehiculo => {
          // Actualiza los detalles del vehículo
          const precioFormateado = formatNumberWithDots(String(vehiculo.precio));
          const kilometrajeFormateado = formatNumberWithDots(String(vehiculo.kilometraje));
          document.getElementById('nombre-vehiculo').textContent = `${vehiculo.ano} ${vehiculo.marca} ${vehiculo.modelo}`;
          document.getElementById('modelo-vehiculo').textContent = vehiculo.modelo;
          document.getElementById('ano-vehiculo').textContent = vehiculo.ano;
          document.getElementById('transmision-vehiculo').textContent = vehiculo.transmision === 1 ? 'Automático' : 'Manual';
          document.getElementById('kilometraje-vehiculo').textContent = `${kilometrajeFormateado} Km`;
          document.getElementById('gasolina-vehiculo').textContent = vehiculo.combustible === 0 ? 'Diesel' : 'Gasolina';
          document.getElementById('precio-vehiculo').textContent = `$${precioFormateado}`;
          document.getElementById('descripcion-vehiculo').textContent = vehiculo.descripcion;
          document.getElementById('numero').textContent = vehiculo.numero;

          const imageContainer = document.querySelector('.image-container');
      const images = []; // Array para almacenar solo las imágenes que cargan correctamente

      vehiculo.imagenes.forEach((imagen, index) => {
        const imgElement = document.createElement('img');
        imgElement.src = imagen;
        imgElement.style.display = 'none'; // Oculta todas las imágenes por defecto
        imgElement.onload = () => {
          if (index === 0) imgElement.style.display = 'block'; // Solo muestra la primera imagen
        };
        imgElement.onerror = () => {
          console.error('Error al cargar la imagen:', imagen); // Informa del error
          imgElement.remove(); // Elimina la imagen que no carga
        };
        imageContainer.appendChild(imgElement);
        images.push(imgElement); // Añade la imagen al array si se carga correctamente
      });

      let currentImageIndex = 0;

      // Función para mostrar la imagen actual basada en el índice
      function showImage(index) {
        images.forEach(img => img.style.display = 'none'); // Oculta todas las imágenes
        images[index].style.display = 'block'; // Muestra la imagen seleccionada
      }

      // Navegación de las imágenes
      document.querySelector('.left-arrow').addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        showImage(currentImageIndex);
      });

      document.querySelector('.right-arrow').addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        showImage(currentImageIndex);
      });
    })
    .catch(error => console.error('Error al cargar los detalles del vehículo:', error));
});