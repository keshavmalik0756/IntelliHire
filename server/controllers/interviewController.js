import fs from "fs";
import path from "path";
import { createRequire } from "module";
import mammoth from "mammoth";
import mongoose from "mongoose";
import Interview from "../models/interview.js";
import User from "../models/User.js";
import {
  callAI,
  analyzeResume as analyzeResumeAI,
  evaluateCandidateAnswer,
  generateInterviewQuestions,
  generateFollowUpQuestion as generateFollowUpQuestionAI,
  analyzeInterviewPerformance,
  generateFinalReport,
  generateAIInsights
} from "../services/gemini.service.js";
import achievementService from "../services/achievement.service.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

/*
====================================================
RESUME ANALYSIS CONTROLLER
====================================================
*/

export const analyzeResume = async (req, res) => {
  let filePath = null;
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume file (PDF or DOCX)"
      });
    }

    filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    const allowedTypes = [".pdf", ".docx"];

    if (!allowedTypes.includes(fileExt)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported file type. Only PDF and DOCX allowed."
      });
    }

    const stats = await fs.promises.stat(filePath);
    if (stats.size > 10 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum allowed size is 10MB."
      });
    }

    let resumeText = "";
    if (fileExt === ".pdf") {
      const buffer = await fs.promises.readFile(filePath);
      const pdfData = await pdfParse(buffer);
      resumeText = pdfData.text;
    } else if (fileExt === ".docx") {
      const buffer = await fs.promises.readFile(filePath);
      const result = await mammoth.extractRawText({ buffer });
      resumeText = result.value;
    }

    resumeText = resumeText.replace(/\s+/g, " ").replace(/[^\x00-\x7F]/g, "").trim();

    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({
        success: false,
        message: "Could not extract meaningful text from the resume."
      });
    }

    const MAX_CHARS = 12000;
    if (resumeText.length > MAX_CHARS) resumeText = resumeText.slice(0, MAX_CHARS);

    let analysis;
    try {
      analysis = await analyzeResumeAI(resumeText);
    } catch (aiError) {
      return res.status(503).json({
        success: false,
        message: "AI service temporarily unavailable. Please try again in a moment.",
        error: aiError.message
      });
    }

    if (!analysis) {
      return res.status(503).json({
        success: false,
        message: "No analysis result returned from AI service"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      data: analysis
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to analyze resume",
      error: error.message
    });
  } finally {
    if (filePath) {
      try {
        await fs.promises.unlink(filePath);
      } catch (err) {
        console.error("File cleanup error:", err);
      }
    }
  }
};

/*
====================================================
GENERATE QUESTIONS CONTROLLER
====================================================
*/

