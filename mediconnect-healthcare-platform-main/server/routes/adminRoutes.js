const express = require('express');
const router  = express.Router();
const { getStats, getUsers, getDoctors, verifyDoctor, toggleUserActive, getAppointments } = require('../controllers/adminController');
const protect   = require('../middleware/protect');
const authorize = require('../middleware/authorize');

router.use(protect, authorize('admin'));

router.get('/stats',                   getStats);
router.get('/users',                   getUsers);
router.get('/doctors',                 getDoctors);
router.put('/doctors/:id/verify',      verifyDoctor);
router.put('/users/:id/toggle-active', toggleUserActive);
router.get('/appointments',            getAppointments);

module.exports = router;
