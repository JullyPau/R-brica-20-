import { Router } from 'express'; // Importa Router de Express
import {
    getAllBookings,
    getBookingByCode,
    createBooking,
    updateBooking,
    deleteBooking
} from '../controllers/bookings.js'; // <-- ¡Importa desde 'bookings.js' en controllers, con .js!

const router = Router(); // Crea una instancia de Router

// Definición de las rutas para bookings
router.get('/', getAllBookings);         // GET /bookings
router.get('/:codigo', getBookingByCode); // GET /bookings/:codigo
router.post('/', createBooking);         // POST /bookings
router.put('/:codigo', updateBooking);     // PUT /bookings/:codigo
router.delete('/:codigo', deleteBooking); // DELETE /bookings/:codigo

export default router; // Exporta el router para que app.js lo pueda usar