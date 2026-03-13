import dotenv from "dotenv";

dotenv.config();

/* =====================================================
   CONFIGURATION
===================================================== */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn("WARNING: GEMINI_API_KEY missing in environment variables");
}

if (!OPENROUTER_API_KEY) {
  console.warn("WARNING: OPENROUTER_API_KEY missing in environment variables");
}

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

/* =====================================================
   MODEL CONFIGURATION
===================================================== */

const MODELS = {
  OPENROUTER: "openai/gpt-4o-mini", // Faster and more consistent
  GEMINI_FAST: "gemini-2.0-flash",
  GEMINI_SMART: "gemini-2.0-pro"
};

const TOKEN_LIMITS = {
  RESUME: 800,
  QUESTIONS: 2000,
  EVALUATION: 1000,
  REPORT: 2000,
  FOLLOWUP: 800
};

const MAX_RETRIES = 2;
const REQUEST_TIMEOUT = 15000; // 15 seconds

/* =====================================================
   CORE UTILITIES
   ===================================================== */

const logger = {
  info: (msg) => console.log(`[INFO] ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`)
};

const aiCache = new Map();

let lastCallTime = 0;

/**
 * Basic rate limiting to prevent 429 errors (800ms cooldown)
 */
async function rateLimit() {
  const now = Date.now();
  const waitTime = 800 - (now - lastCallTime);
  if (waitTime > 0) {
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  lastCallTime = Date.now();
}

/**
 * Validates AI response structure
 */
function validateAIResponse(data, requiredFields, source = "AI") {
  if (!data || typeof data !== "object") {
    throw new Error(`Invalid ${source} response: Expected an object`);
  }

  for (const field of requiredFields) {
    if (!(field in data)) {
      throw new Error(`Missing required field: ${field} from ${source}`);
    }
  }

  return data;
}

/**
 * Emergency static fallback data if all AI providers fail
 */
function getFallbackResponse(type) {
  console.warn(`[AI] Utilizing emergency fallback for: ${type}`);

  const fallbacks = {
    resume: {
      resumeScore: 60,
      skills: [],
      missingSkills: [],
      experienceLevel: "Entry Level",
      yearsOfExperience: 0,
      recommendedRoles: [],
      projects: []
    },
    questions: [
      {
        question: "Could you walk me through your most significant technical project?",
        type: "project",
        difficulty: "medium",
        expectedKeywords: ["architecture", "challenges", "decisions"]
      },
      {
        question: "How do you typically approach debugging a complex issue in a large codebase?",
        type: "debugging",
        difficulty: "medium",
        expectedKeywords: ["logs", "breakpoints", "reproduction"]
      },
      {
        question: "Tell me about a time you had to learn a new technology quickly for a project.",
        type: "behavioral",
        difficulty: "easy",
        expectedKeywords: ["learning", "adaptability", "efficiency"]
      }
    ],
    evaluation: {
      score: 5,
      communication: 5,
      technicalAccuracy: 5,
      problemSolving: 5,
      confidence: 5,
      feedback: "Answer evaluation is temporarily unavailable, but we've recorded your response.",
      modelAnswer: "An ideal answer would demonstrate clear technical understanding and structural thinking.",
      improvementTips: ["Structure your answer with STAR method", "Clarify assumptions"]
    },
    report: {
      overallScore: 50,
      hireProbability: "Pending",
      candidateLevel: "Mid-Level Developer",
      summary: "Interview completed. Detailed analysis is temporarily unavailable.",
      strengths: ["Communication", "Engagement"],
      weaknesses: ["Technical depth analysis unavailable"],
      areasOfImprovement: ["Focus on specific system design patterns"],
      recommendedLearningPath: ["System Design", "Advanced Algorithms"],
      suggestedResources: ["System Design Interview by Alex Xu"],
      hiringRecommendation: "Hire"
    },
    followup: {
      followUpQuestion: "That's interesting. Can you elaborate more on the technical challenges you faced there?",
      difficulty: "medium",
      type: "scenario"
    }
  };

  return fallbacks[type] || { error: "Service unavailable" };
}

/* =====================================================
   SAFE JSON PARSER
===================================================== */

function safeJSONParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    try {
      // Remove markdown code blocks
      let cleaned = text
        .replace(/```json\n?/gi, "")
        .replace(/```\n?/g, "")
        .trim();

      // Try to extract JSON object if wrapped in text
      const jsonMatch = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (jsonMatch) {
        cleaned = jsonMatch[0];
      }

      return JSON.parse(cleaned);
    } catch {
      logger.error(`Failed to parse AI JSON response: ${text.substring(0, 200)}`);
      throw new Error("AI service returned invalid JSON format");
    }
  }
}

