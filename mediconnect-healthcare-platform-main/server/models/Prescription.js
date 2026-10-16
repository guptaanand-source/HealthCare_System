const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  dosage:       { type: String, trim: true },   // "500mg"
  frequency:    { type: String, trim: true },   // "Twice daily"
  duration:     { type: String, trim: true },   // "7 days"
  instructions: { type: String, trim: true },   // "After food"
}, { _id: false });

const prescriptionSchema = new mongoose.Schema(
  {
    consultation: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation', required: true },
    appointment:  { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment',  required: true },
    patient:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    medicines:    { type: [medicineSchema], default: [] },
    additionalInstructions: { type: String, trim: true },
    validUntil:   { type: Date, default: null },
  },
  { timestamps: true }
);

prescriptionSchema.index({ patient: 1, createdAt: -1 });

const Prescription = mongoose.model('Prescription', prescriptionSchema);
module.exports = Prescription;
