const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const authModule = require('../routes/auth');  // Asegúrate que este es el path correcto a auth.js
require('dotenv').config(); // Carga variables de entorno del archivo .env

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'templates')));
app.use(authModule.router);
app.use(cors());

//rutas

// Aquí agregas la nueva ruta:
app.get('/login-register', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'login-register.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'Home.html'));
});


// Ejemplo de uso del middleware para una ruta que requiere autenticación
app.get('/create-post', authModule.verifyToken, (req, res) => {
    // Solo los usuarios autenticados pueden acceder aquí
    res.sendFile(path.join(__dirname, 'templates', 'Publicarvehiculos.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});