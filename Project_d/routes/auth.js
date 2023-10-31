const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

const router = express.Router();

// Creación de la conexión a la base de datos
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'project_d'
});

// Función de validación para la contraseña
function isValidPassword(password) {
    const regex = /(?=.{8,})/;
    return regex.test(password);
}

// Middleware para verificar JWT
function verifyToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).send('Access Denied');
    }

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
}

router.post('/register', async (req, res) => {
    const { nombre_usuario, correo, contrasena } = req.body;

    // Validar si el correo ya existe
    const [users] = await pool.query('SELECT correo FROM usuario WHERE correo = ?', [correo]);
    if (users.length > 0) {
        return res.status(409).json({ message: 'Correo electrónico ya registrado' });
    }

    // Validar la contraseña
    if (!isValidPassword(contrasena)) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);
   
    try {
        await pool.query(
            'INSERT INTO usuario (nombre_usuario, correo, contrasena) VALUES (?, ?, ?)',
            [nombre_usuario, correo, hashedPassword]
        );
        res.status(201).json({ message: 'User registered' });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error });
    }
});

router.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        const [results] = await pool.query(
            'SELECT id_usuario, contrasena FROM usuario WHERE correo = ?',
            [correo]
        );

        const user = results[0];

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(contrasena, user.contrasena);

        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign({ id: user.id_usuario }, process.env.SECRET_KEY, {
            expiresIn: '1h'
        });

        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({ message: 'Logged in' });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out' });
});

router.get('/status', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const [results] = await pool.query('SELECT nombre_usuario FROM usuario WHERE id_usuario = ?', [userId]);
        const user = results[0];

        if (!user) {
            return res.status(404).json({ loggedIn: false });
        }

        return res.json({ loggedIn: true, username: user.nombre_usuario });
    } catch (error) {
        return res.status(500).json({ loggedIn: false, message: 'An error occurred', error });
    }
});
module.exports = {
    router: router,
    verifyToken: verifyToken
};