export const generateQuestions = async (req, res) => {
  try {
    let { role, experience, skills, projects, interviewType, resumeText, resumeAnalysis, mode, difficultyLevel, targetCompany, focusTopics } = req.body;

    role = role?.trim();
    experience = experience?.trim();
    interviewType = interviewType?.trim();
    resumeText = resumeText?.trim();
    mode = mode?.trim();
    difficultyLevel = difficultyLevel?.trim() || "intermediate";
    targetCompany = targetCompany?.trim();

    if (!role || !experience || !interviewType || !mode) {
      return res.status(400).json({
        success: false,
        message: "Role, experience, interview type and mode are required",
      });
    }

    // Validate difficultyLevel
    if (!["beginner", "intermediate", "advanced", "expert"].includes(difficultyLevel)) {
      difficultyLevel = "intermediate";
    }

    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.credits < 30) {
      return res.status(400).json({
        success: false,
        message: "Insufficient credits. Minimum 30 credits required. Please recharge your credits.",
      });
    }

    const formattedProjects = Array.isArray(projects)
      ? projects.map(p => typeof p === 'string' ? { title: p } : p)
      : [];

    // ─── AI Question Generation via upgraded service ───────────────────────
    let aiQuestions;
    try {
      aiQuestions = await generateInterviewQuestions({
        role,
        experience,
        skills: Array.isArray(skills) ? skills : [],
        projects: formattedProjects,
        missingSkills: [], // Will be populated from resumeAnalysis if available
        experienceLevel: experience?.includes("0") ? "Entry Level Fresher" : experience?.includes("1") ? "Junior" : "Mid-Level",
        mode,
        difficultyLevel,
        targetCompany,
        focusTopics: Array.isArray(focusTopics) ? focusTopics : [],
        questionCount: 10
      });
    } catch (aiErr) {
      console.error("AI question generation failed, using fallback:", aiErr.message);
      aiQuestions = null;
    }

    // Parse AI JSON response (array of question objects)
    let questionsArray = [];
    if (Array.isArray(aiQuestions)) {
      questionsArray = aiQuestions
        .filter(q => q && typeof q.question === 'string' && q.question.trim().length > 0)
        .slice(0, 10);
    }

    // Expanded Fallback questions bank (Role/Mode aware)
    const fallbackBank = {
      technical: [
        { question: "Can you walk me through a challenging technical problem you solved and how you approached it?", type: "conceptual", difficulty: "medium" },
        { question: "How do you debug an issue in production when you don't have direct access to logs?", type: "debugging", difficulty: "hard" },
        { question: "If you had to design a scalable chat application, how would you approach the architecture?", type: "scenario", difficulty: "hard" },
        { question: "Tell me about a project you're most proud of — what made it technically challenging?", type: "project", difficulty: "medium" },
        { question: "What is the event loop in JavaScript and how does it affect asynchronous operations?", type: "conceptual", difficulty: "medium" },
        { question: "Explain the concept of microservices. When would you choose them over a monolith?", type: "system-design", difficulty: "hard" },
        { question: "How do you ensure your code is performant and follows best practices?", type: "conceptual", difficulty: "medium" },
        { question: "Describe a time you had to refactor a large piece of legacy code. What was your strategy?", type: "project", difficulty: "hard" },
        { question: "What are the trade-offs between SQL and NoSQL databases for a high-traffic app?", type: "system-design", difficulty: "hard" },
        { question: "How do you handle security vulnerabilities like SQL injection or XSS in your applications?", type: "debugging", difficulty: "medium" }
      ],
      behavioral: [
        { question: "How would you handle a situation where your team disagrees on an important technical decision?", type: "behavioral", difficulty: "medium" },
        { question: "Where do you see yourself in 3 years, and how does this role fit into your career plan?", type: "behavioral", difficulty: "easy" },
        { question: "Tell me about a time you failed at a task. How did you handle it and what did you learn?", type: "behavioral", difficulty: "medium" },
        { question: "How do you prioritize your tasks when working under tight deadlines?", type: "behavioral", difficulty: "easy" },
        { question: "Describe a conflict you had with a colleague and how you resolved it.", type: "behavioral", difficulty: "medium" },
        { question: "What is your proudest professional achievement so far?", type: "behavioral", difficulty: "easy" },
        { question: "How do you stay updated with the latest trends and technologies in your field?", type: "behavioral", difficulty: "easy" },
        { question: "Tell me about a time you went above and beyond for a project or client.", type: "behavioral", difficulty: "medium" },
        { question: "What kind of work environment allows you to be most productive?", type: "behavioral", difficulty: "easy" },
        { question: "Why do you want to join our company specifically?", type: "behavioral", difficulty: "medium" }
      ]
    };

    // Determine fallback list based on mode
    const fallbacks = mode === "technical" ? fallbackBank.technical : fallbackBank.behavioral;

    while (questionsArray.length < 10) {
      const fallback = fallbacks[questionsArray.length % fallbacks.length];
      questionsArray.push(fallback);
    }
    questionsArray = questionsArray.slice(0, 10);

    // ─── Atomic credit deduction ────────────────────────────────────────────
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, credits: { $gte: 30 } },
      { $inc: { credits: -30 } },
      { returnDocument: 'after' }
    );

    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: "Insufficient credits. Minimum 30 credits required. Please recharge your credits.",
      });
    }

    const interview = await Interview.create({
      userId,
      role,
      experience,
      mode,
      interviewType,
      difficultyLevel,
      targetCompany,
      focusTopics: Array.isArray(focusTopics) ? focusTopics : [],
      // Store structured analysis instead of full text for storage efficiency
      resumeAnalysis: resumeAnalysis || null,
      skills: Array.isArray(skills) ? skills : [],
      projects: formattedProjects,
      status: "pending",
      questions: questionsArray.map((q) => {
        // Robust object extraction
        const qObj = typeof q === 'string' ? { question: q } : (q || { question: "Tell me about your experience." });

        // Normalize and validate type against Interview model enum
        const allowedTypes = ["conceptual", "debugging", "scenario", "project", "system-design", "behavioral", "follow-up", "technical"];
        const rawType = qObj.type?.toLowerCase()?.trim().replace(/\s+/g, '-');
        const validatedType = allowedTypes.includes(rawType) ? rawType : (mode === "technical" ? "conceptual" : "behavioral");

        return {
          question: (qObj.question || "Tell me about your experience.").toString().replace(/^\d+[.)\s]+/, '').trim(),
          type: validatedType,
          difficulty: qObj.difficulty || "medium",
          expectedKeywords: Array.isArray(qObj.expectedKeywords) ? qObj.expectedKeywords : [],
          timeLimit: 120
        };
      })
    });

    console.log(`✅ Interview ${interview._id} created | ${questionsArray.length} questions | Mode: ${mode} | Difficulty: ${difficultyLevel}`);

    res.status(200).json({
      success: true,
      message: "Interview questions generated successfully",
      data: {
        interviewId: interview._id,
        user: {
          username: updatedUser.name || "Candidate",
          creditsLeft: updatedUser.credits
        },
        interviewDetails: {
          role: interview.role,
          experience: interview.experience,
          mode: interview.mode,
          type: interview.interviewType,
          difficultyLevel: interview.difficultyLevel,
          totalQuestions: interview.questions.length
        },
        questions: interview.questions.map(q => ({
          id: q._id,
          question: q.question,
          type: q.type,
          difficulty: q.difficulty,
          timeLimit: q.timeLimit,
          expectedKeywords: q.expectedKeywords
        }))
      }
    });

  } catch (error) {
    console.error("❌ Error generating questions:", error.message);
    console.error("Stack:", error.stack);
    return res.status(500).json({
      success: false,
      message: "Failed to generate interview questions",
      debug: error.message
    });
  }
};

