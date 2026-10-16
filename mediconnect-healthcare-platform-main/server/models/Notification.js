const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['appointment_booked','appointment_confirmed','appointment_cancelled',
             'appointment_completed','prescription_ready','followup_reminder','general'],
      default: 'general',
    },
    title:   { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    isRead:  { type: Boolean, default: false },
    link:    { type: String, default: null }, // frontend route to navigate to
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
