const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { createError } = require('../utils/createError');

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/doctors
// @desc    Get all verified doctors with search & filter
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getDoctors = async (req, res) => {
  const { search, specialization, page = 1, limit = 12 } = req.query;

  const query = { isVerified: true };

  if (specialization) query.specialization = specialization;

  // Build aggregation to search across User name + Doctor fields
  const doctors = await Doctor.find(query)
    .populate('user', 'name email phone avatar')
    .sort({ createdAt: -1 })
    .lean();

  // Filter by name search (done in JS since name is in User model)
  let filtered = doctors;
  if (search) {
    const term = search.toLowerCase();
    filtered = doctors.filter(
      (d) =>
        d.user?.name?.toLowerCase().includes(term) ||
        d.specialization?.toLowerCase().includes(term) ||
        d.hospital?.toLowerCase().includes(term)
    );
  }

  // Pagination
  const total = filtered.length;
  const startIndex = (Number(page) - 1) * Number(limit);
  const paginated = filtered.slice(startIndex, startIndex + Number(limit));

  res.json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    doctors: paginated,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/doctors/specializations
// @desc    Get list of all distinct specializations (for filter dropdown)
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getSpecializations = async (req, res) => {
  const specs = await Doctor.distinct('specialization', { isVerified: true });
  res.json({ success: true, specializations: specs.sort() });
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/doctors/:id
// @desc    Get single doctor profile (public)
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getDoctorById = async (req, res, next) => {
  const doctor = await Doctor.findById(req.params.id)
    .populate('user', 'name email phone avatar')
    .lean();

  if (!doctor) return next(createError(404, 'Doctor not found'));
  if (!doctor.isVerified) return next(createError(404, 'Doctor not found'));

  res.json({ success: true, doctor });
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/doctors/profile/me
// @desc    Get logged-in doctor's own profile
// @access  Doctor
// ─────────────────────────────────────────────────────────────────────────────
const getMyProfile = async (req, res, next) => {
  const doctor = await Doctor.findOne({ user: req.user._id })
    .populate('user', 'name email phone avatar')
    .lean();

  if (!doctor) return next(createError(404, 'Doctor profile not found'));
  res.json({ success: true, doctor });
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   PUT /api/doctors/profile/me
// @desc    Update logged-in doctor's professional profile
// @access  Doctor
// ─────────────────────────────────────────────────────────────────────────────
const updateMyProfile = async (req, res, next) => {
  const { specialization, qualification, experience, hospital, bio, consultationFee, name, phone } = req.body;

  // Update User fields (name, phone)
  if (name || phone) {
    await User.findByIdAndUpdate(req.user._id, {
      ...(name && { name }),
      ...(phone && { phone }),
    });
  }

  // Update Doctor fields
  const updatedDoctor = await Doctor.findOneAndUpdate(
    { user: req.user._id },
    {
      ...(specialization && { specialization }),
      ...(qualification  && { qualification }),
      ...(experience !== undefined && { experience: Number(experience) }),
      ...(hospital !== undefined  && { hospital }),
      ...(bio !== undefined       && { bio }),
      ...(consultationFee !== undefined && { consultationFee: Number(consultationFee) }),
    },
    { new: true, runValidators: true }
  ).populate('user', 'name email phone avatar');

  if (!updatedDoctor) return next(createError(404, 'Doctor profile not found'));
  res.json({ success: true, doctor: updatedDoctor });
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   PUT /api/doctors/availability
// @desc    Set/update weekly availability schedule
// @access  Doctor
// ─────────────────────────────────────────────────────────────────────────────
const updateAvailability = async (req, res, next) => {
  const { availability } = req.body;

  if (!Array.isArray(availability)) {
    return next(createError(400, 'Availability must be an array of day configs'));
  }

  const doctor = await Doctor.findOneAndUpdate(
    { user: req.user._id },
    { availability },
    { new: true, runValidators: true }
  );

  if (!doctor) return next(createError(404, 'Doctor profile not found'));
  res.json({ success: true, message: 'Availability updated', availability: doctor.availability });
};

module.exports = { getDoctors, getSpecializations, getDoctorById, getMyProfile, updateMyProfile, updateAvailability };