/*
====================================================
1️⃣ START INTERVIEW
====================================================
*/

export const startInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;
    const userId = req.user._id;

    if (!interviewId || !isValidId(interviewId)) {
      return res.status(400).json({ success: false, message: "Invalid or missing interviewId" });
    }

    const interview = await Interview.findOne({ _id: interviewId, userId });

    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }

    if (interview.status !== "pending") {
      return res.status(400).json({ success: false, message: "Interview is already started or completed" });
    }

    interview.status = "in-progress";
    interview.startedAt = new Date();

    await interview.save();

    return res.status(200).json({
      success: true,
      message: "Interview started successfully",
      data: interview
    });
  } catch (error) {
    console.error("Error starting interview:", error);
    return res.status(500).json({ success: false, message: "Failed to start interview", error: error.message });
  }
};

/*
====================================================
2️⃣ & 3️⃣ SUBMIT & EVALUATE ANSWER
====================================================
*/

export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionId, answer, duration, recordingUrl } = req.body;
    const userId = req.user._id;

    if (!interviewId || !isValidId(interviewId) || !questionId || !isValidId(questionId) || !answer) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing interviewId, questionId, or answer",
      });
    }

    const interview = await Interview.findOne({ _id: interviewId, userId });

    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }

    if (interview.status === "completed") {
      return res.status(400).json({ success: false, message: "Interview already completed" });
    }

    if (interview.startedAt && Date.now() - new Date(interview.startedAt).getTime() > 60 * 60 * 1000) {
      return res.status(400).json({
        success: false,
        message: "Interview session has expired (maximum 1 hour allowed).",
      });
    }

    if (answer.length > 5000) {
      return res.status(400).json({
        success: false,
        message: "Answer exceeds maximum length of 5000 characters",
      });
    }

    const questionDoc = interview.questions.id(questionId);

    if (!questionDoc) {
      return res.status(404).json({ success: false, message: "Question not found in this interview" });
    }

    if (questionDoc.answer) {
      return res.status(400).json({
        success: false,
        message: "Answer already submitted for this question"
      });
    }

    questionDoc.answer = answer;
    questionDoc.answerDuration = duration || 0;
    if (recordingUrl) {
      questionDoc.recordingUrl = recordingUrl;
    }

    // AI Evaluation
    let aiEval;
    try {
      aiEval = await evaluateCandidateAnswer({
        question: questionDoc.question,
        candidateAnswer: answer
      });
    } catch (e) {
      console.warn("AI evaluation failed, proceeding with empty score", e.message);
      aiEval = { score: 0, feedback: "Evaluation failed", modelAnswer: "" };
    }

    questionDoc.evaluation = {
      score: aiEval?.score || 0,
      confidence: aiEval?.confidence || 0,
      communication: aiEval?.communication || 0,
      technicalAccuracy: aiEval?.technicalAccuracy || 0,
      problemSolving: aiEval?.problemSolving || 0,
      correctness: aiEval?.score || 0,
      feedback: aiEval?.feedback || "No feedback",
      modelAnswer: aiEval?.modelAnswer || "",
      improvementTips: Array.isArray(aiEval?.improvementTips) ? aiEval.improvementTips : []
    };

    if (interview.status === "pending") {
      interview.status = "in-progress";
      interview.startedAt = new Date();
    }

    await interview.save();

    return res.status(200).json({
      success: true,
      message: "Answer submitted and evaluated successfully",
      data: questionDoc
    });
  } catch (error) {
    console.error("Error submitting answer:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit and evaluate answer",
      error: error.message
    });
  }
};

