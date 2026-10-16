const Appointment = require('../models/Appointment');
const Doctor      = require('../models/Doctor');
const Notification = require('../models/Notification');
const { createError } = require('../utils/createError');

// Helper: create a notification
const notify = async (userId, type, title, message, link = null) => {
  try {
    await Notification.create({ user: userId, type, title, message, link });
  } catch (e) { /* non-critical — don't fail the main operation */ }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/appointments
// @access  Patient
// ─────────────────────────────────────────────────────────────────────────────
const bookAppointment = async (req, res, next) => {
  const { doctorId, date, slot, type, reason } = req.body;

  if (!doctorId || !date || !slot?.startTime || !slot?.endTime)
    return next(createError(400, 'doctorId, date, and slot are required'));

  // Verify doctor exists and is verified
  const doctorProfile = await Doctor.findById(doctorId).populate('user', '_id name');
  if (!doctorProfile || !doctorProfile.isVerified)
    return next(createError(404, 'Doctor not found'));

  // Check for duplicate booking (unique index also enforces this)
  const existing = await Appointment.findOne({
    doctor: doctorProfile.user._id,
    date,
    'slot.startTime': slot.startTime,
    status: { $nin: ['cancelled'] },
  });
  if (existing) return next(createError(409, 'This time slot is already booked. Please choose another.'));

  const appointment = await Appointment.create({
    patient:      req.user._id,
    doctor:       doctorProfile.user._id,
    doctorProfile: doctorProfile._id,
    date,
    slot,
    type:   type || 'first-visit',
    reason: reason || '',
    status: 'pending',
  });

  // Notify doctor
  await notify(
    doctorProfile.user._id,
    'appointment_booked',
    'New appointment request',
    `${req.user.name} has requested an appointment on ${date} at ${slot.startTime}`,
    `/doctor/appointments/${appointment._id}`
  );

  res.status(201).json({ success: true, message: 'Appointment booked successfully', appointment });
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/appointments/my
// @access  Patient | Doctor
// ─────────────────────────────────────────────────────────────────────────────
const getMyAppointments = async (req, res) => {
  const { status, upcoming } = req.query;
  const isDoctor = req.user.role === 'doctor';

  const query = isDoctor ? { doctor: req.user._id } : { patient: req.user._id };
  if (status) query.status = status;

  // upcoming = only future dates
  if (upcoming === 'true') {
    const today = new Date().toISOString().slice(0, 10);
    query.date = { $gte: today };
    query.status = { $in: ['pending', 'confirmed'] };
  }

  const appointments = await Appointment.find(query)
    .populate('patient', 'name email phone avatar')
    .populate('doctor',  'name email avatar')
    .populate('doctorProfile', 'specialization hospital consultationFee')
    .sort({ date: 1, 'slot.startTime': 1 })
    .lean();

  res.json({ success: true, appointments });
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/appointments/:id
// @access  Patient (own) | Doctor (own)
// ─────────────────────────────────────────────────────────────────────────────
const getAppointmentById = async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('patient', 'name email phone avatar')
    .populate('doctor',  'name email avatar')
    .populate('doctorProfile', 'specialization hospital consultationFee qualification experience');

  if (!appointment) return next(createError(404, 'Appointment not found'));

  // Only the patient or doctor involved can view
  const isOwner =
    appointment.patient._id.toString() === req.user._id.toString() ||
    appointment.doctor._id.toString()  === req.user._id.toString() ||
    req.user.role === 'admin';

  if (!isOwner) return next(createError(403, 'Not authorized to view this appointment'));

  res.json({ success: true, appointment });
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   PUT /api/appointments/:id/status
// @access  Doctor (confirm/complete/cancel) | Patient (cancel/reschedule)
// ─────────────────────────────────────────────────────────────────────────────
const updateAppointmentStatus = async (req, res, next) => {
  const { status, cancellationReason, newDate, newSlot } = req.body;
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return next(createError(404, 'Appointment not found'));

  const isDoctor  = appointment.doctor.toString() === req.user._id.toString();
  const isPatient = appointment.patient.toString() === req.user._id.toString();
  if (!isDoctor && !isPatient && req.user.role !== 'admin')
    return next(createError(403, 'Not authorized'));

  // Role-based status transitions
  const allowedByDoctor  = ['confirmed', 'completed', 'cancelled'];
  const allowedByPatient = ['cancelled', 'rescheduled'];

  if (isDoctor  && !allowedByDoctor.includes(status))
    return next(createError(400, 'Doctors can only confirm, complete or cancel'));
  if (isPatient && !allowedByPatient.includes(status))
    return next(createError(400, 'Patients can only cancel or reschedule'));

  appointment.status = status;
  if (cancellationReason) appointment.cancellationReason = cancellationReason;

  // Handle reschedule
  if (status === 'rescheduled' && newDate && newSlot) {
    appointment.date = newDate;
    appointment.slot = newSlot;
    appointment.status = 'pending'; // goes back to pending after reschedule
  }

  await appointment.save();

  // Notify the other party
  const notifyUserId = isDoctor ? appointment.patient : appointment.doctor;
  const notifyType   = status === 'confirmed'   ? 'appointment_confirmed'
                     : status === 'cancelled'   ? 'appointment_cancelled'
                     : status === 'completed'   ? 'appointment_completed'
                     : 'general';

  await notify(
    notifyUserId,
    notifyType,
    `Appointment ${status}`,
    `Your appointment on ${appointment.date} at ${appointment.slot.startTime} has been ${status}.`,
    `/patient/appointments/${appointment._id}`
  );

  res.json({ success: true, message: `Appointment ${status}`, appointment });
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/appointments/slots/:doctorId/:date
// @desc    Get available slots for a doctor on a date
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getAvailableSlots = async (req, res, next) => {
  const { doctorId, date } = req.params;

  const doctorProfile = await Doctor.findById(doctorId);
  if (!doctorProfile) return next(createError(404, 'Doctor not found'));

  // Get the day name from the date.
  // Append T12:00:00 to avoid UTC-to-local day shift (e.g. in IST UTC+5:30)
  const dayName = new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' });
  const dayConfig = doctorProfile.availability.find((d) => d.day === dayName);

  if (!dayConfig || dayConfig.slots.length === 0) {
    return res.json({ success: true, slots: [], message: 'No availability on this day' });
  }

  // Find already booked slots on this date
  const bookedAppointments = await Appointment.find({
    doctorProfile: doctorId,
    date,
    status: { $nin: ['cancelled'] },
  }).select('slot');

  const bookedTimes = new Set(bookedAppointments.map((a) => a.slot.startTime));

  const availableSlots = dayConfig.slots.filter((s) => !bookedTimes.has(s.startTime));

  res.json({ success: true, slots: availableSlots, date, day: dayName });
};

module.exports = { bookAppointment, getMyAppointments, getAppointmentById, updateAppointmentStatus, getAvailableSlots };
