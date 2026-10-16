const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User model — the central authentication record.
 *
 * Every person in the system (patient, doctor, admin) has exactly ONE User document.
 * Extended profile data lives in the Patient or Doctor collection (one-to-one reference).
 *
 * Fields:
 *   name     — full name
 *   email    — unique, used as login credential
 *   password — bcrypt hash (NEVER store plain text)
 *   role     — determines what the user can access
 *   phone    — optional contact number
 *   avatar   — URL to profile picture (optional)
 *   isActive — admin can deactivate accounts without deleting
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // NEVER return password in queries by default
    },
    role: {
      type: String,
      enum: {
        values: ['patient', 'doctor', 'admin'],
        message: 'Role must be patient, doctor, or admin',
      },
      default: 'patient',
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[0-9+\-\s()]{7,15}$/, 'Please enter a valid phone number'],
    },
    avatar: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// ── Indexes ─────────────────────────────────────────────────────────────────
// email is already indexed because unique:true creates an index.
// Adding role index because we'll frequently query "all doctors" etc.
userSchema.index({ role: 1 });

// ── Pre-save hook: hash password before saving ───────────────────────────────
// This runs every time a user document is saved.
// We only re-hash if the password field was actually changed.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Salt rounds: 12 is a good balance of security vs. performance
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance method: compare password ───────────────────────────────────────
// Usage: const isMatch = await user.comparePassword(plainTextPassword)
// We need select('+password') when fetching the user for login.
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
