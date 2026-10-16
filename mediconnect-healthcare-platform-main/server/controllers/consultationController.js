const Consultation  = require('../models/Consultation');
const Appointment   = require('../models/Appointment');
const Notification  = require('../models/Notification');
const { createError } = require('../utils/createError');

const notify = async (userId, type, title, message, link = null) => {
  try { await Notification.create({ user: userId, type, title, message, link }); } catch {}
};

// POST /api/consultations — Doctor creates/updates consultation for an appointment
const createConsultation = async (req, res, next) => {
  const { appointmentId, chiefComplaint, symptoms, diagnosis, clinicalNotes, vitals, followUpDate, followUpNotes } = req.body;

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) return next(createError(404, 'Appointment not found'));
  if (appointment.doctor.toString() !== req.user._id.toString())
    return next(createError(403, 'Not your appointment'));

  // Upsert: one consultation per appointment
  const consultation = await Consultation.findOneAndUpdate(
    { appointment: appointmentId },
    {
      appointment: appointmentId,
      patient: appointment.patient,
      doctor:  req.user._id,
      chiefComplaint, symptoms: symptoms || [],
      diagnosis, clinicalNotes, vitals: vitals || {},
      followUpDate: followUpDate || null,
      followUpNotes,
    },
    { new: true, upsert: true, runValidators: true }
  );

  // Mark appointment completed
  appointment.status = 'completed';
  await appointment.save();

  await notify(
    appointment.patient,
    'appointment_completed',
    'Consultation completed',
    'Your doctor has completed the consultation. View your consultation notes.',
    `/patient/medical-records`
  );

  res.status(201).json({ success: true, consultation });
};

// GET /api/consultations/appointment/:appointmentId
const getConsultation = async (req, res, next) => {
  const consultation = await Consultation.findOne({ appointment: req.params.appointmentId })
    .populate('doctor', 'name avatar')
    .populate('patient', 'name avatar');

  if (!consultation) return next(createError(404, 'Consultation not found'));

  const isOwner =
    consultation.patient._id.toString() === req.user._id.toString() ||
    consultation.doctor._id.toString()  === req.user._id.toString() ||
    req.user.role === 'admin';
  if (!isOwner) return next(createError(403, 'Not authorized'));

  res.json({ success: true, consultation });
};

// GET /api/consultations/patient/:patientId — Doctor views patient history
const getPatientConsultations = async (req, res, next) => {
  // Only the patient themselves or a doctor can view
  if (req.user.role === 'patient' && req.params.patientId !== req.user._id.toString())
    return next(createError(403, 'Not authorized'));

  const consultations = await Consultation.find({ patient: req.params.patientId })
    .populate('doctor', 'name avatar')
    .populate('appointment', 'date slot type')
    .sort({ createdAt: -1 });

  res.json({ success: true, consultations });
};

// GET /api/consultations/my — Patient gets all their consultations
const getMyConsultations = async (req, res) => {
  const consultations = await Consultation.find({ patient: req.user._id })
    .populate('doctor', 'name avatar')
    .populate('appointment', 'date slot type')
    .populate({ path: 'appointment', populate: { path: 'doctorProfile', select: 'specialization hospital' } })
    .sort({ createdAt: -1 });

  res.json({ success: true, consultations });
};

module.exports = { createConsultation, getConsultation, getPatientConsultations, getMyConsultations };
