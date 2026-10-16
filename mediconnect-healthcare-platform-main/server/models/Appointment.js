const mongoose = require('mongoose');

/**
 * Appointment model
 *
 * Core booking record linking a patient to a doctor at a specific date/slot.
 * Compound index on (doctor, date, slot.startTime) prevents double booking.
 */
const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },

    date: { type: String, required: true }, // "YYYY-MM-DD"
    slot: {
      startTime: { type: String, required: true }, // "09:00"
      endTime:   { type: String, required: true }, // "09:30"
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
      default: 'pending',
    },
    type: {
      type: String,
      enum: ['first-visit', 'follow-up'],
      default: 'first-visit',
    },

    reason: { type: String, trim: true, maxlength: 500 },
    notes:  { type: String, trim: true },           // patient-side notes
    cancellationReason: { type: String, trim: true },
  },
  { timestamps: true }
);

// Prevent double booking: same doctor + same date + same slot
appointmentSchema.index({ doctor: 1, date: 1, 'slot.startTime': 1 }, { unique: true });
appointmentSchema.index({ patient: 1, status: 1 });
appointmentSchema.index({ doctor: 1, date: 1, status: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
