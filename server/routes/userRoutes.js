import express from 'express'
import {
  getProfile,
  updateProfile,
  getCredits,
  getAchievements,
  deleteAccount,
  getAllUsers,
  getUserById,
  adminUpdateUser,
  adminDeleteUser,
} from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

/* ──────────────────────────────────────────────
   Self-service routes  (any authenticated user)
────────────────────────────────────────────── */

// GET  /api/users/profile   → get own profile
router.get('/profile', protect, getProfile)

// PUT  /api/users/profile   → update own name / photoUrl
router.put('/profile', protect, updateProfile)

// GET  /api/users/credits   → get own credit balance
router.get('/credits', protect, getCredits)

// GET  /api/users/achievements → get own achievements
router.get('/achievements', protect, getAchievements)

// DELETE /api/users/account → delete own account
router.delete('/account', protect, deleteAccount)

/* ──────────────────────────────────────────────
   Admin-only routes
   (protect only for now — add an isAdmin guard
    middleware here when role-based access is needed)
────────────────────────────────────────────── */

// GET  /api/users           → paginated list of all users
router.get('/', protect, getAllUsers)

// GET  /api/users/:id       → single user by id
router.get('/:id', protect, getUserById)

// PUT  /api/users/:id       → admin update (name, role, credits …)
router.put('/:id', protect, adminUpdateUser)

// DELETE /api/users/:id     → admin hard-delete
router.delete('/:id', protect, adminDeleteUser)

export default router
