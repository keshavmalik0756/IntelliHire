import express from 'express'
import { googleSignIn, getMe, logout } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// POST /api/auth/google   — exchange Firebase ID token for app JWT
router.post('/google', googleSignIn)

// GET  /api/auth/me       — return authenticated user's profile
router.get('/me', protect, getMe)

// POST /api/auth/logout   — server-side logout acknowledgement
router.post('/logout', protect, logout)

export default router

