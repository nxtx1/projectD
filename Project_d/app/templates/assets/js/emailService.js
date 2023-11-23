const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Puedes usar otro servicio de correo
    auth: {
        user: 'automarket.serv@gmail.com',
        pass: 'olakarlita1'
    }
});

async function sendEmail(to, subject, text) {
    const mailOptions = {
        from: process.env.EMAIL_FROM, // Usa la dirección del remitente desde las variables de entorno
        to: to,
        subject: subject,
        text: text
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
}

module.exports = sendEmail;
