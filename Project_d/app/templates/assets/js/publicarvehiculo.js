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
    async function enviarFormulario(event) {
        event.preventDefault(); // Evita el envío predeterminado del formulario
    
        // Obten los valores del formulario, incluyendo los nuevos campos
        const descripcion = document.getElementById('descripcion').value;
        const kilometraje = document.getElementById('kilometraje').value;
        const precio = document.getElementById('precio').value;
        const combustible = document.getElementById('combustible').value; // Asumimos que existe un input con id 'combustible'
        const transmision = document.getElementById('transmision').value; // Asumimos que existe un input con id 'transmision'
        const ano = document.getElementById('ano').value;
        const modeloId = document.getElementById('modelo-id').value; // Asegúrate de que este campo existe y se esté llenando correctamente
        const comunaId = document.getElementById('comuna-id').value; // Asegúrate de que este campo existe y se esté llenando correctamente
    
        // Objeto con los datos del formulario
        const vehiculoData = {
            descripcion,
            kilometraje,
            precio,
            combustible, // Agregado al objeto de datos
            transmision, // Agregado al objeto de datos
            ano, 
            modelo_id_modelo: modeloId, // Asegúrate de que este valor se está enviando correctamente
            comuna_id_comuna: comunaId // Asegúrate de que este valor se está enviando correctamente
        };
    
        try {
            // Realizar la solicitud POST al servidor
            const response = await fetch('/create-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(vehiculoData) // Convertir los datos a una cadena JSON
            });
    
            // Verificar si el envío fue exitoso
            if (response.ok) {
                const result = await response.json();
                console.log('Resultado:', result);
                // Aquí podrías redirigir al usuario o mostrar un mensaje de éxito
            } else {
                // Manejar errores si la respuesta no fue exitosa
                const errorResult = await response.json();
                console.error('Error al enviar formulario:', errorResult);
            }
        } catch (error) {
            // Capturar errores de red o del servidor
            console.error('Error de red o del servidor:', error);
        }
    }

    // Agrega el event listener para el envío del formulario
    const form = document.getElementById('publishVehicleForm'); // Corregido para usar el ID correcto del formulario
    form.addEventListener('submit', enviarFormulario);
});

