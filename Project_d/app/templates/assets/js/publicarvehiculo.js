// ...

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
});
