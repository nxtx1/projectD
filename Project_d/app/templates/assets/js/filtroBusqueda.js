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
        console.log('Marcas cargadas:', marcas); // Nuevo
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
  function cargarAnosPorModelo(modeloId) {
    fetch(`/api/anos/${modeloId}`)
        .then(response => response.json())
        .then(anos => {
            const anoSelect = document.getElementsByName('ano')[0];
            anoSelect.innerHTML = '<option value="">Selecciona Año</option>';
            anos.forEach(ano => {
                // Asegúrate de usar ano.ano si esa es la estructura de tus objetos
                anoSelect.add(new Option(ano.ano, ano.ano));
            });
        })
        .catch(error => console.error('Error al cargar años:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('filtroVehiculos');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir el comportamiento por defecto de recargar la página

        const marca = document.getElementsByName('marca')[0].value;
        const modelo = document.getElementsByName('modelo')[0].value;
        const ano = document.getElementsByName('ano')[0].value;
        
        buscarVehiculos(marca, modelo, ano);
    });

    // Cargar todos los vehículos inicialmente
    buscarVehiculos();
});

function buscarVehiculos(marca = '', modelo = '', ano = '') {
    // Construye la URL con los parámetros de búsqueda
    let url = '/api/buscarVehiculos?';
    url += `marca=${marca}&modelo=${modelo}&ano=${ano}`;

    // Realiza la solicitud al servidor
    fetch(url)
        .then(response => response.json())
        .then(vehiculos => {
            const container = document.querySelector('.row');
            container.innerHTML = ''; // Limpiar resultados anteriores

            // Procesa los resultados y los añade al DOM
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
        .catch(error => console.error('Error al buscar vehículos:', error));
}
