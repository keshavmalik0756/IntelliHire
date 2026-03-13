// ─── Firebase Admin SDK ───────────────────────────────────────────────────────
// Used server-side to verify Firebase ID tokens sent from the client.
//
// Production (Render):
// Set these environment variables in Render:
// FIREBASE_PROJECT_ID
// FIREBASE_CLIENT_EMAIL
// FIREBASE_PRIVATE_KEY

import admin from "firebase-admin";

let firebaseInitialized = false;

try {
  if (!admin.apps.length) {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
        : undefined,
    };

    if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      firebaseInitialized = true;
      console.log("✅ Firebase Admin initialized");
    } else {
      console.warn("⚠️ Firebase Admin env variables missing. Google auth will not work.");
      admin.initializeApp();
    }
  }
} catch (error) {
  console.error("❌ Firebase Admin initialization error:", error);
}

export default admin;