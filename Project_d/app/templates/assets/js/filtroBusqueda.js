document.addEventListener('DOMContentLoaded', function() {

    const marcaSelect = document.getElementsByName('marca')[0];
    const modeloSelect = document.getElementsByName('modelo')[0];
    const anoSelect = document.getElementsByName('ano')[0];
  
    // Evento para cambio en selección de marca
    marcaSelect.addEventListener('change', function() {
        cargarModelosPorMarca(this.value);
        modeloSelect.innerHTML = '<option value="">Selecciona Modelo</option>'; // Reset
        anoSelect.innerHTML = '<option value="">Selecciona Año</option>'; // Reset
    });

    // Evento para cambio en selección de modelo
    modeloSelect.addEventListener('change', function() {
        cargarAnosPorModelo(this.value);
        anoSelect.innerHTML = '<option value="">Selecciona Año</option>'; // Reset
    });

    // Cargar marcas inicialmente
    cargarMarcas();
});

  function cargarMarcas() {
    fetch('/api/marcas')
      .then(response => response.json())
      .then(marcas => {
        const marcaSelect = document.getElementsByName('marca')[0];
        marcaSelect.innerHTML = '<option value="">Selecciona Marca</option>';
        marcas.forEach(marca => {
          marcaSelect.add(new Option(marca.nombre, marca.id));
        });
      })
      .catch(error => console.error('Error al cargar marcas:', error));
  }
  
  function cargarModelosPorMarca(marcaId) {
    fetch(`/api/modelos/${marcaId}`)
      .then(response => response.json())
      .then(modelos => {
        console.log('Modelos cargados para marca', marcaId, ':', modelos); // Nuevo
        const modeloSelect = document.getElementsByName('modelo')[0];
        modeloSelect.innerHTML = '<option value="">Selecciona Modelo</option>';
        modelos.forEach(modelo => {
          modeloSelect.add(new Option(modelo.modelo, modelo.id_modelo)); // Usar 'modelo.modelo' y 'modelo.id_modelo'
        });
      })
      .catch(error => console.error('Error al cargar modelos:', error));
  }
  
  // Asegúrate de que esta función esté definida y se ejecute cuando se cambia el modelo

document.addEventListener('DOMContentLoaded', function() {
  var filterHeaders = document.querySelectorAll('.filter-header');

  filterHeaders.forEach(function(header) {
    header.addEventListener('click', function() {
      // Toggle la clase 'active' para el header
      this.classList.toggle('active');
      // Muestra u oculta el siguiente elemento .filter-dropdown
      var dropdown = this.nextElementSibling;
      if (dropdown.style.display === 'flex') {
        dropdown.style.display = 'none';
      } else {
        dropdown.style.display = 'flex';
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('filtroVehiculos');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir el comportamiento por defecto de recargar la página

        const marca = document.getElementsByName('marca')[0].value;
        const modelo = document.getElementsByName('modelo')[0].value;
        
        buscarVehiculos(marca, modelo);
    });

    // Cargar todos los vehículos inicialmente
    buscarVehiculos();
});


function buscarVehiculos() {
  const marca = document.getElementsByName('marca')[0].value;
  const modelo = document.getElementsByName('modelo')[0].value;
  const anoInicio = document.getElementsByName('anoInicio')[0].value;
  const anoFin = document.getElementsByName('anoFin')[0].value;
  const precioMin = document.getElementsByName('precioMin')[0].value;
  const precioMax = document.getElementsByName('precioMax')[0].value;
  const transmision = document.getElementsByName('transmision')[0].value;
  const combustible = document.getElementsByName('combustible')[0].value;
  const kilometrajeMin = document.getElementsByName('kilometrajeMin')[0].value;
  const kilometrajeMax = document.getElementsByName('kilometrajeMax')[0].value;

  let url = '/api/buscarVehiculos?';
  url += `marca=${marca}&modelo=${modelo}&anoInicio=${anoInicio}&anoFin=${anoFin}`;
  url += `&precioMin=${precioMin}&precioMax=${precioMax}&transmision=${transmision}`;
  url += `&combustible=${combustible}&kilometrajeMin=${kilometrajeMin}&kilometrajeMax=${kilometrajeMax}`;
fetch(url)
    .then(response => response.json())
    .then(vehiculos => {
      const container = document.querySelector('.row');
      container.innerHTML = ''; // Limpiar resultados anteriores

      vehiculos.forEach(vehiculo => {
        // Formatear el precio y el kilometraje
                const precioFormateado = formatNumberWithDots(String(vehiculo.precio));
                const kilometrajeFormateado = formatNumberWithDots(String(vehiculo.kilometraje));
                const detalleVehiculoURL = `/vehiculo/${vehiculo.id_vehiculo}`;
              
                let distintivoMantenimiento = '';
                if (vehiculo.estado === 'completado') {
                  distintivoMantenimiento = '<div class="text-center mantenimiento-completado">✔ Mantenimiento Completado</div>';
                }
              
                const vehiculoHTML = `
                <div class="col-lg-4 col-md-6 mb-2">
                  <div class="rent-item mb-4">
                    <img class="img-fluid mb-4" src="data:image/jpeg;base64,${vehiculo.foto}" alt="Foto del vehículo">
                    ${distintivoMantenimiento}  <!-- El distintivo se muestra debajo de la imagen -->
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
                            <span>${kilometrajeFormateado}K</span>
                        </div>
                    </div>
                    <a class="btn btn-primary px-3" href="${detalleVehiculoURL}">$${precioFormateado}</a>
                  </div>
                </div>
              `;
              container.innerHTML += vehiculoHTML;
            });
          })
          .catch(error => console.error('Error al buscar vehículos:', error));
      }