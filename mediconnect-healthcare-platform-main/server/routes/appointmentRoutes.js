const express = require('express');
const router  = express.Router();
const { bookAppointment, getMyAppointments, getAppointmentById,
        updateAppointmentStatus, getAvailableSlots } = require('../controllers/appointmentController');
const protect   = require('../middleware/protect');
const authorize = require('../middleware/authorize');

router.post('/',              protect, authorize('patient'), bookAppointment);
router.get('/my',             protect, getMyAppointments);
router.get('/slots/:doctorId/:date', getAvailableSlots);
router.get('/:id',            protect, getAppointmentById);
router.put('/:id/status',     protect, updateAppointmentStatus);

module.exports = router;
