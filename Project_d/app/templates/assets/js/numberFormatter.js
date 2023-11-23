function formatNumberWithDots(input) {
    let numbersOnly = input.replace(/\D/g, ''); // Elimina todo lo que no sea número
    let parts = numbersOnly.match(/(\d{1,3})(?=(\d{3})*$)/g);
    return parts ? parts.join('.') : '';
}

function updatePreview(elementId, value, prefix = '', suffix = '') {
    const previewElement = document.getElementById(elementId);
    if (previewElement) {
        previewElement.textContent = prefix + value + suffix;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const precioInput = document.getElementById('precio');
    const kilometrajeInput = document.getElementById('kilometraje');

    if (precioInput) {
        precioInput.addEventListener('input', function () {
            let formattedValue = formatNumberWithDots(this.value);
            updatePreview('preview-price', formattedValue, '$');
        });
    }

    if (kilometrajeInput) {
        kilometrajeInput.addEventListener('input', function () {
            let formattedValue = formatNumberWithDots(this.value);
            updatePreview('preview-mileage', formattedValue, '', ' Km');
        });
    }
});