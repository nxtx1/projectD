document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/vehiculos')
      .then(response => response.json())
      .then(vehiculos => {
        const container = document.querySelector('.row');
        container.innerHTML = '';
  
        vehiculos.forEach(vehiculo => {
          const detalleVehiculoURL = `/vehiculo/${vehiculo.id_vehiculo}`;
  
          const vehiculoHTML = `
            <div class="col-lg-4 col-md-6 mb-2">
              <div class="rent-item mb-4">
                <img class="img-fluid mb-4" src="${vehiculo.imagen ? 'data:image/jpeg;base64,' + vehiculo.imagen : 'ruta_a_imagen_por_defecto.jpg'}" alt="Foto del vehículo">
                <h4 class="text-uppercase mb-4">${vehiculo.marca} ${vehiculo.modelo}</h4>
                <div class="d-flex justify-content-center mb-4">
                  <div class="px-2">
                    <i class="fa fa-car text-primary mr-1"></i>
                    <span>${vehiculo.ano}</span>
                  </div>
                  <div class="px-2 border-left border-right">
                    <i class="fa fa-cogs text-primary mr-1"></i>
                    <span>${vehiculo.transmision === 1 ? 'Automático' : 'Mecánico'}</span>
                  </div>
                  <div class="px-2">
                    <i class="fa fa-road text-primary mr-1"></i>
                    <span>${vehiculo.kilometraje}K</span>
                  </div>
                </div>
                <a class="btn btn-primary px-3" href="${detalleVehiculoURL}">$${vehiculo.precio}</a>
              </div>
            </div>
          `;
  
          container.innerHTML += vehiculoHTML;
        });
      })
      .catch(error => console.error('Error al cargar los vehículos:', error));
  });

  function updateArrowVisibility() {
    var leftArrow = document.querySelector('.left-arrow');
    var rightArrow = document.querySelector('.right-arrow');
    var images = document.querySelectorAll('#images-preview-container img');

    // Solo muestra las flechas si hay 2 o más imágenes cargadas
    if (images.length < 2) {
        if (leftArrow) leftArrow.style.display = 'none';
        if (rightArrow) rightArrow.style.display = 'none';
    } else {
        // Si hay 2 o más imágenes, muestra las flechas
        if (leftArrow) leftArrow.style.display = 'block';
        if (rightArrow) rightArrow.style.display = 'block';
    }
}

// Inicialmente, oculta las flechas hasta que se carguen imágenes
updateArrowVisibility();

      // Event listeners para actualizar la vista previa en tiempo real
      var formularioPublicarVehiculo = document.getElementById('publishVehicleForm');
      var descripcionInput = document.getElementById('descripcion');
      var kilometrajeInput = document.getElementById('kilometraje');
      var precioInput = document.getElementById('precio');
      var combustibleSelect = document.getElementById('combustible');
      var transmisionSelect = document.getElementById('transmision');
      var anoInput = document.getElementById('ano');
      var marcaSelect = document.getElementById('marca-id');
      var modeloSelect = document.getElementById('modelo-id');
      var imagenInput = document.getElementById('vehicle-image');
      var numeroInput = document.getElementById('numero');

      numeroInput.addEventListener('input', function() {
        document.getElementById('preview-numero').textContent = numeroInput.value;
    });
  
      descripcionInput.addEventListener('input', function() {
          document.getElementById('preview-description').textContent = descripcionInput.value;
      });
  
      kilometrajeInput.addEventListener('input', function() {
          document.getElementById('preview-mileage').textContent = kilometrajeInput.value + ' Km';
      });
  
      precioInput.addEventListener('input', function() {
          document.getElementById('preview-price').textContent = '$' + precioInput.value;
      });
  
      combustibleSelect.addEventListener('change', function() {
          document.getElementById('preview-fuel').textContent = combustibleSelect.options[combustibleSelect.selectedIndex].text;
      });
  
      transmisionSelect.addEventListener('change', function() {
          document.getElementById('preview-transmission').textContent = transmisionSelect.options[transmisionSelect.selectedIndex].text;
      });
  
      anoInput.addEventListener('input', function() {
          document.getElementById('preview-year').textContent =  anoInput.value;
    });
  
      marcaSelect.addEventListener('change', function() {
          document.getElementById('preview-title').textContent =  marcaSelect.options[marcaSelect.selectedIndex].text;
      });

      modeloSelect.addEventListener('change', function() {
        document.getElementById('preview-model').textContent = modeloSelect.options[modeloSelect.selectedIndex].text;
      });
  
      function actualizarTituloVistaPrevia() {
        var ano = anoInput.value;
        var marca = marcaSelect.options[marcaSelect.selectedIndex].text;
        var modelo = modeloSelect.options[modeloSelect.selectedIndex].text;

        var titulo = '';
        if (ano) {
            titulo += ano + ' ';
        }
        titulo += marca + ' ' + modelo;

        document.getElementById('preview-title').textContent = titulo;
    }

    modeloSelect.addEventListener('change', actualizarTituloVistaPrevia);
    modeloSelect.addEventListener('input', actualizarTituloVistaPrevia);
    anoInput.addEventListener('input', actualizarTituloVistaPrevia);
    
    imagenInput.addEventListener('change', function(event) {
      var files = event.target.files;
      if (files.length > 0) {
          var reader = new FileReader();
          reader.onload = function(e) {
              lastSelectedImageSrc = e.target.result; // Guarda la última imagen seleccionada
              document.getElementById('preview-image').src = lastSelectedImageSrc;
              document.getElementById('preview-image').style.display = 'block';
          };
          reader.readAsDataURL(files[0]);
      } else {
          document.getElementById('preview-image').src = '';
          document.getElementById('preview-image').style.display = 'none';
      }
  });

      formularioPublicarVehiculo.addEventListener('submit', function(event) {
        event.preventDefault();

        Swal.fire("Tu publicación ha sido creada y está pendiente de aprobación.",
        ).then(result => {
            if (result.isConfirmed) {
                // Limpia los campos del formulario
                formularioPublicarVehiculo.reset();
                document.getElementById('preview-description').textContent = '';
                document.getElementById('preview-mileage').textContent = '';
                document.getElementById('preview-price').textContent = '';
                document.getElementById('preview-fuel').textContent = '';
                document.getElementById('preview-transmission').textContent = '';
                document.getElementById('preview-year').textContent = '';
                document.getElementById('preview-title').textContent = '';
                document.getElementById('preview-model').textContent = '';
                document.getElementById('preview-numero').textContent = '';
                combustibleSelect.selectedIndex = 0;
                transmisionSelect.selectedIndex = 0;
                marcaSelect.selectedIndex = 0;
                modeloSelect.selectedIndex = 0;
                var previewContainer = document.getElementById('images-preview-container');
                previewContainer.innerHTML = '';
                var imageElement = document.getElementById('preview-image');
                imageElement.src = '';
            }
        });
      });

      var lastSelectedImageSrc = ''; // Variable para mantener la última imagen seleccionada