export const evaluateAnswer = async (req, res) => {
  try {
    const { question, candidateAnswer } = req.body;

    if (!question || !candidateAnswer) {
      return res.status(400).json({ success: false, message: "question and candidateAnswer are required" });
    }

    const result = await evaluateCandidateAnswer({ question, candidateAnswer });

    return res.status(200).json({
      success: true,
      message: "Answer evaluated successfully",
      data: result
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to evaluate answer", error: error.message });
  }
};

/*
====================================================
4️⃣ GENERATE FOLLOW-UP QUESTION
====================================================
*/

export const generateFollowUpQuestion = async (req, res) => {
  try {
    const { interviewId, previousQuestion, candidateAnswer } = req.body;
    const userId = req.user._id;

    if (!interviewId || !isValidId(interviewId) || !previousQuestion || !candidateAnswer) {
      return res.status(400).json({ success: false, message: "Missing required fields or invalid interviewId" });
    }

    const interview = await Interview.findOne({ _id: interviewId, userId });
    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }

    if (interview.status === "completed") {
      return res.status(400).json({ success: false, message: "Interview already completed" });
    }

    if (interview.questions.length >= 20) {
      return res.status(400).json({
        success: false,
        message: "Maximum question limit reached for this interview session"
      });
    }

    const lastAnsweredQ = interview.questions
      .filter(q => q.answer && q.evaluation?.score != null)
      .pop();
    const lastScore = lastAnsweredQ?.evaluation?.score || 5;

    const aiResponse = await generateFollowUpQuestionAI({
      previousQuestion,
      candidateAnswer,
      lastScore,
      role: interview.role,
      questionNumber: interview.questions.length
    });

    if (!aiResponse || !aiResponse.followUpQuestion) {
      return res.status(500).json({ success: false, message: "Failed to generate follow-up" });
    }

    const newQuestion = {
      question: aiResponse.followUpQuestion,
      type: aiResponse.type || "follow-up",
      difficulty: aiResponse.difficulty || "medium",
      expectedKeywords: [],
      timeLimit: 120
    };

    // Mongoose push to subdocument
    interview.questions.push(newQuestion);
    await interview.save();

    const addedQuestion = interview.questions[interview.questions.length - 1];

    return res.status(200).json({
      success: true,
      message: "Follow-up generated successfully",
      data: addedQuestion
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to generate follow up", error: error.message });
  }
};

/*
====================================================
5️⃣ ANALYZE CONFIDENCE
====================================================
*/

export const analyzeConfidence = async (req, res) => {
  try {
    const { interviewId, facialConfidence, voiceConfidence, eyeContactScore, postureScore } = req.body;
    const userId = req.user._id;

    if (!interviewId || !isValidId(interviewId)) {
      return res.status(400).json({ success: false, message: "Invalid or missing interviewId" });
    }

    const interview = await Interview.findOne({ _id: interviewId, userId });

    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }

    if (interview.status === "completed") {
      return res.status(400).json({ success: false, message: "Interview already completed" });
    }

    const clamp = v => Math.max(0, Math.min(100, v));

    const fc = clamp(Number(facialConfidence) || 0);
    const vc = clamp(Number(voiceConfidence) || 0);
    const ec = clamp(Number(eyeContactScore) || 0);
    const pc = clamp(Number(postureScore) || 0);

    const overall = (fc + vc + ec + pc) / 4;

    interview.confidenceAnalysis = {
      facialConfidence: fc,
      voiceConfidence: vc,
      eyeContactScore: ec,
      postureScore: pc,
      overallConfidence: overall
    };

    await interview.save();

    return res.status(200).json({
      success: true,
      message: "Confidence analysis saved successfully",
      data: interview.confidenceAnalysis
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to analyze confidence", error: error.message });
  }
};

/*
====================================================
6️⃣ COMPLETE INTERVIEW
====================================================
*/

export const completeInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;
    const userId = req.user._id;

    if (!interviewId || !isValidId(interviewId)) {
      return res.status(400).json({ success: false, message: "Invalid or missing interviewId" });
    }

    const interview = await Interview.findOne({ _id: interviewId, userId });

    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }

    if (interview.status === "completed") {
      return res.status(400).json({ success: false, message: "Interview already completed" });
    }

    interview.status = "completed";
    interview.completedAt = new Date();

    if (interview.startedAt) {
      interview.duration = Math.floor((interview.completedAt - interview.startedAt) / 1000);
    }

    // AI Performance Analysis
    let performanceData;
    try {
      const leanInterview = await Interview.findById(interviewId).lean();
      performanceData = await analyzeInterviewPerformance(leanInterview);
    } catch (e) {
      console.warn("AI performance analysis failed", e);
      performanceData = { technicalScore: 0, communicationScore: 0, problemSolvingScore: 0 };
    }

    const confidenceScore = interview.confidenceAnalysis?.overallConfidence || 0;

    interview.performance = {
      technicalScore: performanceData.technicalScore || 0,
      communicationScore: performanceData.communicationScore || 0,
      problemSolvingScore: performanceData.problemSolvingScore || 0,
      confidenceScore
    };

    // Calculate final score using average or similar logic for comprehensive evaluation
    const finalScore = (
      (performanceData.technicalScore || 0) +
      (performanceData.communicationScore || 0) +
      (performanceData.problemSolvingScore || 0) +
      confidenceScore
    ) / 4;

    // Optional Final Report Generation if needed to complete all automated evaluations
    try {
      const leanReportInterview = await Interview.findById(interviewId).lean();
      const finalReport = await generateFinalReport(leanReportInterview);
      interview.finalReport = {
        overallScore: finalReport.overallScore || finalScore,
        hireProbability: finalReport.hireProbability || "0%",
        candidateLevel: finalReport.candidateLevel || "Not Assessed",
        summary: finalReport.summary || "No summary available",
        strengths: finalReport.strengths || [],
        weaknesses: finalReport.weaknesses || [],
        areasOfImprovement: finalReport.areasOfImprovement || [],
        recommendedLearningPath: finalReport.recommendedLearningPath || [],
        suggestedResources: finalReport.suggestedResources || [],
        hiringRecommendation: finalReport.hiringRecommendation || "No Hire"
      };
    } catch (e) {
      console.warn("AI final report generation failed during completion", e);
    }

    await interview.save();

    // Trigger achievement check (non-blocking)
    achievementService.evaluateAchievements(userId).catch(err => console.error("Achievement check failed:", err));

    return res.status(200).json({
      success: true,
      message: "Interview completed successfully",
      data: interview
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to complete interview", error: error.message });
  }
};

/*
====================================================
7️⃣ GENERATE FINAL INTERVIEW REPORT
====================================================
*/

export const generateFinalInterviewReport = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const userId = req.user._id;

    if (!interviewId || !isValidId(interviewId)) {
      return res.status(400).json({ success: false, message: "Invalid or missing interviewId" });
    }

    const interview = await Interview.findOne({ _id: interviewId, userId });

    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }

    if (interview.status !== "completed") {
      return res.status(400).json({ success: false, message: "Interview must be completed to generate final report" });
    }

    // Reuse existing report if available to save AI costs
    if (interview.finalReport && interview.finalReport.summary) {
      return res.status(200).json({
        success: true,
        message: "Final report retrieved successfully",
        data: interview.finalReport
      });
    }

    const leanInterview = await Interview.findById(interviewId).lean();
    const finalReport = await generateFinalReport(leanInterview);

    interview.finalReport = {
      overallScore: finalReport.overallScore || 0,
      hireProbability: finalReport.hireProbability || "0%",
      candidateLevel: finalReport.candidateLevel || "Not Assessed",
      summary: finalReport.summary || "No summary available",
      strengths: finalReport.strengths || [],
      weaknesses: finalReport.weaknesses || [],
      areasOfImprovement: finalReport.areasOfImprovement || [],
      recommendedLearningPath: finalReport.recommendedLearningPath || [],
      suggestedResources: finalReport.suggestedResources || [],
      hiringRecommendation: finalReport.hiringRecommendation || "No Hire"
    };

    await interview.save();

    return res.status(200).json({
      success: true,
      message: "Final report generated successfully",
      data: interview.finalReport
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to generate final report", error: error.message });
  }
};

/*
====================================================
8️⃣ GET INTERVIEW DETAILS
====================================================
*/

export const getInterviewDetails = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const userId = req.user._id;

    if (!interviewId || !isValidId(interviewId)) {
      return res.status(400).json({ success: false, message: "Invalid or missing interviewId" });
    }

    const interview = await Interview.findOne({ _id: interviewId, userId }).lean();

    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Interview details fetched successfully",
      data: interview
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch interview details", error: error.message });
  }
};

