import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,   // allows non-Google users to have no firebaseUid
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    photoUrl: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['student', 'professional', 'admin'],
      default: 'student',
    },
    plan: {
      type: String,
      enum: ['Explorer', 'Starter', 'Pro', 'Ultra'],
      default: 'Explorer',
    },
    credits: {
      type: Number,
      default: 100,
    },
    provider: {
      type: String,
      enum: ['google', 'email'],
      default: 'google',
    },
    achievements: [{
      id: String,
      title: String,
      description: String,
      icon: String, // Icon name for Lucide
      progress: { type: Number, default: 0 },
      target: { type: Number, default: 0 },
      status: { type: String, enum: ['locked', 'in-progress', 'unlocked'], default: 'locked' },
      reward: String,
      unlockedAt: Date
    }],
    level: {
      type: Number,
      default: 1
    },
    xp: {
      type: Number,
      default: 0
    },
    streak: {
      type: Number,
      default: 0
    },
    lastActivityAt: Date
  },
  { timestamps: true }
)

// Generate a short-lived access token (7 days)
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  )
}

const User = mongoose.model('User', userSchema)
export default User
