import dotenv from 'dotenv';
import mysql from 'mysql2/promise'; // Usamos la versión con Promises

dotenv.config(); // Carga las variables de entorno desde .env

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Manejo de errores de conexión inicial (importante para depuración)
pool.getConnection()
    .then(connection => {
        console.log('Conexión exitosa a la base de datos MySQL.');
        connection.release(); // Liberar la conexión inmediatamente después de la prueba
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err.message);
        // Opcional: Podrías querer salir de la aplicación si la conexión inicial falla
        // process.exit(1);
    });

export default pool; // Exporta el pool para que sea utilizado por los controladores