function handleImageUpload(event) {
        var files = event.target.files;
        var previewContainer = document.getElementById('images-preview-container');
        var existingImages = previewContainer.querySelectorAll('.image-preview-item').length;
        var maxImages = 4; // Límite de 4 imágenes
    
        // Si la cantidad de imágenes existentes más las nuevas supera el máximo permitido, muestra una alerta.
        if (existingImages + files.length > maxImages) {
            alert('Solo puedes subir un máximo de 4 imágenes.');
            // No limpia el input de archivo para mantener la selección previa
            return; // Detiene la ejecución adicional de la función
        }
    
        // Procesa cada archivo seleccionado, siempre que no se exceda el número máximo de imágenes
        Array.from(files).forEach((file, index) => {
            if (existingImages + index < maxImages) {
                var reader = new FileReader();
    
                reader.onload = function(e) {
                    var previewElement = document.createElement('div');
                    previewElement.classList.add('image-preview-item');
    
                    var img = document.createElement('img');
                    img.src = e.target.result;
    
                    var closeButton = document.createElement('button');
                    closeButton.innerText = 'X';
                    closeButton.classList.add('close-button');
                    closeButton.onclick = function() {
                        previewElement.remove(); // Elimina la vista previa de la imagen
                        updateArrowVisibility(); // Actualiza la visibilidad de las flechas
    
                        // Actualiza la imagen principal si se eliminó la imagen que se estaba mostrando
                        var remainingImages = previewContainer.querySelectorAll('.image-preview-item img');
                        if (remainingImages.length > 0 && document.getElementById('preview-image').src === img.src) {
                            document.getElementById('preview-image').src = remainingImages[0].src;
                        } else if (remainingImages.length === 0) {
                            document.getElementById('preview-image').src = ''; // Limpia la imagen principal si no quedan imágenes
                        }
                    };
                    previewElement.appendChild(closeButton);
                    previewElement.appendChild(img);
                    previewContainer.appendChild(previewElement);
                    updateArrowVisibility(); // También actualiza la visibilidad de las flechas después de añadir una nueva imagen
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    
      function navigate(direction) {
        // Suponiendo que tienes un array de imágenes cargadas o una lista de elementos img
        var images = document.querySelectorAll('.image-preview-item img');
        var previewImage = document.getElementById('preview-image');
        var currentIndex = Array.from(images).indexOf(document.querySelector('.image-preview-item img[src="' + previewImage.src + '"]'));
    
        if (direction === 'prev') {
            currentIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
        } else {
            currentIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
        }
    
        previewImage.src = images[currentIndex].src;
    }
