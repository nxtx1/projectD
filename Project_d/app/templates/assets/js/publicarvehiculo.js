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

        // Aquí asumo que los ID de los inputs existen y son correctos
        // Obten los valores del formulario
        const color = document.getElementById('color').value;
        // ...obtener otros valores...

        const comunaId = document.getElementById('comuna-id').value; // Obtén el ID de la comuna seleccionada

        // Objeto con los datos del formulario
        const vehiculoData = {
            color, 
            descripcion,
            kilometraje,
            precio,
            version, 
            ano, 
            userId, 
            marcaid,
            comunaId,
            modelo
            // ...otros datos...
            // Asegúrate de que corresponda al ID de la comuna
        };
        console.log(JSON.stringify(vehiculoData));

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
    const form = document.querySelector('form'); // Asegúrate de que este selector corresponda a tu formulario
    form.addEventListener('submit', enviarFormulario);
});