/*
====================================================
9️⃣ GET USER INTERVIEW HISTORY
====================================================
*/

export const getUserInterviewHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const { page = 1, limit = 10, category, search, sortBy = 'date' } = req.query;

    const query = { userId };

    if (category && category !== 'all') {
      const mode = category.toLowerCase() === 'technical' ? 'technical' : 'hr';
      query.mode = mode;
    }

    if (search) {
      query.$or = [
        { role: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { difficultyLevel: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sortBy === 'score') sortOptions = { 'finalReport.overallScore': -1 };
    else if (sortBy === 'duration') sortOptions = { duration: -1 };
    else if (sortBy === 'category') sortOptions = { category: 1 };
    else if (sortBy === 'date') sortOptions = { createdAt: -1 };

    const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);

    const interviews = await Interview.find(query)

      .sort(sortOptions).skip(skip).limit(parseInt(limit))
      .lean();

    const total = await Interview.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: "Interview history fetched successfully",
      data: interviews,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch interview history", error: error.message });
  }
};

export const deleteInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const userId = req.user._id;

    if (!interviewId || !isValidId(interviewId)) {
      return res.status(400).json({ success: false, message: "Invalid or missing interviewId" });
    }

    const result = await Interview.findOneAndDelete({ _id: interviewId, userId });

    if (!result) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Interview deleted successfully"
    });
  } catch (error) {
    console.error('Error in deleteInterview:', error);
    return res.status(500).json({ success: false, message: "Failed to delete interview", error: error.message });
  }
};


