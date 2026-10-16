const mongoose = require('mongoose');

/**
 * Doctor model — extended profile for users with role='doctor'.
 *
 * One-to-one relationship with User.
 * Created automatically when a doctor registers.
 *
 * Key concept — availability:
 *   A doctor defines their weekly schedule as an array of day configs.
 *   Each day has a list of time slots (e.g. 09:00–09:30, 09:30–10:00).
 *   When a patient books a slot, that slot is marked isBooked=true.
 *
 * isVerified:
 *   Doctors start as unverified. Admin must approve them.
 *   Unverified doctors won't appear in patient search results.
 */
const timeSlotSchema = new mongoose.Schema(
  {
    startTime: { type: String, required: true }, // "09:00"
    endTime:   { type: String, required: true }, // "09:30"
    isBooked:  { type: Boolean, default: false },
  },
  { _id: true }
);

const availabilityDaySchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    },
    slots: [timeSlotSchema],
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
    },
    qualification: {
      type: String,
      required: [true, 'Qualification is required'],
      trim: true,
      // e.g. "MBBS, MD (Cardiology)"
    },
    experience: {
      type: Number, // years of experience
      required: [true, 'Experience is required'],
      min: [0, 'Experience cannot be negative'],
    },
    hospital: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    consultationFee: {
      type: Number,
      default: 0,
      min: [0, 'Fee cannot be negative'],
    },
    availability: [availabilityDaySchema],

    // Admin must approve before doctor appears in search
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for common search queries
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ isVerified: 1 });

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
