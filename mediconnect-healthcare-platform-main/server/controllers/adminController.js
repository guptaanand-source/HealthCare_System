const User         = require('../models/User');
const Doctor       = require('../models/Doctor');
const Patient      = require('../models/Patient');
const Appointment  = require('../models/Appointment');
const { createError } = require('../utils/createError');

// GET /api/admin/stats
const getStats = async (req, res) => {
  const [totalPatients, totalDoctors, totalAppointments,
         pendingDoctors, pendingAppointments] = await Promise.all([
    User.countDocuments({ role: 'patient', isActive: true }),
    User.countDocuments({ role: 'doctor',  isActive: true }),
    Appointment.countDocuments(),
    Doctor.countDocuments({ isVerified: false }),
    Appointment.countDocuments({ status: 'pending' }),
  ]);

  res.json({ success: true, stats: {
    totalPatients, totalDoctors, totalAppointments,
    pendingDoctors, pendingAppointments,
  }});
};

// GET /api/admin/users?role=patient|doctor
const getUsers = async (req, res) => {
  const { role, page = 1, limit = 20 } = req.query;
  const query = role ? { role } : {};
  const skip  = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    User.countDocuments(query),
  ]);
  res.json({ success: true, users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
};

// GET /api/admin/doctors
const getDoctors = async (req, res) => {
  const { verified } = req.query;
  const query = {};
  if (verified === 'false') query.isVerified = false;
  if (verified === 'true')  query.isVerified = true;
  const doctors = await Doctor.find(query)
    .populate('user', 'name email phone isActive createdAt')
    .sort({ createdAt: -1 });
  res.json({ success: true, doctors });
};

// PUT /api/admin/doctors/:id/verify — Toggle verification
const verifyDoctor = async (req, res, next) => {
  const doctor = await Doctor.findByIdAndUpdate(
    req.params.id,
    { isVerified: req.body.isVerified },
    { new: true }
  ).populate('user', 'name email');
  if (!doctor) return next(createError(404, 'Doctor not found'));
  res.json({ success: true, message: `Doctor ${doctor.isVerified ? 'verified' : 'unverified'}`, doctor });
};

// PUT /api/admin/users/:id/toggle-active — Activate / deactivate
const toggleUserActive = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: req.body.isActive },
    { new: true }
  ).select('-password');
  if (!user) return next(createError(404, 'User not found'));
  res.json({ success: true, user });
};

// GET /api/admin/appointments
const getAppointments = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = status ? { status } : {};
  const skip  = (Number(page) - 1) * Number(limit);
  const [appointments, total] = await Promise.all([
    Appointment.find(query)
      .populate('patient', 'name email')
      .populate('doctor',  'name email')
      .populate('doctorProfile', 'specialization')
      .sort({ date: -1 }).skip(skip).limit(Number(limit)),
    Appointment.countDocuments(query),
  ]);
  res.json({ success: true, appointments, total });
};

module.exports = { getStats, getUsers, getDoctors, verifyDoctor, toggleUserActive, getAppointments };
