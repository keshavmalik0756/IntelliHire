// ─── Firebase Admin SDK ───────────────────────────────────────────────────────
// Used server-side to verify Firebase ID tokens sent from the client.
//
// Option A — Service Account JSON file (recommended for dev):
//   1. Firebase Console → Project Settings → Service Accounts → Generate new private key
//   2. Save as server/firebase/serviceAccountKey.json  (already in .gitignore)
//
// Option B — Environment variable (recommended for production):
//   Set FIREBASE_SERVICE_ACCOUNT_JSON to the stringified JSON in your env.

import admin from 'firebase-admin'
import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

let serviceAccount

// Try loading from env var first (production), then fall back to local file (dev)
if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
} else {
  const keyPath = join(__dirname, 'serviceAccountKey.json')
  if (existsSync(keyPath)) {
    serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'))
  }
}

if (!admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
  } else {
    // Fallback: init without credentials (token verification will fail gracefully)
    console.warn('⚠️  Firebase Admin: no serviceAccountKey.json found. Google auth will not work.')
    admin.initializeApp()
  }
}

export default admin
