const sendEmail = require('./emailService');

sendEmail('naxo298@gmail.com', 'Prueba de Nodemailer', '¡Hola! Este es un correo de prueba de Nodemailer.').then(() => {
    console.log('Correo enviado con éxito');
}).catch((error) => {
    console.error('Error al enviar el correo:', error);
});
