import express from "express";
import {
  analyzeResume,
  generateQuestions,
  startInterview,
  submitAnswer,
  evaluateAnswer,
  generateFollowUpQuestion,
  analyzeConfidence,
  completeInterview,
  generateFinalInterviewReport,
  getInterviewDetails,
  getUserInterviewHistory,
  abandonInterview,
  getDashboardStats,
  deleteInterview,
  getAnalytics
} from "../controllers/interviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadDocument, handleUploadError } from "../middleware/multer.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

/*
==================================================
  AI RATE LIMITING (Cost Protection)
==================================================
*/
const resumeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Too many resume analysis requests. Please try again later." }
});

const questionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many question generation requests. Please try again later." }
});

const evaluationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many answer submissions. Please wait a minute." }
});

const reportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Too many report generations. Please try again later." }
});

/*
==================================================
  1️⃣ RESUME & QUESTION GENERATION
==================================================
*/

router.post(
  "/analyze-resume",
  protect,
  resumeLimiter,
  uploadDocument.single("resume"),
  handleUploadError,
  analyzeResume
);

router.post("/generate-questions", protect, questionLimiter, generateQuestions);

/*
==================================================
  2️⃣ INTERVIEW SESSION LIFECYCLE (req.body mutations)
==================================================
*/

router.post("/start", protect, startInterview);
router.post("/submit-answer", protect, evaluationLimiter, submitAnswer);
router.post("/analyze-confidence", protect, analyzeConfidence);
router.post("/follow-up", protect, evaluationLimiter, generateFollowUpQuestion);
router.post("/complete", protect, evaluationLimiter, completeInterview);
router.post("/abandon", protect, abandonInterview);

// (Optional Ad-hoc Tool available for frontend tests/sandbox)
router.post("/evaluate-answer", protect, evaluationLimiter, evaluateAnswer);

/*
==================================================
  3️⃣ FETCHING INTERVIEW DATA (req.params queries)
==================================================
*/

// Fetch all user history interviews
router.get("/history", protect, getUserInterviewHistory);

// Fetch dashboard stats
router.get("/stats", protect, getDashboardStats);

// Fetch comprehensive analytics
router.get("/analytics", protect, getAnalytics);

// Fetch a single specific interview document strictly
router.get("/:interviewId", protect, getInterviewDetails);

// Trigger or Retrieve Final Automated Report Analysis
router.get("/:interviewId/report", protect, reportLimiter, generateFinalInterviewReport);

// Delete an interview
router.delete("/:interviewId", protect, deleteInterview);

export default router;
