require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const connectDB     = require('./config/db');
const errorHandler  = require('./middleware/errorHandler');

// Routes
const healthRoutes       = require('./routes/healthRoutes');
const authRoutes         = require('./routes/authRoutes');
const doctorRoutes       = require('./routes/doctorRoutes');
const appointmentRoutes  = require('./routes/appointmentRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const reportRoutes       = require('./routes/reportRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const chatbotRoutes      = require('./routes/chatbotRoutes');
const adminRoutes        = require('./routes/adminRoutes');

connectDB();

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_URL
    : 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/health',        healthRoutes);
app.use('/api/auth',          authRoutes);
app.use('/api/doctors',       doctorRoutes);
app.use('/api/appointments',  appointmentRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/reports',       reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chatbot',       chatbotRoutes);
app.use('/api/admin',         adminRoutes);

app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
});
