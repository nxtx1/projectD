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
                <img class="img-fluid mb-4" src="data:image/jpeg;base64,${vehiculo.foto}" alt="Foto del vehículo">
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
          var reader = new FileReader();
          reader.onload = function(e) {
              document.getElementById('preview-image').src = e.target.result;
              document.getElementById('preview-image').style.display = 'block';
          };
          reader.readAsDataURL(event.target.files[0]);
      });

      formularioPublicarVehiculo.addEventListener('submit', function(event) {
        event.preventDefault();

        Swal.fire("Tu vehículo ha sido publicado con éxito!",
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

      function handleImageUpload(event) {
        var files = event.target.files;
        var previewContainer = document.getElementById('images-preview-container');
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
    
            reader.onload = (function(f, reader) {
                return function(e) {
                    var previewElement = document.createElement('div');
                    previewElement.classList.add('image-preview-item');
                    
                    var img = document.createElement('img');
                    img.src = e.target.result;
    
                    previewElement.appendChild(img);
                    previewContainer.appendChild(previewElement);
                };
            })(file, reader);
    
            reader.readAsDataURL(file);
        }
    }