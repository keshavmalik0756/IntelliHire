import asyncHandler from 'express-async-handler'
import admin from '../firebase/admin.js'
import User from '../models/User.js'

/* ─────────────────────────────────────────────────────────────────────────────
   POST /api/auth/google
   Body: { idToken: <Firebase ID token from client> }
   1. Verify Firebase ID token  →  get uid, name, email, picture
   2. Upsert user in MongoDB    →  create if new, sync photo/uid if changed
   3. Issue our own JWT         →  return token + user object
───────────────────────────────────────────────────────────────────────────── */
export const googleSignIn = asyncHandler(async (req, res) => {
  const { idToken } = req.body

  if (!idToken) {
    res.status(400)
    throw new Error('idToken is required')
  }

  // 1 — Verify Firebase ID token server-side
  let decoded
  try {
    decoded = await admin.auth().verifyIdToken(idToken)
  } catch (err) {
    res.status(401)
    throw new Error('Invalid or expired Firebase token')
  }

  const { uid, name, email, picture } = decoded

  // 2 — Upsert user
  let user = await User.findOne({ email })

  if (user) {
    let changed = false
    if (picture && user.photoUrl !== picture) { user.photoUrl = picture; changed = true }
    if (uid && user.firebaseUid !== uid) { user.firebaseUid = uid; changed = true }
    if (changed) await user.save()
  } else {
    user = await User.create({
      firebaseUid: uid,
      name: name || email.split('@')[0],
      email,
      photoUrl: picture || '',
      provider: 'google',
    })
  }

  // 3 — Issue short-lived app JWT
  const token = user.generateAccessToken()

  res.status(200).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl,
      role: user.role,
      credits: user.credits,
    },
  })
})

/* ─────────────────────────────────────────────────────────────────────────────
   GET /api/auth/me  (protected — requires Bearer JWT)
   Returns the authenticated user's full profile from MongoDB.
───────────────────────────────────────────────────────────────────────────── */
export const getMe = asyncHandler(async (req, res) => {
  // req.user is populated by the protect middleware
  const { _id, name, email, photoUrl, role, credits, provider, createdAt } = req.user

  res.json({
    success: true,
    user: { _id, name, email, photoUrl, role, credits, provider, createdAt },
  })
})

/* ─────────────────────────────────────────────────────────────────────────────
   POST /api/auth/logout  (protected — requires Bearer JWT)
   JWTs are stateless — actual session removal happens on the client by
   deleting the token from localStorage.
   This endpoint provides a clean server acknowledgement and a hook for
   future token revocation (e.g. a Redis blacklist).
───────────────────────────────────────────────────────────────────────────── */
export const logout = asyncHandler(async (req, res) => {
  // Future: add req.token to a blacklist/revocation store here

  res.status(200).json({
    success: true,
    message: 'Logged out successfully. Please remove the token on the client.',
  })
})

