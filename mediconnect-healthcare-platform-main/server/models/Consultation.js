const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema(
  {
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true, unique: true },
    patient:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    chiefComplaint: { type: String, trim: true },
    symptoms:       { type: [String], default: [] },
    diagnosis:      { type: String, trim: true },
    clinicalNotes:  { type: String, trim: true },

    vitals: {
      bloodPressure: { type: String, trim: true },
      pulse:         { type: String, trim: true },
      temperature:   { type: String, trim: true },
      weight:        { type: String, trim: true },
      height:        { type: String, trim: true },
    },

    followUpDate:  { type: Date,   default: null },
    followUpNotes: { type: String, trim: true },
  },
  { timestamps: true }
);

const Consultation = mongoose.model('Consultation', consultationSchema);
module.exports = Consultation;
