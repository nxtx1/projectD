const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const authModule = require('../routes/auth');  // Asegúrate que este es el path correcto a auth.js
require('dotenv').config(); // Carga variables de entorno del archivo .env
const { pool } = require('../routes/auth');
const mysql = require('mysql2/promise');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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


app.get('/aaa', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'aaa.html'));
});

app.get('/modal', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'modal.html'));
});
app.get('/sss', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'sss.html'));
});
app.get('/autos', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'autos.html'));
});
app.get('/htmlnuevo', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'htmlnuevo.html'));
});

// Ejemplo de uso del middleware para una ruta que requiere autenticación
app.get('/create-post', authModule.verifyToken, (req, res) => {
    // Solo los usuarios autenticados pueden acceder aquí
    res.sendFile(path.join(__dirname, 'templates', 'Publicarvehiculos.html'));
});
app.get('/mantencion', authModule.verifyToken, (req, res) => {
    // Solo los usuarios autenticados pueden acceder aquí
    res.sendFile(path.join(__dirname, 'templates', 'mantencion.html'));
});

app.get('/mantenciones', authModule.verifyToken, verificarRolesPermitidos, (req, res) => {
  // Solo los usuarios autenticados pueden acceder aquí
  res.sendFile(path.join(__dirname, 'templates', 'mantenciones.html'));
});

app.get('/rolUser', authModule.verifyToken, verificarRolesPermitidos, (req, res) => {
  // Solo los usuarios autenticados pueden acceder aquí
  res.sendFile(path.join(__dirname, 'templates', 'rolUser.html'));
});



