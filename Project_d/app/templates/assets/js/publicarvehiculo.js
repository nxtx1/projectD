document.addEventListener('DOMContentLoaded', function() {
    // Funciones para cargar marcas y modelos (añadidas)
    async function cargarMarcas() {
        const response = await fetch('/marcas');
        const marcas = await response.json();
        let options = '<option value="">Seleccione una marca</option>';
        marcas.forEach(marca => {
            options += `<option value="${marca.id_marca}">${marca.marca}</option>`;
        });
        document.getElementById('marca-id').innerHTML = options;
    }

    document.getElementById('ano').addEventListener('input', function (e) {
        var value = e.target.value;
        if (value.length > 4) {
            e.target.value = value.slice(0, 4);
        }
    });
    

    async function cargarModelos(marcaId) {
        const response = await fetch(`/modelos/${marcaId}`);
        const modelos = await response.json();
        let options = '<option value="">Seleccione un modelo</option>';
        modelos.forEach(modelo => {
            options += `<option value="${modelo.id_modelo}">${modelo.modelo}</option>`;
        });
        document.getElementById('modelo-id').innerHTML = options;
    }

    // Función para cargar regiones
    async function cargarRegiones() {
        const response = await fetch('/regiones');
        const regiones = await response.json();
        let options = '<option value="">Seleccione una región</option>';
        regiones.forEach(region => {
            options += `<option value="${region.id_region}">${region.region}</option>`;
        });
        document.getElementById('region-id').innerHTML = options;
    }

    // Función para cargar comunas
    async function cargarComunas(regionId) {
        const response = await fetch(`/comunas/${regionId}`);
        const comunas = await response.json();
        let options = '<option value="">Seleccione una comuna</option>';
        comunas.forEach(comuna => {
            options += `<option value="${comuna.id_comuna}">${comuna.comuna}</option>`;
        });
        document.getElementById('comuna-id').innerHTML = options;
    }

    // Event listeners para cambio de marca y región
    document.getElementById('marca-id').addEventListener('change', function() {
        const marcaId = this.value;
        cargarModelos(marcaId);
    });

    document.getElementById('region-id').addEventListener('change', function() {
        const regionId = this.value;
        cargarComunas(regionId);
    });

    // Llamadas iniciales para cargar marcas y regiones
    cargarMarcas();
    cargarRegiones();

    // Función para manejar el envío del formulario
    // Función para manejar el envío del formulario
async function enviarFormulario(event) {
    event.preventDefault(); // Evita el envío predeterminado del formulario

    // Usa FormData para construir los datos del formulario
    const formData = new FormData();
    formData.append('descripcion', document.getElementById('descripcion').value);
    formData.append('numero', document.getElementById('numero').value);
    formData.append('kilometraje', document.getElementById('kilometraje').value);
    formData.append('precio', document.getElementById('precio').value);
    formData.append('combustible', document.getElementById('combustible').value);
    formData.append('transmision', document.getElementById('transmision').value);
    formData.append('ano', document.getElementById('ano').value);
    formData.append('modelo_id_modelo', document.getElementById('modelo-id').value);
    formData.append('comuna_id_comuna', document.getElementById('comuna-id').value);
    
    // Agrega la imagen
    const imageInputs = document.getElementById('vehicle-image').files;
    for (let i = 0; i < imageInputs.length; i++) {
        formData.append('vehicleImages', imageInputs[i]);
    }

    try {
        const response = await fetch('/create-post', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Resultado:', result);
            
            // Mostrar mensaje al usuario
            alert('Tu publicación ha sido creada y está pendiente de aprobación.');

        window.location.href = '/home.html';
        } else {
            const errorResult = await response.json();
            console.error('Error al enviar formulario:', errorResult);
            alert('Hubo un error al enviar la publicación. Por favor, inténtalo de nuevo.');
        }
    } catch (error) {
        console.error('Error de red o del servidor:', error);
    }
}

// Agrega el event listener para el envío del formulario
const form = document.getElementById('publishVehicleForm');
form.addEventListener('submit', enviarFormulario);

});

