// ...


document.addEventListener('DOMContentLoaded', function() {
    // Función para cargar marcas
    async function cargarMarcas() {
        const response = await fetch('/marcas');
        const marcas = await response.json();
        
        let options = '';
        marcas.forEach(marca => {
            options += `<option value="${marca.marca}"></option>`;
        });

        document.getElementById('marca-list').innerHTML = options;
    }

    // Llama a la función para cargar marcas cuando el contenido del DOM esté cargado
    cargarMarcas();
});


document.addEventListener('DOMContentLoaded', function() {
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

    // Llamada inicial para cargar regiones
    cargarRegiones();

    // Event listener para cuando cambie la selección de la región
    document.getElementById('region-id').addEventListener('change', function() {
        const regionId = this.value;
        cargarComunas(regionId);
    });


async function enviarFormulario(event) {
    event.preventDefault(); // Evita el envío predeterminado del formulario

    // Obten los valores del formulario
    const color = document.getElementById('color').value;
    const descripcion = document.getElementById('descripcion').value;
    const kilometraje = document.getElementById('kilometraje').value;
    const precio = document.getElementById('precio').value;
    const version = document.getElementById('version').value;
    const ano = document.getElementById('ano').value;
    const modelo = document.getElementById('modelo-input').value;
    const marca = document.getElementById('marca-input').value;
    const comunaId = document.getElementById('comuna-id').value; // Obtén el ID de la comuna seleccionada

    // Objeto con los datos del formulario
    const vehiculoData = {
        color,
        descripcion,
        kilometraje,
        precio,
        version,
        ano,
        modelo,
        marca,
        comunaId // Debes enviar el ID de la comuna, no el objeto completo
    };
    console.log(JSON.stringify(vehiculoData));

    try {
        // Realizar la solicitud POST al servidor
        const response = await fetch('/create-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(vehiculoData) // Convertir los datos del vehículo a una cadena JSON
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