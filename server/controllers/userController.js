import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import achievementService from '../services/achievement.service.js'

/* ─────────────────────────────────────────────────────────────────────────────
   GET /api/users/profile
   Protected — returns the full profile of the currently-authenticated user.
───────────────────────────────────────────────────────────────────────────── */
export const getProfile = asyncHandler(async (req, res) => {
  const user = req.user   // populated by the protect middleware

  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl,
      role: user.role,
      plan: user.plan || 'Explorer',
      credits: user.credits,
      provider: user.provider,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  })
})

/* ─────────────────────────────────────────────────────────────────────────────
   PUT /api/users/profile
   Protected — allows the user to update their own name and/or photoUrl.
   Fields that cannot be changed here: email, role, credits, provider.
───────────────────────────────────────────────────────────────────────────── */
export const updateProfile = asyncHandler(async (req, res) => {
  const user = req.user

  const { name, photoUrl } = req.body

  if (name !== undefined) {
    const trimmed = name.trim()
    if (!trimmed) {
      res.status(400)
      throw new Error('Name cannot be empty')
    }
    user.name = trimmed
  }

  if (photoUrl !== undefined) {
    user.photoUrl = photoUrl.trim()
  }

  const updated = await user.save()

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: {
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      photoUrl: updated.photoUrl,
      role: updated.role,
      plan: updated.plan || 'Explorer',
      credits: updated.credits,
      provider: updated.provider,
      updatedAt: updated.updatedAt,
    },
  })
})

/* ─────────────────────────────────────────────────────────────────────────────
   GET /api/users/credits
   Protected — returns only the user's current credit balance.
───────────────────────────────────────────────────────────────────────────── */
export const getCredits = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    credits: req.user.credits,
  })
})

/* ─────────────────────────────────────────────────────────────────────────────
   DELETE /api/users/account
   Protected — soft-deletes (or hard-deletes) the current user account.
   Currently performs a hard delete. Add a `deletedAt` field to the schema
   and switch to a soft-delete approach when needed.
───────────────────────────────────────────────────────────────────────────── */
export const deleteAccount = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user._id)

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully. We are sorry to see you go!',
  })
})

/* ─────────────────────────────────────────────────────────────────────────────
   GET /api/users          (admin only)
   Returns a paginated list of all users.
   Query params:
     page  — default 1
     limit — default 20 (max 100)
───────────────────────────────────────────────────────────────────────────── */
export const getAllUsers = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20))
  const skip = (page - 1) * limit

  const [users, total] = await Promise.all([
    User.find().select('-__v').sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(),
  ])

  res.status(200).json({
    success: true,
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    users,
  })
})

/* ─────────────────────────────────────────────────────────────────────────────
   GET /api/users/:id   (admin only)
   Returns a single user by MongoDB _id.
───────────────────────────────────────────────────────────────────────────── */
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-__v')

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  res.status(200).json({ success: true, user })
})

/* ─────────────────────────────────────────────────────────────────────────────
   PUT /api/users/:id   (admin only)
   Allows an admin to update any user's name, photoUrl, role, or credits.
───────────────────────────────────────────────────────────────────────────── */
export const adminUpdateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  const { name, photoUrl, role, credits, plan } = req.body

  if (name !== undefined) user.name = name.trim()
  if (photoUrl !== undefined) user.photoUrl = photoUrl.trim()
  if (role !== undefined) {
    const allowed = ['student', 'professional', 'admin']
    if (!allowed.includes(role)) {
      res.status(400)
      throw new Error(`role must be one of: ${allowed.join(', ')}`)
    }
    user.role = role
  }
  if (credits !== undefined) {
    const parsed = Number(credits)
    if (isNaN(parsed) || parsed < 0) {
      res.status(400)
      throw new Error('credits must be a non-negative number')
    }
    user.credits = parsed
  }
  if (plan !== undefined) {
    const allowed = ['Explorer', 'Starter', 'Pro', 'Ultra']
    if (!allowed.includes(plan)) {
      res.status(400)
      throw new Error(`plan must be one of: ${allowed.join(', ')}`)
    }
    user.plan = plan
  }

  const updated = await user.save()

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    user: updated,
  })
})

/* ─────────────────────────────────────────────────────────────────────────────
   DELETE /api/users/:id   (admin only)
   Hard-deletes any user account by MongoDB _id.
───────────────────────────────────────────────────────────────────────────── */
export const adminDeleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  await user.deleteOne()

  res.status(200).json({
    success: true,
    message: `User ${user.email} deleted successfully`,
  })
})
/* ─────────────────────────────────────────────────────────────────────────────
   GET /api/users/achievements
   Protected — returns the user's current achievements and stats.
───────────────────────────────────────────────────────────────────────────── */
export const getAchievements = asyncHandler(async (req, res) => {
  const user = req.user

  // Ensure user has achievements initialized
  if (!user.achievements || user.achievements.length === 0) {
    await achievementService.evaluateAchievements(user._id);
    // Reload user to get updated achievements
    const updatedUser = await User.findById(user._id);
    return res.status(200).json({
      success: true,
      data: {
        achievements: updatedUser.achievements,
        level: updatedUser.level,
        xp: updatedUser.xp,
        streak: updatedUser.streak
      }
    });
  }

  res.status(200).json({
    success: true,
    data: {
      achievements: user.achievements,
      level: user.level,
      xp: user.xp,
      streak: user.streak
    }
  });
})
