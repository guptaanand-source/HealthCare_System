const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    patient:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    uploadedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', default: null },

    title:    { type: String, required: true, trim: true },
    type:     { type: String, enum: ['lab', 'radiology', 'prescription', 'other'], default: 'other' },
    notes:    { type: String, trim: true },

    // File stored on disk via multer; only metadata in MongoDB
    fileUrl:  { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number },
    mimeType: { type: String },
  },
  { timestamps: true }
);

reportSchema.index({ patient: 1, createdAt: -1 });

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
