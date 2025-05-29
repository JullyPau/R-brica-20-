import pool from '../config/db.js'; // Importa la conexión a la base de datos (con .js)

// Obtener todas las habitaciones
export const getAllRooms = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM habitaciones');
        res.json(rows);
    } catch (err) {
        console.error('Error al obtener todas las habitaciones:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Obtener una habitación por código
export const getRoomByCode = async (req, res) => {
    const { codigo } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM habitaciones WHERE codigo = ?', [codigo]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Habitación no encontrada' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Error al obtener la habitación por código:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Crear una nueva habitación
export const createRoom = async (req, res) => {
    const { numero, tipo, valor } = req.body;
    if (!numero || !tipo || !valor) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios: numero, tipo, valor' });
    }
    try {
        const [result] = await pool.query('INSERT INTO habitaciones (numero, tipo, valor) VALUES (?, ?, ?)', [numero, tipo, valor]);
        res.status(201).json({ message: 'Habitación creada exitosamente', id: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'El número de habitación ya existe' });
        }
        console.error('Error al crear la habitación:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Actualizar una habitación
export const updateRoom = async (req, res) => {
    const { codigo } = req.params;
    const { numero, tipo, valor } = req.body;
    if (!numero || !tipo || !valor) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios: numero, tipo, valor' });
    }
    try {
        const [result] = await pool.query('UPDATE habitaciones SET numero = ?, tipo = ?, valor = ? WHERE codigo = ?', [numero, tipo, valor, codigo]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Habitación no encontrada' });
        }
        res.json({ message: 'Habitación actualizada exitosamente' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'El número de habitación ya existe' });
        }
        console.error('Error al actualizar la habitación:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Eliminar una habitación
export const deleteRoom = async (req, res) => {
    const { codigo } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM habitaciones WHERE codigo = ?', [codigo]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Habitación no encontrada' });
        }
        res.json({ message: 'Habitación eliminada exitosamente' });
    } catch (err) {
        console.error('Error al eliminar la habitación:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};