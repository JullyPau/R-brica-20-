import express from 'express';
import cors from 'cors';
import { networkInterfaces } from 'os';

// Importa tus rutas (con .js al final)
import roomsRoutes from './routes/rooms.js';
import bookingsRoutes from './routes/bookings.js';

// Importa la configuración de la base de datos para que el pool se inicialice
// (No necesitas exportar el pool de db.js para que app.js funcione,
// solo necesitas que el archivo se ejecute para inicializar la conexión)
import './config/db.js';

const app = express();
const PORT = 4000; // El puerto que estás usando y que Nodemon te reporta

// Configuración de middlewares
app.use(cors()); // Habilita CORS para permitir peticiones desde el navegador
app.use(express.json()); // Middleware para parsear cuerpos de peticiones JSON (¡IMPORTANTE: va antes de las rutas!)

// Función para obtener IP local (ya la tienes y está bien)
const getLocalIp = () => {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
};

// Monta las rutas de la API
app.use('/rooms', roomsRoutes); // Todas las rutas definidas en rooms.js se montan bajo /rooms
app.use('/bookings', bookingsRoutes); // Todas las rutas definidas en bookings.js se montan bajo /bookings

// Ruta de prueba (ya la tienes, está bien)
app.get('/test', (req, res) => {
  res.json({
    status: '¡API operativa!',
    ip_local: getLocalIp(),
    port: PORT
  });
});

// Middleware para manejo de errores generales (captura errores no manejados)
app.use((err, req, res, next) => {
    console.error(err.stack); // Muestra el stack trace completo del error en la consola del servidor
    res.status(500).send('¡Algo salió mal en el servidor! (Error interno)');
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => { // Escucha en todas las interfaces de red
  console.log(`
  🚀 Servidor ACTIVO en:
  Local:    http://localhost:${PORT}/test
  Red:      http://${getLocalIp()}:${PORT}/test
  `);
});