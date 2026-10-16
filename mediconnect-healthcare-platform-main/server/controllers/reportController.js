const multer = require('multer');
const path   = require('path');
const fs     = require('fs');
const Report = require('../models/Report');
const { createError } = require('../utils/createError');

// ── Multer configuration ─────────────────────────────────────────────────────
const uploadDir = path.join(__dirname, '..', 'uploads', 'reports');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname);
    const safe = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, safe);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only PDF, images (JPG/PNG) and Word documents are allowed'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

// POST /api/reports — Patient uploads a report
const uploadReport = [
  upload.single('file'),
  async (req, res, next) => {
    if (!req.file) return next(createError(400, 'No file uploaded'));
    const { title, type, notes, appointmentId } = req.body;
    if (!title) return next(createError(400, 'Report title is required'));

    const fileUrl = `/uploads/reports/${req.file.filename}`;
    const report = await Report.create({
      patient:     req.user._id,
      uploadedBy:  req.user._id,
      appointment: appointmentId || null,
      title:    title.trim(),
      type:     type || 'other',
      notes:    notes || '',
      fileUrl,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });

    res.status(201).json({ success: true, report });
  },
];

// GET /api/reports/my — Patient gets their reports
const getMyReports = async (req, res) => {
  const reports = await Report.find({ patient: req.user._id })
    .populate('appointment', 'date slot')
    .sort({ createdAt: -1 });
  res.json({ success: true, reports });
};

// GET /api/reports/patient/:patientId — Doctor views patient reports
const getPatientReports = async (req, res, next) => {
  if (req.user.role === 'patient' && req.params.patientId !== req.user._id.toString())
    return next(createError(403, 'Not authorized'));

  const reports = await Report.find({ patient: req.params.patientId })
    .sort({ createdAt: -1 });
  res.json({ success: true, reports });
};

// DELETE /api/reports/:id — Patient deletes their own report
const deleteReport = async (req, res, next) => {
  const report = await Report.findById(req.params.id);
  if (!report) return next(createError(404, 'Report not found'));
  if (report.patient.toString() !== req.user._id.toString())
    return next(createError(403, 'Not authorized'));

  // Remove file from disk
  const filePath = path.join(__dirname, '..', report.fileUrl);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  await report.deleteOne();
  res.json({ success: true, message: 'Report deleted' });
};

module.exports = { uploadReport, getMyReports, getPatientReports, deleteReport };
