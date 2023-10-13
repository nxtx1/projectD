const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const authRoutes = require('../routes/auth');  // Asegúrate que este es el path correcto a auth.js
require('dotenv').config(); // Carga variables de entorno del archivo .env

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'templates')));
app.use(authRoutes);
app.use(cors());


//rutas
// Aquí agregas la nueva ruta:
app.get('/login-register', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'login-register.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});