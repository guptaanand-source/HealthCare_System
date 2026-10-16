const express = require('express');
const router  = express.Router();
const { createConsultation, getConsultation, getPatientConsultations, getMyConsultations } = require('../controllers/consultationController');
const protect   = require('../middleware/protect');
const authorize = require('../middleware/authorize');

router.post('/',                              protect, authorize('doctor'), createConsultation);
router.get('/my',                             protect, authorize('patient'), getMyConsultations);
router.get('/patient/:patientId',             protect, authorize('doctor', 'patient', 'admin'), getPatientConsultations);
router.get('/appointment/:appointmentId',     protect, getConsultation);

module.exports = router;
