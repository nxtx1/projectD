fetch('/crear-mantencion', {
    method: 'POST',
    body: formData,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(data => {
    Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: data.message,
    });
})
.catch((error) => {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se pudo agendar la mantención',
    });
});