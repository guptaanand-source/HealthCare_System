const Prescription = require('../models/Prescription');
const Consultation = require('../models/Consultation');
const Notification = require('../models/Notification');
const { createError } = require('../utils/createError');

const notify = async (userId, type, title, message, link = null) => {
  try { await Notification.create({ user: userId, type, title, message, link }); } catch {}
};

// POST /api/prescriptions — Doctor creates
const createPrescription = async (req, res, next) => {
  const { consultationId, medicines, additionalInstructions, validUntil } = req.body;

  const consultation = await Consultation.findById(consultationId);
  if (!consultation) return next(createError(404, 'Consultation not found'));
  if (consultation.doctor.toString() !== req.user._id.toString())
    return next(createError(403, 'Not your consultation'));
  if (!medicines || medicines.length === 0)
    return next(createError(400, 'At least one medicine is required'));

  const prescription = await Prescription.create({
    consultation: consultationId,
    appointment:  consultation.appointment,
    patient:      consultation.patient,
    doctor:       req.user._id,
    medicines,
    additionalInstructions: additionalInstructions || '',
    validUntil: validUntil || null,
  });

  await notify(
    consultation.patient,
    'prescription_ready',
    'New prescription available',
    'Your doctor has issued a prescription. View it in your prescriptions.',
    `/patient/prescriptions/${prescription._id}`
  );

  res.status(201).json({ success: true, prescription });
};

// GET /api/prescriptions/my — Patient views theirs
const getMyPrescriptions = async (req, res) => {
  const prescriptions = await Prescription.find({ patient: req.user._id })
    .populate('doctor', 'name avatar')
    .populate({ path: 'appointment', populate: { path: 'doctorProfile', select: 'specialization hospital' } })
    .sort({ createdAt: -1 });
  res.json({ success: true, prescriptions });
};

// GET /api/prescriptions/:id
const getPrescriptionById = async (req, res, next) => {
  const prescription = await Prescription.findById(req.params.id)
    .populate('doctor', 'name email avatar')
    .populate('patient', 'name')
    .populate({ path: 'appointment', populate: { path: 'doctorProfile', select: 'specialization hospital qualification' } });

  if (!prescription) return next(createError(404, 'Prescription not found'));

  const isOwner =
    prescription.patient._id.toString() === req.user._id.toString() ||
    prescription.doctor._id.toString()  === req.user._id.toString() ||
    req.user.role === 'admin';
  if (!isOwner) return next(createError(403, 'Not authorized'));

  res.json({ success: true, prescription });
};

// GET /api/prescriptions/consultation/:consultationId
const getPrescriptionByConsultation = async (req, res, next) => {
  const prescription = await Prescription.findOne({ consultation: req.params.consultationId })
    .populate('doctor', 'name avatar')
    .populate('patient', 'name');

  if (!prescription) return res.json({ success: true, prescription: null });

  const isOwner =
    prescription.patient._id.toString() === req.user._id.toString() ||
    prescription.doctor._id.toString()  === req.user._id.toString();
  if (!isOwner) return next(createError(403, 'Not authorized'));

  res.json({ success: true, prescription });
};

module.exports = { createPrescription, getMyPrescriptions, getPrescriptionById, getPrescriptionByConsultation };
