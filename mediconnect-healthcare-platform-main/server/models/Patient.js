const mongoose = require('mongoose');

/**
 * Patient model — extended profile for users with role='patient'.
 *
 * One-to-one relationship with User.
 * Created automatically when a user registers as a patient.
 *
 * Why separate from User?
 *   The User model handles auth (email/password/role).
 *   The Patient model handles health-specific data.
 *   This keeps concerns separated and the User model clean.
 */
const patientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // one Patient per User
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say'],
      default: 'prefer-not-to-say',
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'],
      default: 'unknown',
    },
    address: {
      street: { type: String, trim: true },
      city:   { type: String, trim: true },
      state:  { type: String, trim: true },
      pincode:{ type: String, trim: true },
    },
    emergencyContact: {
      name:         { type: String, trim: true },
      relationship: { type: String, trim: true },
      phone:        { type: String, trim: true },
    },
    // Medical background — filled in by patient over time
    allergies:         { type: [String], default: [] },
    chronicConditions: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
