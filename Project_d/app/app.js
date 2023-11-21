const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const authModule = require('../routes/auth');  // Asegúrate que este es el path correcto a auth.js
require('dotenv').config(); // Carga variables de entorno del archivo .env
const { pool } = require('../routes/auth');
const mysql = require('mysql2/promise');
const moment = require('moment');

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

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'Home.html'));
});
app.get('/publicacionespendientes', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'publicacionespendientes.html'));
});

app.post('/logout', (req, res) => {
  res.cookie('token', '', { expires: new Date(0) }); // Establece la cookie de token a una vacía y con una fecha de expiración pasada
  res.send('Sesión cerrada con éxito');
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

app.get('/mantencionesUsuario', authModule.verifyToken, verificarRolesPermitidos, (req, res) => {
  // Solo los usuarios autenticados pueden acceder aquí
  res.sendFile(path.join(__dirname, 'templates', 'mantencionesUsuario.html'));
});
app.get('/rolUser', authModule.verifyToken, verificarRolesPermitidos, (req, res) => {
  // Solo los usuarios autenticados pueden acceder aquí
  res.sendFile(path.join(__dirname, 'templates', 'rolUser.html'));
});

app.get('/Mispublicaciones', authModule.verifyToken, (req, res) => {
  // Solo los usuarios autenticados pueden acceder aquí
  res.sendFile(path.join(__dirname, 'templates', 'Mis_publicaciones.html'));
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
        v.combustible,
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
  
  app.get('/mis-publicaciones', authModule.verifyToken, async (req, res) => {
    const userId = req.user.id; // ID del usuario obtenido del token JWT

    try {
        const [publicaciones] = await pool.query(
          `SELECT 
            vehiculo.*, 
            marca.marca AS marca, 
            modelo.modelo AS modelo
        FROM 
            vehiculo
            JOIN modelo ON vehiculo.modelo_id_modelo = modelo.id_modelo
            JOIN marca ON modelo.marca_id_marca = marca.id_marca
        WHERE 

            vehiculo.usuario_id_usuario = ?`, [userId]
        );

        // Opcional: Convertir BLOB a base64 si estás guardando imágenes en BLOB
        const publicacionesConFoto = publicaciones.map(pub => {
            return {
                ...pub,
                foto: pub.foto ? Buffer.from(pub.foto).toString('base64') : null
            };
        });

        res.json(publicacionesConFoto);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las publicaciones del usuario');
    }
});

app.get('/detalle-vehiculo/:vehiculoId', authModule.verifyToken, async (req, res) => {
  const { vehiculoId } = req.params;
  const userId = req.user.id; // ID del usuario obtenido del token JWT

  try {
      const [vehiculos] = await pool.query(
          'SELECT * FROM vehiculo WHERE id_vehiculo = ? AND usuario_id_usuario = ?', 
          [vehiculoId, userId]
      );

      if (vehiculos.length > 0) {
          // Suponiendo que deseas enviar la información del vehículo como JSON
          // Convertir la foto BLOB a una cadena base64
          const vehiculo = vehiculos[0];
          if (vehiculo.foto) {
            vehiculo.foto = Buffer.from(vehiculo.foto).toString('base64');
            vehiculo.foto = `data:image/jpeg;base64,${vehiculo.foto}`; // Añadir el prefijo necesario para el Data-URI
          }

          // Enviar los detalles del vehículo
          res.json(vehiculo);
      } else {
          res.status(404).send('Vehículo no encontrado o no tiene permiso para verlo.');
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Error del servidor');
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
    const { fecha_mantencion, vehiculo_id_vehiculo } = req.body;
    const userId = req.user.id;
    const estadodefecto = 'programado';
    
    try {
        // Asegúrate de que fecha_mantencion ya esté en formato 'YYYY-MM-DD HH:mm' antes de insertarlo
        await pool.query(
            'INSERT INTO mantencion (fecha_mantencion, usuario_id_usuario, vehiculo_id_vehiculo, estado) VALUES (?, ?, ?, ?)',
            [fecha_mantencion, userId, vehiculo_id_vehiculo, estadodefecto]
        );
      
        res.status(200).json({ message: 'Mantención agendada correctamente' });
    } catch (error) {
        console.error('Error al crear la mantención:', error);
        res.status(500).json({ message: 'No se pudo agendar la mantención', error });
    }
});

  // VER, EDITAR, ELIMINAR MANTENCIONES

  app.get('/mis-mantenciones', authModule.verifyToken, async (req, res) => {
    const userId = req.user.id; // Asegúrate de que este es el método correcto para obtener el ID del usuario
  
    try {
      const [mantenciones] = await pool.query(
        'SELECT m.id_mantencion, v.id_vehiculo, m.fecha_mantencion, ma.marca, mo.modelo ' +
        'FROM mantencion m ' +
        'JOIN vehiculo v ON m.vehiculo_id_vehiculo = v.id_vehiculo ' +
        'JOIN modelo mo ON v.modelo_id_modelo = mo.id_modelo ' +
        'JOIN marca ma ON mo.marca_id_marca = ma.id_marca ' +
        'WHERE m.usuario_id_usuario = ? ' +
        'ORDER BY m.fecha_mantencion DESC', 
        [userId]
      );
      res.json(mantenciones);
    } catch (error) {
      console.error('Error al obtener las mantenciones del usuario:', error);
      res.status(500).send('Error al obtener las mantenciones');
    }
  });
  
  app.delete('/eliminar-mantencion/:id', authModule.verifyToken, async (req, res) => {
    const idMantencion = req.params.id;
  
    try {
      await pool.query(
        'DELETE FROM mantencion WHERE id_mantencion = ? AND usuario_id_usuario = ?',
        [idMantencion, req.user.id]
      );
      res.json({ message: 'Mantención eliminada con éxito.' });
    } catch (error) {
      console.error('Error al eliminar la mantención:', error);
      res.status(500).json({ message: 'Error al eliminar la mantención', error });
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
    const [marcas] = await pool.query(`
    SELECT DISTINCT
      ma.id_marca, 
      ma.marca 
      FROM vehiculo v 
      JOIN modelo mo ON v.modelo_id_modelo = mo.id_modelo 
      JOIN marca ma ON mo.marca_id_marca = ma.id_marca 
      WHERE v.estado = 'aprobado'
      ORDER BY ma.marca`);
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
    WHERE ma.id_marca = ? AND v.estado = 'aprobado'
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
    AND v.estado = 'aprobado'
    ORDER BY v.ano DESC`, [modeloId]);
    console.log('Años obtenidos:', anos); // Nuevo
    res.json(anos);
  } catch (error) {
    console.error('Error al obtener los años:', error); // Modificado
    res.status(500).send('Error al obtener los años');
  }
});





app.get('/api/buscarVehiculos', async (req, res) => {
  const { marca, modelo, anoInicio, anoFin, precioMin, precioMax, transmision, combustible, kilometrajeMin, kilometrajeMax} = req.query;

  try {
      let query = `
      SELECT 
      v.id_vehiculo,
      v.ano,
      v.kilometraje,
      v.precio,
      v.transmision,
      v.foto,
      v.combustible,
      m.modelo,
      ma.marca,
      man.estado
    FROM vehiculo v
    JOIN modelo m ON v.modelo_id_modelo = m.id_modelo
    JOIN marca ma ON m.marca_id_marca = ma.id_marca
    LEFT JOIN mantencion man ON v.id_vehiculo = man.vehiculo_id_vehiculo
          WHERE 1=1 AND v.estado = 'Aprobado'`;

          const params = [];


          if (marca) {
            query += ' AND ma.id_marca = ?';
            params.push(marca);
          }
          if (modelo) {
            query += ' AND m.id_modelo = ?';
            params.push(modelo);
          }
          if (anoInicio) {
            query += ' AND v.ano >= ?';
            params.push(anoInicio);
          }
          if (anoFin) {
            query += ' AND v.ano <= ?';
            params.push(anoFin);
          }
          if (precioMin) {
            query += ' AND v.precio >= ?';
            params.push(precioMin);
          }
          if (precioMax) {
            query += ' AND v.precio <= ?';
            params.push(precioMax);
          }
          if (transmision) {
            query += ' AND v.transmision = ?';
            params.push(transmision);
          }
          if (combustible) {
            query += ' AND v.combustible = ?';
            params.push(combustible);
          }
          if (kilometrajeMin) {
            query += ' AND v.kilometraje >= ?';
            params.push(kilometrajeMin);
          }
          if (kilometrajeMax) {
            query += ' AND v.kilometraje <= ?';
            params.push(kilometrajeMax);
          }
      
          const [vehiculos] = await pool.query(query, params);
          console.log(params);
      
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

async function generarFechasConHoras() {
  let fechas = [];
  let fechaInicio = moment().add(0, 'weeks').startOf('day');
  let fechaFin = moment(fechaInicio).add(2, 'weeks');

  for (let m = moment(fechaInicio); m.isBefore(fechaFin); m.add(1, 'days')) {
      if (m.day() !== 0) {
          for (let hora = 8; hora < 17; hora++) {
              for (let minuto = 0; minuto < 60; minuto += 30) {
                  let fechaConHora = moment(m).hour(hora).minute(minuto);
                  if (fechaConHora.isAfter(moment())) {
                      fechas.push({
                          paraMostrar: fechaConHora.format('DD-MM-YYYY HH:mm'),
                          paraBaseDatos: fechaConHora.format('YYYY-MM-DD HH:mm')
                      });
                  }
              }
          }
      }
  }

  return fechas;
};

async function obtenerFechasReservadas() {
  try {
      const query = 'SELECT fecha_mantencion FROM mantencion WHERE estado = ?';
      const [resultados] = await pool.query(query, ['programado']); // Destructura el primer elemento del resultado, que debería ser el array con las filas.
      
      const fechasReservadas = resultados
        .map(fila => fila.fecha_mantencion)
        .filter(fecha => fecha) // Filtrar entradas nulas o indefinidas.
        .map(fecha => moment(fecha).format('YYYY-MM-DD HH:mm')) // Asegúrate de que la conversión sea válida.
        .filter(fecha => fecha !== 'Invalid date'); // Filtrar fechas inválidas.

      console.log('Fechas reservadas (formateadas):', fechasReservadas);
      return fechasReservadas;
  } catch (error) {
      console.error('Error al obtener fechas reservadas:', error);
      throw error;
  }
}




async function generarFechasConHorasDisponibles() {
  let fechasReservadas = await obtenerFechasReservadas();
  let fechasDisponibles = await generarFechasConHoras(); // Asegúrate de que esta función devuelva las fechas en el mismo formato que la base de datos

  // Filtrar las fechas que ya están reservadas
  let fechasConHorasDisponibles = fechasDisponibles.filter((fecha) => {
      return !fechasReservadas.includes(fecha.paraBaseDatos);
  });

  return fechasConHorasDisponibles;
}




app.get('/api/fechas', async (req, res) => {
  try {
      let fechasConHorasDisponibles = await generarFechasConHorasDisponibles();
      res.json(fechasConHorasDisponibles);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'No se pudieron obtener las fechas disponibles', error });
  }
});



app.get('/vehiculos-pendientes', async (req, res) => {
  try {
      let query = `
      SELECT 
      v.id_vehiculo,
      v.ano,
      v.kilometraje,
      v.precio,
      v.transmision,
      v.foto,
      v.estado,
      v.fecha_publicacion,
      m.modelo,
      ma.marca
    FROM vehiculo v
    JOIN modelo m ON v.modelo_id_modelo = m.id_modelo
    JOIN marca ma ON m.marca_id_marca = ma.id_marca
    LEFT JOIN mantencion man ON v.id_vehiculo = man.vehiculo_id_vehiculo
          WHERE 1=1 AND v.estado = 'pendiente'`;

      const params = [];

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

app.post('/aprobar-vehiculo/:id', async (req, res) => {
  const idVehiculo = req.params.id;

  try {
    // Código para actualizar la base de datos
    // Esto es un ejemplo y dependerá de tu configuración de base de datos
    const query = 'UPDATE vehiculo SET estado = "Aprobado" WHERE id_vehiculo = ?';
    // Suponiendo que 'db' es tu conexión a la base de datos
    await pool.query(query, [idVehiculo]);

    res.json({ message: `Vehículo con ID ${idVehiculo} aprobado.` });
  } catch (error) {
    console.error('Error al aprobar el vehículo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.post('/rechazar-vehiculo/:id', async (req, res) => {
  const idVehiculo = req.params.id;

  try {
    // Código para eliminar el registro de la base de datos
    const query = 'DELETE FROM vehiculo WHERE id_vehiculo = ?';
    await pool.query(query, [idVehiculo]);

    res.json({ message: `Vehículo con ID ${idVehiculo} rechazado y eliminado.` });
  } catch (error) {
    console.error('Error al rechazar el vehículo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});