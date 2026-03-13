import mongoose from "mongoose";

/* =====================================================
   QUESTION SCHEMA
===================================================== */

const questionSchema = new mongoose.Schema({

  question: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: [
      "conceptual",
      "debugging",
      "scenario",
      "project",
      "system-design",
      "behavioral",
      "follow-up",
      "technical"
    ],
    default: "conceptual"
  },

  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium"
  },

  expectedKeywords: [String],

  timeLimit: {
    type: Number,
    default: 120
  },

  /* Candidate response */

  answer: String,

  answerDuration: Number,

  recordingUrl: String,

  /* AI Evaluation */

  evaluation: {
    score: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    technicalAccuracy: { type: Number, default: 0 },
    problemSolving: { type: Number, default: 0 },
    correctness: { type: Number, default: 0 },
    feedback: String,
    modelAnswer: String,
    improvementTips: [String]
  }

}, { timestamps: true });



/* =====================================================
   RESUME ANALYSIS
===================================================== */

const resumeAnalysisSchema = new mongoose.Schema({

  resumeScore: {
    type: Number,
    default: 0
  },

  experienceLevel: String,

  yearsOfExperience: Number,

  skills: [String],

  missingSkills: [String],

  recommendedRoles: [String],

  projects: [{
    title: String,
    description: String,
    technologies: [String]
  }]

}, { _id: false });



/* =====================================================
   CONFIDENCE DETECTION
===================================================== */

const confidenceSchema = new mongoose.Schema({

  facialConfidence: Number,

  voiceConfidence: Number,

  eyeContactScore: Number,

  postureScore: Number,

  overallConfidence: Number

}, { _id: false });



/* =====================================================
   INTERVIEW PERFORMANCE
===================================================== */

const performanceSchema = new mongoose.Schema({

  technicalScore: {
    type: Number,
    default: 0
  },

  communicationScore: {
    type: Number,
    default: 0
  },

  problemSolvingScore: {
    type: Number,
    default: 0
  },

  confidenceScore: {
    type: Number,
    default: 0
  }

}, { _id: false });



/* =====================================================
   FINAL AI REPORT
===================================================== */

const finalReportSchema = new mongoose.Schema({

  overallScore: {
    type: Number,
    default: 0
  },

  hireProbability: {
    type: String,
    default: "0%"
  },

  candidateLevel: {
    type: String,
    default: "Not Assessed"
  },

  summary: String,

  strengths: [String],

  weaknesses: [String],

  areasOfImprovement: [String],

  recommendedLearningPath: [String],

  suggestedResources: [String],

  hiringRecommendation: {
    type: String,
    enum: ["Strong Hire", "Hire", "No Hire"]
  }

}, { _id: false });



/* =====================================================
   MAIN INTERVIEW SCHEMA
===================================================== */

const interviewSchema = new mongoose.Schema({

  /* Candidate */

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  role: {
    type: String,
    required: true
  },

  experience: {
    type: String,
    required: true
  },

  /* Interview Mode */

  mode: {
    type: String,
    enum: ["technical", "hr"],
    required: true
  },

  interviewType: {
    type: String,
    enum: ["resume-based", "practice", "custom"],
    default: "resume-based"
  },

  difficultyLevel: {
    type: String,
    enum: ["beginner", "intermediate", "advanced", "expert"],
    default: "intermediate"
  },

  targetCompany: String,

  focusTopics: [String],

  /* Resume */

  resumeText: String,

  resumeAnalysis: resumeAnalysisSchema,

  /* Skills & Projects */

  skills: [String],

  projects: [{
    title: String,
    description: String,
    technologies: [String]
  }],

  /* Questions */

  questions: [questionSchema],

  /* Confidence Detection */

  confidenceAnalysis: confidenceSchema,

  /* Interview Performance */

  performance: performanceSchema,

  /* Final AI Report */

  finalReport: finalReportSchema,

  /* Interview Timing */

  duration: Number,

  startedAt: Date,

  completedAt: Date,

  /* Recording */

  interviewRecording: {
    audioUrl: String,
    videoUrl: String
  },

  /* Status */

  status: {
    type: String,
    enum: ["pending", "in-progress", "completed", "abandoned"],
    default: "pending"
  }

}, { timestamps: true });



/* =====================================================
   INDEXES (PERFORMANCE OPTIMIZATION)
===================================================== */

interviewSchema.index({ userId: 1, status: 1 });
interviewSchema.index({ userId: 1, createdAt: -1 });



/* =====================================================
   EXPORT MODEL
===================================================== */

export default mongoose.model("Interview", interviewSchema);
