

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const multer = require('multer');
require('dotenv').config();
// Configura Multer para guardar archivos en la memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 }  });

const sendEmail = require('../app/templates/assets/js/./emailService');

// Luego, usarías 'upload' como middleware en tu ruta de POST

const router = express.Router();

// Creación de la conexión a la base de datos
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ssss'
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
    try {
        const { nombre_usuario, correo, contrasena } = req.body;

        // Validar si el correo ya existe
        const [users] = await pool.query('SELECT correo FROM usuario WHERE correo = ?', [correo]);
        if (users.length > 0) {
            return res.status(409).json({ message: 'Correo electrónico ya registrado' });
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contrasena, salt);

        // Insertar el nuevo usuario en la base de datos
        await pool.query(
            'INSERT INTO usuario (nombre_usuario, correo, contrasena) VALUES (?, ?, ?)',
            [nombre_usuario, correo, hashedPassword]
        );
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;
    try {
        const [results] = await pool.query(
            'SELECT id_usuario, contrasena, rol FROM usuario WHERE correo = ?',
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

        const token = jwt.sign({ id: user.id_usuario, rol: user.rol }, process.env.SECRET_KEY, {
            expiresIn: '1h'
        });
        console.log(user.rol);
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
        const [results] = await pool.query('SELECT nombre_usuario, rol FROM usuario WHERE id_usuario = ?', [userId]);
        const user = results[0];

        if (!user) {
            return res.status(404).json({ loggedIn: false });
        }

        return res.json({ loggedIn: true, username: user.nombre_usuario, rol: user.rol });
    } catch (error) {
        return res.status(500).json({ loggedIn: false, message: 'An error occurred', error });
    }
});

router.post('/create-post', verifyToken, upload.single('vehicleImage'), async (req, res) => {
    const userId = req.user.id; // obtenido del token JWT
    const { descripcion, kilometraje, precio, combustible, transmision, ano, modelo_id_modelo, comuna_id_comuna } = req.body;

    try {
        // Verifica si ya existe una publicación con los mismos detalles
        const [existing] = await pool.query(
            'SELECT * FROM vehiculo WHERE usuario_id_usuario = ? AND modelo_id_modelo = ? AND kilometraje = ? AND transmision = ?',
            [userId, modelo_id_modelo, kilometraje, transmision]
        );

        if (existing.length > 0) {
            // Si existe una publicación, devuelve un mensaje de error
            return res.status(409).json({ message: 'Una publicación similar ya existe.' });
        }

        // Convertir el archivo de imagen a un Buffer para insertar en la base de datos
        let imageBuffer = null;
        if (req.file && req.file.buffer) {
            imageBuffer = req.file.buffer;
        }
        // Si no hay duplicados, procede a insertar la nueva publicación, incluyendo la imagen
        const [insertResult] = await pool.query(
            'INSERT INTO vehiculo (descripcion, kilometraje, precio, combustible, transmision, ano, usuario_id_usuario, modelo_id_modelo, comuna_id_comuna, foto, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "pendiente")',
            [descripcion, kilometraje, precio, combustible, transmision, ano, userId, modelo_id_modelo, comuna_id_comuna, imageBuffer]
        );
        

    } catch (error) {
        console.error(error); // Registra el error en el log del servidor
        res.status(500).json({ message: 'Error al crear la publicación', error });
    }
});






// ...
router.get('/marcas', async (req, res) => {
    try {
        const [marcas] = await pool.query('SELECT * FROM marca');
        res.json(marcas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las marcas', error });
    }
});

router.get('/modelos/:marcaId', async (req, res) => {
    const { marcaId } = req.params;
    try {
        const [modelos] = await pool.query('SELECT * FROM modelo WHERE marca_id_marca = ?', [marcaId]);
        res.json(modelos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los modelos', error });
    }
});

// Obtener todas las regiones
router.get('/regiones', async (req, res) => {
    try {
        const [regiones] = await pool.query('SELECT * FROM region');
        res.json(regiones);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las regiones', error });
    }
});

// Obtener comunas por ID de región
router.get('/comunas/:regionId', async (req, res) => {
    const { regionId } = req.params;
    try {
        const [comunas] = await pool.query('SELECT * FROM comuna WHERE region_id_region = ?', [regionId]);
        res.json(comunas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las comunas', error });
    }
});
module.exports = {
    router: router,
    verifyToken: verifyToken,
    pool
};