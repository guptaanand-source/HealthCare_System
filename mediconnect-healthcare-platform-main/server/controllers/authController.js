const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { createError } = require('../utils/createError');

/**
 * generateToken — creates a signed JWT
 *
 * Payload contains only the user's _id (minimal).
 * The full user record is fetched from DB in protect middleware.
 * This way, if a user is deactivated, the token stops working on next request.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * buildUserResponse — constructs the safe user object returned to the client.
 * Never includes password or internal flags.
 */
const buildUserResponse = (user) => ({
  _id:      user._id,
  name:     user.name,
  email:    user.email,
  role:     user.role,
  phone:    user.phone || null,
  avatar:   user.avatar || null,
  isActive: user.isActive,
  createdAt:user.createdAt,
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/auth/register
// @desc    Register a new patient or doctor
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const register = async (req, res, next) => {
  const { name, email, password, role, phone, ...profileData } = req.body;

  // 1. Validate required fields
  if (!name || !email || !password) {
    return next(createError(400, 'Name, email, and password are required'));
  }

  // 2. Only allow patient and doctor registration via this endpoint
  //    Admin accounts must be created directly in MongoDB
  if (role && !['patient', 'doctor'].includes(role)) {
    return next(createError(400, 'Invalid role. Must be patient or doctor'));
  }

  const userRole = role || 'patient';

  // 3. Doctor-specific required fields
  if (userRole === 'doctor') {
    if (!profileData.specialization || !profileData.qualification || profileData.experience === undefined) {
      return next(createError(400, 'Doctors must provide specialization, qualification, and experience'));
    }
  }

  // 4. Create user (password hashed by pre-save hook in User model)
  const user = await User.create({
    name,
    email,
    password,
    role: userRole,
    phone: phone || undefined,
  });

  // 5. Create the corresponding profile document
  if (userRole === 'patient') {
    await Patient.create({ user: user._id });
  } else if (userRole === 'doctor') {
    await Doctor.create({
      user:           user._id,
      specialization: profileData.specialization,
      qualification:  profileData.qualification,
      experience:     Number(profileData.experience),
      hospital:       profileData.hospital || '',
      bio:            profileData.bio || '',
      consultationFee: Number(profileData.consultationFee) || 0,
      isVerified:     false, // must be approved by admin
    });
  }

  // 6. Issue JWT
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: `${userRole === 'doctor' ? 'Doctor account created. Pending admin verification.' : 'Registration successful. Welcome!'}`,
    token,
    user: buildUserResponse(user),
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/auth/login
// @desc    Login with email and password
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createError(400, 'Email and password are required'));
  }

  // select('+password') because password has select:false in the schema
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

  if (!user) {
    // Use a generic message — don't reveal whether email exists
    return next(createError(401, 'Invalid email or password'));
  }

  if (!user.isActive) {
    return next(createError(401, 'Your account has been deactivated. Please contact support.'));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(createError(401, 'Invalid email or password'));
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: buildUserResponse(user),
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/auth/me
// @desc    Get the currently logged-in user
// @access  Protected (requires JWT)
// ─────────────────────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  // req.user is set by the protect middleware
  // It already queried the DB, so no extra query needed
  res.json({
    success: true,
    user: buildUserResponse(req.user),
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/auth/me/patient-profile
// @desc    Get the extended patient profile for the logged in user
// @access  Protected (Patient)
// ─────────────────────────────────────────────────────────────────────────────
const getPatientProfile = async (req, res, next) => {
  const patient = await Patient.findOne({ user: req.user._id });
  if (!patient) return next(createError(404, 'Patient profile not found'));
  res.json({ success: true, patient, user: buildUserResponse(req.user) });
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   PUT /api/auth/me/patient-profile
// @desc    Update extended patient profile
// @access  Protected (Patient)
// ─────────────────────────────────────────────────────────────────────────────
const updatePatientProfile = async (req, res, next) => {
  const { name, phone, dateOfBirth, gender, bloodGroup, address, allergies, chronicConditions } = req.body;

  // Update base User
  if (name || phone) {
    await User.findByIdAndUpdate(req.user._id, {
      ...(name && { name }),
      ...(phone !== undefined && { phone }),
    });
  }

  // Update Patient document
  const patient = await Patient.findOneAndUpdate(
    { user: req.user._id },
    {
      ...(dateOfBirth !== undefined && { dateOfBirth }),
      ...(gender !== undefined && { gender }),
      ...(bloodGroup !== undefined && { bloodGroup }),
      ...(address !== undefined && { address }),
      ...(allergies !== undefined && { allergies }),
      ...(chronicConditions !== undefined && { chronicConditions }),
    },
    { new: true, runValidators: true }
  );

  const updatedUser = await User.findById(req.user._id);

  res.json({
    success: true,
    patient,
    user: buildUserResponse(updatedUser),
  });
};

module.exports = { register, login, getMe, getPatientProfile, updatePatientProfile };
