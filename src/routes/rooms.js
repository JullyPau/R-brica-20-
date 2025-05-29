import { Router } from 'express'; // Importa Router de Express
import {
    getAllRooms,
    getRoomByCode,
    createRoom,
    updateRoom,
    deleteRoom
} from '../controllers/rooms.js'; // <-- ¡Importa desde 'rooms.js' en controllers, con .js!

const router = Router(); // Crea una instancia de Router

// Definición de las rutas para habitaciones
router.get('/', getAllRooms);         // GET /rooms
router.get('/:codigo', getRoomByCode); // GET /rooms/:codigo
router.post('/', createRoom);         // POST /rooms
router.put('/:codigo', updateRoom);     // PUT /rooms/:codigo
router.delete('/:codigo', deleteRoom); // DELETE /rooms/:codigo

export default router; // Exporta el router para que app.js lo pueda usar