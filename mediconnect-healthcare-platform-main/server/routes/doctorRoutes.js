const express = require('express');
const router = express.Router();
const {
  getDoctors, getSpecializations, getDoctorById,
  getMyProfile, updateMyProfile, updateAvailability,
} = require('../controllers/doctorController');
const protect   = require('../middleware/protect');
const authorize = require('../middleware/authorize');

router.get('/',                   getDoctors);
router.get('/specializations',    getSpecializations);
router.get('/profile/me',         protect, authorize('doctor'), getMyProfile);
router.put('/profile/me',         protect, authorize('doctor'), updateMyProfile);
router.put('/availability',       protect, authorize('doctor'), updateAvailability);
router.get('/:id',                getDoctorById);

module.exports = router;
