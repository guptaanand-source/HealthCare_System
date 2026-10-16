const express = require('express');
const router  = express.Router();
const { createPrescription, getMyPrescriptions, getPrescriptionById, getPrescriptionByConsultation } = require('../controllers/prescriptionController');
const protect   = require('../middleware/protect');
const authorize = require('../middleware/authorize');

router.post('/',                              protect, authorize('doctor'), createPrescription);
router.get('/my',                             protect, authorize('patient'), getMyPrescriptions);
router.get('/consultation/:consultationId',   protect, getPrescriptionByConsultation);
router.get('/:id',                            protect, getPrescriptionById);

module.exports = router;