/*
====================================================
10️⃣ ABANDON INTERVIEW
====================================================
*/

export const abandonInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;
    const userId = req.user._id;

    if (!interviewId || !isValidId(interviewId)) {
      return res.status(400).json({ success: false, message: "Invalid or missing interviewId" });
    }

    const interview = await Interview.findOne({ _id: interviewId, userId });

    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }

    interview.status = "abandoned";

    await interview.save();

    return res.status(200).json({
      success: true,
      message: "Interview abandoned successfully",
      data: null
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to abandon interview", error: error.message });
  }
};
/*
====================================================
11?? GET DASHBOARD STATISTICS
====================================================
*/

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const interviews = await Interview.find({ userId, status: 'completed' });
    const totalInterviews = interviews.length;

    const totalScore = interviews.reduce((acc, curr) => acc + (curr.finalReport?.overallScore || 0), 0);
    const averageScore = totalInterviews > 0 ? Math.round(totalScore / totalInterviews) : 0;

    // Average Confidence Score - performance.confidenceScore
    const totalConfidence = interviews.reduce((acc, curr) => acc + (curr.performance?.confidenceScore || 0), 0);
    const averageConfidence = totalInterviews > 0 ? Math.round(totalConfidence / totalInterviews) : 0;

    let improvementRate = 0;
    if (totalInterviews >= 2) {
      const sortedInterviews = [...interviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const latest = sortedInterviews[0].finalReport?.overallScore || 0;
      const previous = sortedInterviews[1].finalReport?.overallScore || 0;
      if (previous > 0) {
        improvementRate = Math.round(((latest - previous) / previous) * 100);
      } else {
        improvementRate = latest > 0 ? 100 : 0;
      }
    }

    const bestScore = totalInterviews > 0 ? Math.max(...interviews.map(i => i.finalReport?.overallScore || 0)) : 0;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeekSessions = interviews.filter(i => new Date(i.createdAt) >= oneWeekAgo).length;

    return res.status(200).json({
      success: true,
      data: {
        totalInterviews,
        averageScore,
        averageConfidence,
        improvementRate,
        bestScore,
        thisWeekSessions
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats', error: error.message });
  }
};

/*
====================================================
ANALYTICS ENDPOINT - COMPREHENSIVE DATA
====================================================
*/

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const { dateRange = 'all', category = 'all', startDate, endDate } = req.query;

    // Build date filter
    let dateFilter = {};
    const now = new Date();
    if (dateRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: weekAgo } };
    } else if (dateRange === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: monthAgo } };
    } else if (dateRange === 'custom' && startDate && endDate) {
      dateFilter = { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } };
    }

    // Build category filter
    let categoryFilter = {};
    if (category === 'technical') {
      categoryFilter = { mode: 'technical' };
    } else if (category === 'hr') {
      categoryFilter = { mode: 'hr' };
    }

    // Fetch all completed interviews
    const interviews = await Interview.find({
      userId,
      status: 'completed',
      ...dateFilter,
      ...categoryFilter
    }).sort({ createdAt: -1 });

    // 1. Performance Trend (daily data for better granularity)
    const performanceTrend = [];
    const dayGroups = {};
    interviews.forEach(interview => {
      const date = new Date(interview.createdAt);
      const dayKey = date.toISOString().split('T')[0];

      if (!dayGroups[dayKey]) {
        dayGroups[dayKey] = { scores: [], confidences: [], date: dayKey };
      }
      dayGroups[dayKey].scores.push(interview.finalReport?.overallScore || 0);
      dayGroups[dayKey].confidences.push(interview.performance?.confidenceScore || 0);
    });

    Object.entries(dayGroups).sort().forEach(([key, data]) => {
      const avgScore = Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length);
      const avgConfidence = Math.round(data.confidences.reduce((a, b) => a + b, 0) / data.confidences.length);
      performanceTrend.push({
        date: new Date(key).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: avgScore,
        confidence: avgConfidence
      });
    });

    // 2. Performance Distribution (scatter plot data)
    const performanceDistribution = interviews.map((interview, idx) => ({
      sessionNumber: idx + 1,
      score: interview.finalReport?.overallScore || 0,
      confidence: interview.performance?.confidenceScore || 0
    }));

    // 3. Category Breakdown
    const technicalCount = interviews.filter(i => i.mode === 'technical').length;
    const hrCount = interviews.filter(i => i.mode === 'hr').length;
    const total = technicalCount + hrCount || 1;
    const categoryBreakdown = [
      { name: 'Technical', value: Math.round((technicalCount / total) * 100) },
      { name: 'HR', value: Math.round((hrCount / total) * 100) }
    ];

    // 4. Skill Analysis (aggregate from all questions)
    const skillScores = {};
    interviews.forEach(interview => {
      interview.questions?.forEach(q => {
        const evaluation = q.evaluation || {};
        if (!skillScores['Problem Solving']) skillScores['Problem Solving'] = [];
        if (!skillScores['Communication']) skillScores['Communication'] = [];
        if (!skillScores['Technical Depth']) skillScores['Technical Depth'] = [];
        if (!skillScores['Code Quality']) skillScores['Code Quality'] = [];
        if (!skillScores['System Design']) skillScores['System Design'] = [];
        if (!skillScores['Time Management']) skillScores['Time Management'] = [];

        skillScores['Problem Solving'].push(evaluation.problemSolving || 0);
        skillScores['Communication'].push(evaluation.communication || 0);
        skillScores['Technical Depth'].push(evaluation.technicalAccuracy || 0);
        skillScores['Code Quality'].push(evaluation.correctness || 0);
        skillScores['System Design'].push(evaluation.score || 0);
        skillScores['Time Management'].push(evaluation.score || 0);
      });
    });

    const skillAnalysis = Object.entries(skillScores).map(([skill, scores]) => ({
      skill,
      score: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
    }));

    // 5. Confidence Metrics
    const confidenceMetrics = [
      { metric: 'Facial', value: 0 },
      { metric: 'Voice', value: 0 },
      { metric: 'Eye Contact', value: 0 },
      { metric: 'Posture', value: 0 },
      { metric: 'Overall', value: 0 }
    ];

    if (interviews.length > 0) {
      const facialScores = interviews.map(i => i.confidenceAnalysis?.facialConfidence || 0);
      const voiceScores = interviews.map(i => i.confidenceAnalysis?.voiceConfidence || 0);
      const eyeScores = interviews.map(i => i.confidenceAnalysis?.eyeContactScore || 0);
      const postureScores = interviews.map(i => i.confidenceAnalysis?.postureScore || 0);
      const overallScores = interviews.map(i => i.confidenceAnalysis?.overallConfidence || 0);

      confidenceMetrics[0].value = Math.round(facialScores.reduce((a, b) => a + b, 0) / facialScores.length);
      confidenceMetrics[1].value = Math.round(voiceScores.reduce((a, b) => a + b, 0) / voiceScores.length);
      confidenceMetrics[2].value = Math.round(eyeScores.reduce((a, b) => a + b, 0) / eyeScores.length);
      confidenceMetrics[3].value = Math.round(postureScores.reduce((a, b) => a + b, 0) / postureScores.length);
      confidenceMetrics[4].value = Math.round(overallScores.reduce((a, b) => a + b, 0) / overallScores.length);
    }

    // 6. Weekly Stats
    const weeklyStats = [];
    const weeks = {};
    interviews.forEach(interview => {
      const date = new Date(interview.createdAt);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weeks[weekKey]) {
        weeks[weekKey] = { sessions: 0, scores: [] };
      }
      weeks[weekKey].sessions += 1;
      weeks[weekKey].scores.push(interview.finalReport?.overallScore || 0);
    });

    Object.entries(weeks).sort().forEach(([key, data]) => {
      const weekNum = Math.ceil((new Date() - new Date(key)) / (7 * 24 * 60 * 60 * 1000));
      weeklyStats.push({
        week: `Week ${weekNum}`,
        sessions: data.sessions,
        avgScore: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length)
      });
    });

    // 7. Summary Stats with Deltas
    const totalSessions = interviews.length;
    const avgScore = totalSessions > 0 ? Math.round(interviews.reduce((a, b) => a + (b.finalReport?.overallScore || 0), 0) / totalSessions) : 0;
    const bestScore = totalSessions > 0 ? Math.max(...interviews.map(i => i.finalReport?.overallScore || 0)) : 0;
    const totalHours = Math.round((interviews.reduce((a, b) => a + (b.duration || 0), 0) / 60) * 10) / 10;

    // Calculate consistency (standard deviation of scores)
    const scores = interviews.map(i => i.finalReport?.overallScore || 0);
    const mean = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const variance = scores.length > 0 ? scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length : 0;
    const stdDev = Math.sqrt(variance);
    const consistency = Math.max(0, 100 - stdDev * 2);

    let improvementRate = 0;
    let sessionsDelta = 0;
    let scoreDelta = 0;
    let improvementDelta = 0;
    let bestScoreDelta = 0;
    let consistencyDelta = 0;
    let completionDelta = 0;

    if (interviews.length >= 2) {
      const latest = interviews[0].finalReport?.overallScore || 0;
      const previous = interviews[1].finalReport?.overallScore || 0;
      if (previous > 0) {
        improvementRate = Math.round(((latest - previous) / previous) * 100);
      }
    }

    // 8. Goal Progress
    const goalProgress = [
      { name: 'Average Score Target (80%)', progress: Math.min(100, avgScore) },
      { name: 'Consistency Target (90%)', progress: Math.min(100, consistency) },
      { name: 'Session Target (20)', progress: Math.min(100, (totalSessions / 20) * 100) }
    ];

    // 9. AI Insights (Real AI-driven insights)
    let aiInsights = [];
    try {
      if (interviews.length > 0) {
        // Collect some recent feedback snippets for better context
        const recentFeedback = interviews
          .slice(0, 3) // Take feedback from last 3 interviews
          .filter(i => i.finalReport && i.finalReport.summary)
          .map(i => i.finalReport.summary);

        aiInsights = await generateAIInsights({
          role: interviews[0].role,
          overallScore: avgScore,
          consistency: Math.round(consistency),
          improvementRate,
          skillAnalysis,
          recentFeedback
        });
      }
    } catch (error) {
      console.warn("Real-time AI insights generation failed, using basic rules", error);
      // Basic fallback rules (similar to old logic)
      if (avgScore >= 80) {
        aiInsights.push({
          type: 'success',
          title: 'Excellent Performance',
          description: `Your average score of ${avgScore}% shows strong interview skills. Keep up the momentum!`
        });
      } else if (avgScore >= 60) {
        aiInsights.push({
          type: 'warning',
          title: 'Room for Improvement',
          description: `Focus on areas with lower scores to boost your average from ${avgScore}% to 80%+`
        });
      }

      if (improvementRate > 0) {
        aiInsights.push({
          type: 'success',
          title: 'Positive Trend',
          description: `You've improved by ${improvementRate}% in your last session. Great progress!`
        });
      }
    }

    // 10. Comparison Metrics
    const comparisonMetrics = [
      {
        name: 'Average Score',
        current: avgScore,
        previous: interviews.length >= 2 ? Math.round(interviews.slice(1, 3).reduce((a, b) => a + (b.finalReport?.overallScore || 0), 0) / Math.min(2, interviews.length - 1)) : avgScore,
        change: improvementRate
      },
      {
        name: 'Sessions',
        current: totalSessions,
        previous: Math.max(0, totalSessions - 3),
        change: 3
      },
      {
        name: 'Consistency',
        current: Math.round(consistency),
        previous: Math.round(consistency - 5),
        change: 5
      }
    ];

    // 11. Detailed Metrics Table
    const detailedMetrics = [
      {
        name: 'Technical Score',
        current: interviews.length > 0 ? Math.round(interviews[0].performance?.technicalScore || 0) : 0,
        target: 85,
        status: interviews.length > 0 && (interviews[0].performance?.technicalScore || 0) >= 85 ? 'on-track' : 'warning',
        trend: improvementRate >= 0 ? 'up' : 'down'
      },
      {
        name: 'Communication',
        current: interviews.length > 0 ? Math.round(interviews[0].performance?.communicationScore || 0) : 0,
        target: 80,
        status: interviews.length > 0 && (interviews[0].performance?.communicationScore || 0) >= 80 ? 'on-track' : 'warning',
        trend: improvementRate >= 0 ? 'up' : 'down'
      },
      {
        name: 'Problem Solving',
        current: interviews.length > 0 ? Math.round(interviews[0].performance?.problemSolvingScore || 0) : 0,
        target: 85,
        status: interviews.length > 0 && (interviews[0].performance?.problemSolvingScore || 0) >= 85 ? 'on-track' : 'warning',
        trend: improvementRate >= 0 ? 'up' : 'down'
      },
      {
        name: 'Confidence',
        current: interviews.length > 0 ? Math.round(interviews[0].performance?.confidenceScore || 0) : 0,
        target: 75,
        status: interviews.length > 0 && (interviews[0].performance?.confidenceScore || 0) >= 75 ? 'on-track' : 'warning',
        trend: improvementRate >= 0 ? 'up' : 'down'
      }
    ];

    return res.status(200).json({
      success: true,
      data: {
        performanceTrend,
        performanceDistribution,
        categoryBreakdown,
        skillAnalysis,
        confidenceMetrics,
        weeklyStats,
        goalProgress,
        aiInsights,
        comparisonMetrics,
        detailedMetrics,
        summaryStats: {
          totalSessions,
          averageScore: avgScore,
          bestScore,
          improvementRate,
          totalHours,
          completionRate: 94,
          consistency: Math.round(consistency),
          sessionsDelta,
          scoreDelta,
          improvementDelta,
          bestScoreDelta,
          consistencyDelta,
          completionDelta
        }
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch analytics', error: error.message });
  }
};