app.get('/obtener-vehiculos', authModule.verifyToken, async (req, res) => {
    console.log('Ruta /obtener-vehiculos golpeada');
    const userId = req.user.id;

    try {
      const [results] = await pool.query(`
      SELECT 
        v.*, 
        m.marca,
        mo.modelo
      FROM vehiculo v 
      JOIN modelo mo ON v.modelo_id_modelo = mo.id_modelo
      JOIN marca m ON mo.marca_id_marca = m.id_marca
      WHERE usuario_id_usuario = ?;`, [userId]);
        console.log('Vehículos obtenidos para el usuario:', userId);
        res.json(results);
    } catch (error) {
        console.error('Error al obtener los vehículos:', error);
        res.status(500).send('Error al obtener los vehículos');
    }
});
app.get('/api/vehiculos/:id', async (req, res) => {
    try {
      const vehiculoId = req.params.id;
      const [vehiculos] = await pool.query(`
      SELECT 
        v.id_vehiculo,
        v.foto,
        v.ano,
        v.kilometraje,
        v.precio,
        v.transmision,
        v.descripcion,
        mo.modelo,
        m.marca
      FROM vehiculo v
      JOIN modelo mo ON v.modelo_id_modelo= mo.id_modelo
      JOIN marca m ON mo.marca_id_marca = m.id_marca
      WHERE v.id_vehiculo = ?`, [vehiculoId]);
  
      if (vehiculos.length === 0) {
        return res.status(404).send('Vehículo no encontrado');
      }
  
      // Suponiendo que 'foto' es un campo BLOB en la base de datos
      const vehiculo = vehiculos[0];
      if (vehiculo.foto) {
        // Convertir el BLOB a una cadena base64
        vehiculo.foto = Buffer.from(vehiculo.foto).toString('base64');
        vehiculo.foto = `data:image/jpeg;base64,${vehiculo.foto}`; // Añadir el prefijo necesario para el Data-URI
      }
  
      res.json(vehiculo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  });
  
  
app.get('/vehiculo/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'detalle-vehiculo.html'));
  });
  
// Ruta para obtener la información de los vehículos
app.get('/api/vehiculos', async (req, res) => {
    try {
      const query = `
      SELECT 
      v.id_vehiculo,
      v.ano,
      v.kilometraje,
      v.precio,
      v.transmision,
      v.foto,
      m.modelo,
      ma.marca
    FROM vehiculo v
    JOIN modelo m ON v.modelo_id_modelo = m.id_modelo
    JOIN marca ma ON m.marca_id_marca = ma.id_marca`;
  
      const [vehiculos] = await pool.query(query);
      // Convertir la foto BLOB a una cadena base64 para cada vehículo
      const vehiculosConFotoBase64 = vehiculos.map(vehiculo => {
        return {
          ...vehiculo,
          foto: vehiculo.foto ? Buffer.from(vehiculo.foto).toString('base64') : null
        };
      });
      
      res.json(vehiculosConFotoBase64);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener los vehículos de la base de datos');
    }
  });


app.post('/crear-mantencion', authModule.verifyToken, async (req, res) => {
    // req.body contendrá los datos enviados desde el formulario
    console.log(req.body);
    const { fecha_mantencion, vehiculo_id_vehiculo} = req.body;
    const userId = req.user.id;
    console.log('usuario que agendará mantención:', userId);
    console.log(fecha_mantencion, vehiculo_id_vehiculo, userId);
    const estadodefecto = 'programado'
    try {
      // Aquí insertas los datos en la base de datos
      const fechaMySQL = new Date(fecha_mantencion).toISOString().slice(0, 19).replace('T', ' ');
      const result = await pool.query(
        'INSERT INTO mantencion (fecha_mantencion, usuario_id_usuario, vehiculo_id_vehiculo, estado) VALUES (?, ?, ?, ?)',
        [fecha_mantencion, userId, vehiculo_id_vehiculo, estadodefecto]
      );
      
      // Si todo va bien, enviar una confirmación al cliente
      res.status(200).json({ message: 'Mantención agendada correctamente' });
    } catch (error) {
      console.error('Error al crear la mantención:', error);
      res.status(500).json({ message: 'No se pudo agendar la mantención', error });
    }
  });

















function verificarRolesPermitidos(req, res, next) {
  // Asumiendo que los roles permitidos para realizar la acción son mecánico y administrador
  const rolesPermitidos = [1, 2]; // Array de IDs de roles permitidos

  if (req.user && rolesPermitidos.includes(req.user.rol)) {
    next(); // El usuario tiene un rol permitido, puede continuar
  } else {
    res.status(403).json({ mensaje: 'No tiene permisos para realizar esta acción' });
  }
}


app.get('/api/mantenciones', authModule.verifyToken, verificarRolesPermitidos, async (req, res) => {
  try {
    const query = `SELECT 
    m.id_mantencion, 
      m.fecha_mantencion, 
      m.estado,
      u.nombre_usuario,
      ma.marca,
      mo.modelo
  FROM mantencion m 
  JOIN usuario u ON m.usuario_id_usuario = u.id_usuario 
  JOIN vehiculo v on m.vehiculo_id_vehiculo = v.id_vehiculo 
  JOIN modelo mo ON v.modelo_id_modelo = mo.id_modelo 
  JOIN marca ma ON mo.marca_id_marca = ma.id_marca 
  ORDER BY fecha_mantencion;`
    const [mantenciones] = await pool.query(query);
    res.json(mantenciones);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener las mantenciones');
  }
});

app.post('/api/mantenciones/:id/cambiar-estado', authModule.verifyToken, verificarRolesPermitidos, async (req, res) => {
  const idMantencion = req.params.id;
  const { estado } = req.body; // El nuevo estado viene en el cuerpo de la solicitud

  try {
    // Validar el nuevo estado - asegúrate de que es un estado válido

    // Actualizar el estado de la mantención en la base de datos
    await pool.query('UPDATE mantencion SET estado = ? WHERE id_mantencion = ?', [estado, idMantencion]);

    // Si todo salió bien, enviar una respuesta de éxito
    res.send('Estado de la mantención actualizado correctamente.');
  } catch (error) {
    // En caso de error, enviar una respuesta de error
    console.error('Error al cambiar el estado de la mantención:', error);
    res.status(500).send('Error en el servidor al actualizar el estado de la mantención.');
  }
});

app.get('/api/rol', authModule.verifyToken, verificarRolesPermitidos, async (req, res) => {
  try {
    const query = `SELECT * FROM usuario;`
    const [rol] = await pool.query(query);
    res.json(rol);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los roles');
  }
});

app.post('/api/roles/:id/cambiar-estado', authModule.verifyToken, verificarRolesPermitidos, async (req, res) => {
  const idUsuario = req.params.id;
  const { estado } = req.body; // El nuevo estado viene en el cuerpo de la solicitud

  try {
    // Validar el nuevo estado - asegúrate de que es un estado válido

    // Actualizar el estado de la mantención en la base de datos
    await pool.query('UPDATE usuario SET rol = ? WHERE id_usuario = ?', [estado, idUsuario]);

    // Si todo salió bien, enviar una respuesta de éxito
    res.send('Estado de la mantención actualizado correctamente.');
  } catch (error) {
    // En caso de error, enviar una respuesta de error
    console.error('Error al cambiar el estado de la mantención:', error);
    res.status(500).send('Error en el servidor al actualizar el estado de la mantención.');
  }
});


app.get('/api/marcas', async (req, res) => {
  try {
    console.log('Obteniendo marcas...'); // Nuevo
    const [marcas] = await pool.query('SELECT DISTINCT ma.id_marca, ma.marca FROM vehiculo v JOIN modelo mo ON v.modelo_id_modelo = mo.id_modelo JOIN marca ma ON mo.marca_id_marca = ma.id_marca ORDER BY ma.marca');
    console.log('Marcas obtenidas:', marcas); // Nuevo
    res.json(marcas.map(marca => ({ id: marca.id_marca, nombre: marca.marca })));
  } catch (error) {
    console.error('Error al obtener las marcas:', error); // Modificado
    res.status(500).send('Error al obtener las marcas');
  }
});


app.get('/api/modelos/:marcaId', async (req, res) => {
  try {
    const marcaId = req.params.marcaId;
    console.log('Obteniendo modelos para la marca:', marcaId); // Nuevo
    const [modelos] = await pool.query(`
    SELECT mo.id_modelo, mo.modelo 
    FROM modelo mo
    JOIN vehiculo v ON mo.id_modelo = v.modelo_id_modelo
    JOIN marca ma ON mo.marca_id_marca = ma.id_marca
    WHERE ma.id_marca = ?
    GROUP BY mo.id_modelo, mo.modelo`, [marcaId]);
    console.log('Modelos obtenidos:', modelos); // Nuevo
    res.json(modelos);
  } catch (error) {
    console.error('Error al obtener los modelos:', error); // Modificado
    res.status(500).send('Error al obtener los modelos');
  }
});



app.get('/api/anos/:modeloId', async (req, res) => {
  try {
    const modeloId = req.params.modeloId;
    console.log('Obteniendo años para el modelo:', modeloId); // Nuevo
    const [anos] = await pool.query(`
    SELECT v.ano
    FROM vehiculo v
    WHERE v.modelo_id_modelo = ?
    ORDER BY v.ano DESC`, [modeloId]);
    console.log('Años obtenidos:', anos); // Nuevo
    res.json(anos);
  } catch (error) {
    console.error('Error al obtener los años:', error); // Modificado
    res.status(500).send('Error al obtener los años');
  }
});





app.get('/api/buscarVehiculos', async (req, res) => {
  try {
      let query = `
          SELECT v.id_vehiculo, v.ano, v.kilometraje, v.precio, v.foto, 
                 m.modelo, ma.marca, v.transmision
          FROM vehiculo v
          JOIN modelo m ON v.modelo_id_modelo = m.id_modelo
          JOIN marca ma ON m.marca_id_marca = ma.id_marca
          WHERE 1=1`;

      const params = [];

      if (req.query.marca) {
          query += ' AND ma.id_marca = ?';
          params.push(req.query.marca);
      }
      if (req.query.modelo) {
          query += ' AND m.id_modelo = ?';
          params.push(req.query.modelo);
      }
      if (req.query.ano) {
          query += ' AND v.ano = ?';
          params.push(req.query.ano);
      }

      const [vehiculos] = await pool.query(query, params);
      
      // Convertir la foto BLOB a una cadena base64 para cada vehículo
      const vehiculosConFotoBase64 = vehiculos.map(vehiculo => {
        return {
          ...vehiculo,
          foto: vehiculo.foto ? Buffer.from(vehiculo.foto).toString('base64') : null
        };
      });
      
      res.json(vehiculosConFotoBase64);
  } catch (error) {
      console.error('Error al buscar vehículos:', error);
      res.status(500).send('Error en el servidor');
  }
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});