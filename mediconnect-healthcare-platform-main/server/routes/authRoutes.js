const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const { register, login, getMe, getPatientProfile, updatePatientProfile } = require('../controllers/authController');
const protect = require('../middleware/protect');
const authorize = require('../middleware/authorize');

// ── Avatar Upload (Multer) ────────────────────────────────────────────────────
const avatarDir = path.join(__dirname, '..', 'uploads', 'avatars');
if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir, { recursive: true });

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `avatar-${req.user._id}${ext}`);
  },
});
const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only JPG, PNG, WEBP images are allowed'));
  },
});

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/me/patient-profile', protect, authorize('patient'), getPatientProfile);
router.put('/me/patient-profile', protect, authorize('patient'), updatePatientProfile);

// POST /api/auth/upload-avatar
router.post('/upload-avatar', protect, avatarUpload.single('avatar'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: avatarUrl }, { new: true });
    res.json({ success: true, avatarUrl, user: {
      _id: user._id, name: user.name, email: user.email,
      role: user.role, phone: user.phone, avatar: user.avatar, isActive: user.isActive
    }});
  } catch (err) { next(err); }
});

module.exports = router;
