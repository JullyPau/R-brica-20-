import pool from '../config/db.js'; // Importa la conexión a la base de datos (con .js)

// Obtener todas las reservas
export const getAllBookings = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT r.*, h.numero AS numero_habitacion, h.tipo AS tipo_habitacion FROM reservas r JOIN habitaciones h ON r.codigo_habitacion = h.codigo');
        res.json(rows);
    } catch (err) {
        console.error('Error al obtener todas las reservas:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Obtener una reserva por código
export const getBookingByCode = async (req, res) => {
    const { codigo } = req.params;
    try {
        const [rows] = await pool.query('SELECT r.*, h.numero AS numero_habitacion, h.tipo AS tipo_habitacion FROM reservas r JOIN habitaciones h ON r.codigo_habitacion = h.codigo WHERE r.codigo = ?', [codigo]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Error al obtener la reserva por código:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Crear una nueva reserva
export const createBooking = async (req, res) => {
    const { codigo_habitacion, nombre_cliente, telefono_cliente, fecha_entrada, fecha_salida } = req.body;
    if (!codigo_habitacion || !nombre_cliente || !fecha_entrada || !fecha_salida) {
        return res.status(400).json({ message: 'Campos obligatorios: codigo_habitacion, nombre_cliente, fecha_entrada, fecha_salida' });
    }

    try {
        // Verificar si la habitación existe
        const [room] = await pool.query('SELECT * FROM habitaciones WHERE codigo = ?', [codigo_habitacion]);
        if (room.length === 0) {
            return res.status(404).json({ message: 'La habitación especificada no existe' });
        }

        // Verificar disponibilidad de la habitación
        const [existingBookings] = await pool.query(
            'SELECT * FROM reservas WHERE codigo_habitacion = ? AND ((fecha_entrada <= ? AND fecha_salida >= ?) OR (fecha_entrada <= ? AND fecha_salida >= ?))',
            [codigo_habitacion, fecha_salida, fecha_entrada, fecha_entrada, fecha_salida]
        );

        if (existingBookings.length > 0) {
            return res.status(409).json({ message: 'La habitación no está disponible para las fechas seleccionadas' });
        }

        const [result] = await pool.query(
            'INSERT INTO reservas (codigo_habitacion, nombre_cliente, telefono_cliente, fecha_entrada, fecha_salida) VALUES (?, ?, ?, ?, ?)',
            [codigo_habitacion, nombre_cliente, telefono_cliente, fecha_entrada, fecha_salida]
        );
        res.status(201).json({ message: 'Reserva creada exitosamente', id: result.insertId });
    } catch (err) {
        console.error('Error al crear la reserva:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Actualizar una reserva
export const updateBooking = async (req, res) => {
    const { codigo } = req.params;
    const { codigo_habitacion, nombre_cliente, telefono_cliente, fecha_entrada, fecha_salida } = req.body;
    if (!codigo_habitacion || !nombre_cliente || !fecha_entrada || !fecha_salida) {
        return res.status(400).json({ message: 'Campos obligatorios: codigo_habitacion, nombre_cliente, fecha_entrada, fecha_salida' });
    }

    try {
        // Verificar si la habitación existe
        const [room] = await pool.query('SELECT * FROM habitaciones WHERE codigo = ?', [codigo_habitacion]);
        if (room.length === 0) {
            return res.status(404).json({ message: 'La habitación especificada no existe' });
        }

        // Verificar disponibilidad de la habitación, excluyendo la reserva actual
        const [existingBookings] = await pool.query(
            'SELECT * FROM reservas WHERE codigo != ? AND codigo_habitacion = ? AND ((fecha_entrada <= ? AND fecha_salida >= ?) OR (fecha_entrada <= ? AND fecha_salida >= ?))',
            [codigo, codigo_habitacion, fecha_salida, fecha_entrada, fecha_entrada, fecha_salida]
        );

        if (existingBookings.length > 0) {
            return res.status(409).json({ message: 'La habitación no está disponible para las fechas seleccionadas' });
        }

        const [result] = await pool.query(
            'UPDATE reservas SET codigo_habitacion = ?, nombre_cliente = ?, telefono_cliente = ?, fecha_entrada = ?, fecha_salida = ? WHERE codigo = ?',
            [codigo_habitacion, nombre_cliente, telefono_cliente, fecha_entrada, fecha_salida, codigo]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }
        res.json({ message: 'Reserva actualizada exitosamente' });
    } catch (err) {
        console.error('Error al actualizar la reserva:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Eliminar una reserva
export const deleteBooking = async (req, res) => {
    const { codigo } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM reservas WHERE codigo = ?', [codigo]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }
        res.json({ message: 'Reserva eliminada exitosamente' });
    } catch (err) {
        console.error('Error al eliminar la reserva:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};