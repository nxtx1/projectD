const nodemailer = require('nodemailer');

// Configuración del transporte de Nodemailer para usar Outlook
const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: 'automarket.serv@outlook.com',
        pass: 'olakarlita1' // Considera usar variables de entorno para proteger tu contraseña
    }
});

// Función para enviar el email con un enlace para cambiar la contraseña
async function sendPasswordResetEmail(userEmail, user) {
    // Suponiendo que user es un objeto que contiene información del usuario y su token de reset
    const resetToken = user.resetToken;
    const resetUrl = `http://localhost:3000/?password-resettoken=${resetToken}`;

    const mailOptions = {
        from: process.env.EMAIL_FROM || 'automarket.serv@outlook.com',
        to: userEmail,
        subject: 'Recuperación de contraseña',
        html: `
          <p>Has solicitado cambiar tu contraseña. Por favor, sigue el enlace de abajo para establecer una nueva contraseña. Este enlace es válido por 1 hora.</p>
          <a href="${resetUrl}">Cambiar mi contraseña</a>
          <p>Si no has solicitado un cambio de contraseña, por favor ignora este correo electrónico.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Correo de recuperación de contraseña enviado a ${userEmail}`);
    } catch (error) {
        console.error('Error al enviar el correo de recuperación de contraseña:', error);
    }
}

async function sendWelcomeEmail(userEmail, user) {
    const mailOptions = {
        from: process.env.EMAIL_FROM || 'automarket.serv@outlook.com',
        to: userEmail,
        subject: 'Bienvenido a AutoMarket!',
        html: `
          <p>Hola ${user},</p>
          <p>¡Gracias por registrarte en AutoMarket! Estamos emocionados de tenerte con nosotros.</p>
          <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          <p>Saludos,</p>
          <p>El equipo de AutoMarket</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Correo de bienvenida enviado a ${userEmail}`);
    } catch (error) {
        console.error('Error al enviar el correo de bienvenida:', error);
    }
}

async function sendMaintenanceEmail(userEmail, maintenanceDetails) {
    const mailOptions = {
        from: process.env.EMAIL_FROM || 'tuCorreo@example.com',
        to: userEmail,
        subject: 'Confirmación de Mantención Programada',
        html: `
          <p>Hola,</p>
          <p>Tu mantención ha sido programada con éxito para la fecha: ${maintenanceDetails.fecha}.</p>
          <p>Detalles de la mantención:</p>
          <ul>
            <li>Fecha: ${maintenanceDetails.fecha}</li>
            <li>Vehículo: ${maintenanceDetails.vehiculo}</li>
          </ul>
          <p>Gracias por usar nuestros servicios.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Correo de confirmación de mantención enviado a ${userEmail}`);
    } catch (error) {
        console.error('Error al enviar el correo de confirmación de mantención:', error);
    }
}

module.exports = { sendPasswordResetEmail, sendWelcomeEmail, sendMaintenanceEmail };