/* =====================================================
   OPENROUTER CALLER
===================================================== */

async function callOpenRouter(prompt, options = {}) {
  const temperature = options.temperature ?? 0.3;
  const maxTokens = options.maxTokens ?? 1500;

  if (!OPENROUTER_API_KEY) {
    throw new Error("OpenRouter API key not configured");
  }

  // Apply rate limiting
  await rateLimit();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const startTime = Date.now();
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "IntelliHire"
      },
      body: JSON.stringify({
        model: MODELS.OPENROUTER,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature,
        max_tokens: maxTokens
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenRouter API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const latency = Date.now() - startTime;
    logger.info(`OpenRouter call successful (${latency}ms)`);

    const text = data.choices[0].message.content;
    return options.json === false ? text : safeJSONParse(text);

  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      logger.warn("OpenRouter request timed out");
      throw new Error("OpenRouter request timed out");
    }
    logger.warn(`OpenRouter failed: ${error.message}`);
    throw error;
  }
}

/* =====================================================
   GEMINI CALLER
===================================================== */

async function callGemini(prompt, options = {}) {
  const maxTokens = options.maxTokens ?? 1500;
  const temperature = options.temperature ?? 0.3;

  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API not configured");
  }

  const geminiModels = [MODELS.GEMINI_FAST, MODELS.GEMINI_SMART];

  for (const modelName of geminiModels) {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      // Apply rate limiting
      await rateLimit();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      try {
        const startTime = Date.now();
        const url = `${GEMINI_BASE_URL}/${modelName}:generateContent?key=${GEMINI_API_KEY}`;

        const response = await fetch(url, {
          method: "POST",
          signal: controller.signal,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature, maxOutputTokens: maxTokens }
          })
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const err = await response.json();
          throw new Error(`Gemini REST error: ${err.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const latency = Date.now() - startTime;
        logger.info(`Gemini ${modelName} successful (${latency}ms)`);

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("Gemini returned no text content");

        return options.json === false ? text : safeJSONParse(text);

      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          logger.warn(`Gemini ${modelName} request timed out`);
        } else {
          logger.warn(`Gemini ${modelName} failed (Attempt ${attempt}): ${error.message}`);
        }

        if (attempt === MAX_RETRIES) {
          logger.warn(`Gemini ${modelName} max retries reached`);
        }
      }
    }
  }

  throw new Error("All Gemini models failed or timed out");
}

/* =====================================================
   UNIFIED AI CALLER (WITH FALLBACK STRATEGY)
===================================================== */

export async function callAI(promptInput, options = {}) {
  // If prompt is an array of messages, map it to a single string
  let prompt = Array.isArray(promptInput)
    ? promptInput.map(m => `${m.role.toUpperCase()}:\n${m.content}`).join("\n\n")
    : promptInput;

  // Trim whitespace for more reliable caching
  prompt = typeof prompt === 'string' ? prompt.trim() : prompt;

  // Check cache (unless explicitly disabled)
  if (options.cache !== false && aiCache.has(prompt)) {
    logger.info("Retrieved response from AI cache");
    return aiCache.get(prompt);
  }

  // Try OpenRouter first (more reliable)
  try {
    const result = await callOpenRouter(prompt, options);
    if (options.cache !== false) aiCache.set(prompt, result);
    return result;
  } catch (error) {
    // Silently fallback unless it's a critical logic error
  }

  // Fallback to Gemini
  try {
    const result = await callGemini(prompt, options);
    if (options.cache !== false) aiCache.set(prompt, result);
    return result;
  } catch (error) {
    console.error(`[AI] All AI services failed: ${error.message}`);

    // Final emergency fallback if requested
    if (options.fallbackType) {
      return getFallbackResponse(options.fallbackType);
    }

    throw new Error("All AI services unavailable. Please try again later.");
  }
}

/* =====================================================
   RESUME ANALYSIS
===================================================== */

export async function analyzeResume(resumeText) {
  // Truncate resume text to prevent token overflow (approx 8k chars)
  const truncatedResume = typeof resumeText === 'string'
    ? resumeText.substring(0, 8000)
    : resumeText;

  const prompt = `You are an expert resume analyzer. Analyze this resume and extract information in valid JSON format.

Resume:
${truncatedResume}

Return ONLY a valid JSON object with this exact structure. No markdown, no explanations, no extra text:
{
  "resumeScore": 75,
  "skills": ["JavaScript", "React", "Node.js"],
  "missingSkills": ["TypeScript", "Docker", "System Design"],
  "experienceLevel": "Mid-Level",
  "yearsOfExperience": 3,
  "recommendedRoles": ["Frontend Developer", "Full Stack Developer"],
  "projects": [
    {
      "title": "Project Name",
      "description": "Brief description",
      "technologies": ["Tech1", "Tech2"]
    }
  ]
}`;

  try {
    const result = await callAI(prompt, {
      maxTokens: TOKEN_LIMITS.RESUME,
      temperature: 0.2,
      fallbackType: "resume"
    });

    const requiredFields = ["resumeScore", "skills", "experienceLevel", "yearsOfExperience"];
    validateAIResponse(result, requiredFields, "Resume Analysis");

    // Ensure all required fields exist with defaults and normalization
    return {
      resumeScore: Math.min(100, Math.max(0, parseInt(result.resumeScore) || 0)),
      skills: Array.isArray(result.skills) ? result.skills.slice(0, 20) : [],
      missingSkills: Array.isArray(result.missingSkills) ? result.missingSkills.slice(0, 15) : [],
      experienceLevel: result.experienceLevel || "Entry Level",
      yearsOfExperience: Math.max(0, parseInt(result.yearsOfExperience) || 0),
      recommendedRoles: Array.isArray(result.recommendedRoles) ? result.recommendedRoles.slice(0, 5) : [],
      projects: Array.isArray(result.projects) ? result.projects.slice(0, 5) : []
    };
  } catch (error) {
    console.error("Resume analysis error:", error);
    return getFallbackResponse("resume");
  }
}

/* =====================================================
   INTERVIEW QUESTION GENERATION
===================================================== */

export async function generateInterviewQuestions({
  role,
  experience,
  skills,
  projects,
  missingSkills = [],
  experienceLevel = "Entry Level",
  mode = "technical",
  difficultyLevel = "intermediate",
  targetCompany = "",
  focusTopics = [],
  questionCount = 5 // Reduced default count for token efficiency
}) {
  const projectList = Array.isArray(projects) && projects.length
    ? projects.map((p, i) => `  ${i + 1}. ${typeof p === 'string' ? p : `${p.title} — ${p.description || ''} (${(p.technologies || []).join(', ')})`}`).join('\n')
    : '  None provided';

  const skillList = Array.isArray(skills) && skills.length ? skills.join(', ') : 'None';
  const missingList = Array.isArray(missingSkills) && missingSkills.length ? missingSkills.slice(0, 5).join(', ') : 'None identified';

  const difficultyFocus = {
    beginner: 'Focus on fundamentals, basic concepts, and simple practical coding. Avoid heavy system design.',
    intermediate: 'Balance between fundamentals and practical coding. Include some scenario-based thinking.',
    advanced: 'Deep technical questions, system design, architecture tradeoffs, and complex scenarios.'
  }[difficultyLevel] || '';

  const prompt = `You are a senior software engineer from a top tech company (Google, Amazon, or Meta), conducting a real interview.
Your style is conversational, analytical, and occasionally challenging. You dive deeply on weak answers.

Candidate Profile:
  Role Target: ${role}
  Target Company: ${targetCompany || 'General Industry'}
  Experience Level: ${experienceLevel} (${experience})
  Interview Mode: ${mode === 'technical' ? 'Technical' : 'HR / Behavioral'}
  Difficulty Level: ${difficultyLevel.charAt(0).toUpperCase() + difficultyLevel.slice(1)}
  Preferred Tone: Professional
  Focus Topics: ${Array.isArray(focusTopics) && focusTopics.length ? focusTopics.join(', ') : 'Standard topics for this role'}
  
Skills Detected: ${skillList}
Missing Skills (gaps to probe): ${missingList}

Projects Built:
${projectList}

Interview Strategy:
- Ask project-based deep-dive questions that verify the candidate actually built what they claim
- Test debugging ability and real-world problem solving
- Include scenario-based architecture thinking
- Probe the identified skill gaps subtly
- TONE: Maintain a professional and high-standard interview tone throughout the session.
- FOCUS: Heavily weight questions towards these topics: ${Array.isArray(focusTopics) && focusTopics.length ? focusTopics.join(', ') : 'Standard role-based topics'}.
- COMPANY: If provided, tailor questions towards ${targetCompany}'s typical interview style and culture.
- ${difficultyFocus}

Generate EXACTLY 10 interview questions. This is CRITICAL. If you return fewer than 10, the interview session will fail.
Distribution:
- Questions 1-2: conceptual fundamentals
- Questions 3-4: scenario or debugging
- Questions 5-6: project deep-dive
- Questions 7-8: technical depth or system-design
- Questions 9-10: behavioral or role-specific culture fit

Return ONLY a valid JSON array. Allowed 'type' values: conceptual, debugging, scenario, project, system-design, behavioral. No markdown:
[
  {
    "question": "Your interview question here",
    "type": "conceptual | debugging | scenario | project | system-design | behavioral",
    "difficulty": "easy | medium | hard",
    "expectedKeywords": ["keyword1", "keyword2"]
  }
]`;

  try {
    const result = await callAI(prompt, {
      temperature: 0.7,
      maxTokens: TOKEN_LIMITS.QUESTIONS,
      fallbackType: "questions"
    });

    if (!Array.isArray(result)) throw new Error("Expected array of questions");
    return result.slice(0, questionCount);
  } catch (error) {
    console.error("Question generation fallback triggered:", error.message);
    return getFallbackResponse("questions");
  }
}

/* =====================================================
   ANSWER EVALUATION
===================================================== */

export async function evaluateCandidateAnswer({
  question,
  candidateAnswer,
  role = '',
  questionType = 'general'
}) {
  const prompt = `You are a senior technical interviewer evaluating a candidate's interview response.

Question:
"${question}"

Question Type: ${questionType}
Candidate Role: ${role || 'Software Engineer'}

Candidate Answer:
"${candidateAnswer}"

Evaluate this answer holistically across multiple dimensions. Be fair but rigorous.

Return ONLY a valid JSON object. No markdown, no explanations:
{
  "score": <number 0-10, overall answer quality>,
  "communication": <number 0-10, clarity and structure of response>,
  "technicalAccuracy": <number 0-10, correctness of technical content>,
  "problemSolving": <number 0-10, quality of reasoning and approach>,
  "confidence": <number 0-10, estimated confidence from response depth>,
  "feedback": "<2-3 sentence specific feedback on this answer>",
  "modelAnswer": "<ideal answer a senior engineer would give>",
  "improvementTips": ["<specific tip 1>", "<specific tip 2>"]
}`;

  try {
    const result = await callAI(prompt, {
      temperature: 0.3,
      maxTokens: TOKEN_LIMITS.EVALUATION,
      fallbackType: "evaluation"
    });

    const requiredFields = ["score", "feedback", "modelAnswer"];
    return validateAIResponse(result, requiredFields, "Evaluation");
  } catch (error) {
    return getFallbackResponse("evaluation");
  }
}

/* =====================================================
   INTERVIEW PERFORMANCE ANALYSIS
===================================================== */

export async function analyzeInterviewPerformance(interviewData) {
  const prompt = `
Analyze this interview session data to determine raw scores.

Session Data:
${JSON.stringify(interviewData)}

Return ONLY raw JSON. Do NOT include markdown or explanations.

Format:
{
 "technicalScore": number (0-100),
 "communicationScore": number (0-100),
 "problemSolvingScore": number (0-100)
}
`;

  return callAI(prompt, { temperature: 0.2, maxTokens: 500 });
}

/* =====================================================
   FINAL INTERVIEW REPORT
===================================================== */

export async function generateFinalReport(interviewData) {
  const answeredCount = interviewData.questions?.filter(q => q.answer)?.length || 0;
  const avgScore = answeredCount > 0
    ? (interviewData.questions.filter(q => q.answer).reduce((sum, q) => sum + (q.evaluation?.score || 0), 0) / answeredCount).toFixed(1)
    : 0;

  const prompt = `You are a senior hiring manager at a top tech company reviewing a completed technical interview.

Candidate Information:
  Role: ${interviewData.role}
  Experience: ${interviewData.experience}
  Difficulty: ${interviewData.difficultyLevel || 'intermediate'}
  Interview Mode: ${interviewData.mode}
  Questions Answered: ${answeredCount}/10
  Average Score: ${avgScore}/10

Interview Q&A Summary:
${(interviewData.questions || []).filter(q => q.answer).map((q, i) =>
    `Q${i + 1} [${q.type || 'general'}]: ${q.question}\nScore: ${q.evaluation?.score || 0}/10 | A: ${(q.answer || '').substring(0, 150)}...`
  ).join('\n\n')}

Generate a comprehensive, honest final candidate assessment report.

Return ONLY a valid JSON object. No markdown, no explanations:
{
  "overallScore": <number 0-100>,
  "hireProbability": "<percentage string e.g. '72%'>",
  "candidateLevel": "<Fresher | Junior Developer | Mid-Level Developer | Senior Developer | Lead Engineer>",
  "summary": "<2-3 sentence executive summary of candidate performance>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"],
  "areasOfImprovement": ["<area 1>", "<area 2>", "<area 3>"],
  "recommendedLearningPath": ["<topic 1>", "<topic 2>", "<topic 3>"],
  "suggestedResources": ["<resource 1 e.g. 'LeetCode for DSA practice'>", "<resource 2>"],
  "hiringRecommendation": "Strong Hire | Hire | No Hire"
}`;

  try {
    const result = await callAI(prompt, {
      temperature: 0.4,
      maxTokens: TOKEN_LIMITS.REPORT,
      fallbackType: "report"
    });

    const requiredFields = ["overallScore", "summary", "hiringRecommendation"];
    return validateAIResponse(result, requiredFields, "Final Report");
  } catch (error) {
    return getFallbackResponse("report");
  }
}

/* =====================================================
   FOLLOW-UP QUESTION GENERATOR
===================================================== */

export async function generateFollowUpQuestion({
  previousQuestion,
  candidateAnswer,
  lastScore = 5,
  role = '',
  questionNumber = 1
}) {
  // Score-based adaptive difficulty
  let difficultyInstruction;
  if (lastScore < 4) {
    difficultyInstruction = 'The candidate struggled. Ask a SIMPLER clarification question that helps them demonstrate basic understanding of the same concept. Be encouraging.';
  } else if (lastScore >= 4 && lastScore <= 7) {
    difficultyInstruction = 'The candidate gave a decent answer. Ask a DEEPER technical follow-up that tests their understanding at the next level.';
  } else {
    difficultyInstruction = 'The candidate answered very well. Escalate to a SYSTEM DESIGN or architectural thinking question that challenges them at a senior level.';
  }

  const prompt = `You are a senior interviewer from a top tech company conducting a live interview for a ${role || 'Software Engineer'} role.

Previous Question:
${previousQuestion}

Candidate's Answer (scored ${lastScore}/10):
${candidateAnswer}

Adaptive Difficulty Instruction:
${difficultyInstruction}

Generate a single, natural follow-up question that flows naturally from this conversation.
The question should sound like a real interviewer speaking, not a textbook.

Return ONLY a valid JSON object. No markdown, no explanations:
{
  "followUpQuestion": "<the follow-up question>",
  "difficulty": "easy | medium | hard",
  "type": "conceptual | debugging | scenario | system-design | behavioral"
}`;

  try {
    const result = await callAI(prompt, {
      temperature: 0.6,
      maxTokens: TOKEN_LIMITS.FOLLOWUP,
      fallbackType: "followup"
    });

    const requiredFields = ["followUpQuestion"];
    return validateAIResponse(result, requiredFields, "Follow-up Question");
  } catch (error) {
    return getFallbackResponse("followup");
  }
}

/* =====================================================
   AI INSIGHTS GENERATION
===================================================== */

export async function generateAIInsights({
  role,
  overallScore,
  consistency,
  improvementRate,
  skillAnalysis,
  recentFeedback = []
}) {
  const prompt = `You are a senior technical career coach and hiring expert. Analyze a candidate's recent interview performance data and provide 3-4 personalized, high-value insights.

Candidate Context:
- Target Role: ${role || 'Software Engineer'}
- Current Average Score: ${overallScore}%
- Performance Consistency: ${consistency}%
- Improvement Rate: ${improvementRate}%
- Skill Performance: ${JSON.stringify(skillAnalysis)}
- Recent Interview Feedback Snippets:
${recentFeedback.map((f, i) => `  ${i + 1}. ${f}`).join('\n')}

Task:
Generate 3-4 localized, actionable insights. Each insight must have:
1. "type": "success" (for strengths/positives), "warning" (for gaps/risks), or "info" (for neutral observations/tips)
2. "title": A short, impactful headline (4-6 words)
3. "description": A concise, supportive explanation and a clear action item (15-25 words)

Style Guidelines:
- Be encouraging but professional (like a mentor).
- Use specific data points from the stats provided.
- Avoid generic advice; make it feel personalized to their specific scores.
- Return EXACTLY a JSON array of 3-4 objects.

Return ONLY a valid JSON array. No markdown, no explanations:
[
  {
    "type": "success | warning | info",
    "title": "Insight Title Here",
    "description": "Insight description and action item here."
  }
]`;

  try {
    const result = await callAI(prompt, {
      temperature: 0.6,
      maxTokens: 800
    });

    if (!Array.isArray(result)) throw new Error("Expected array of insights");
    return result.slice(0, 4);
  } catch (error) {
    console.error("AI Insights generation failed:", error.message);
    return [
      {
        type: "success",
        title: "Strong Technical Foundation",
        description: `Your average score of ${overallScore}% indicates a solid grasp of core concepts. Continue refining your system design skills.`
      },
      {
        type: "info",
        title: "Maintain Practice Momentum",
        description: "Consistency is key to interview success. Aim for at least two mock sessions per week to keep your communication sharp."
      }
    ];
  }
}

/* =====================================================
   EXPORT SERVICE
===================================================== */

export default {
  analyzeResume,
  generateInterviewQuestions,
  evaluateCandidateAnswer,
  analyzeInterviewPerformance,
  generateFinalReport,
  generateFollowUpQuestion,
  generateAIInsights,
  callAI
};
