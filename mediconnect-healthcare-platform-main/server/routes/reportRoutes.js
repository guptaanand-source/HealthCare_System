const express = require('express');
const router  = express.Router();
const { uploadReport, getMyReports, getPatientReports, deleteReport } = require('../controllers/reportController');
const protect   = require('../middleware/protect');
const authorize = require('../middleware/authorize');

router.post('/',                    protect, authorize('patient'), uploadReport);
router.get('/my',                   protect, authorize('patient'), getMyReports);
router.get('/patient/:patientId',   protect, authorize('doctor', 'admin'), getPatientReports);
router.delete('/:id',               protect, authorize('patient'), deleteReport);

module.exports = router;
