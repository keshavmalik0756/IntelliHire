import {
  Star, Brain, Users, Shield, Target,
  Lightbulb, TrendingUp, BookMarked, Clock,
  Eye, Mic, FileText, Flame, CheckCircle,
  Zap, BarChart3, Award, ChevronRight, Video, Play
} from "lucide-react";

/* ----------------------------------
   CATEGORIES
   Color Map:
   - general:     Amber  (Core)
   - technical:   Indigo (Tech)
   - behavioral:  Violet (EQ)
   - hr:          Rose   (HR)
   - preparation: Cyan   (Prep)
---------------------------------- */

export const CATEGORIES = [
  { 
    id: "general", 
    label: "Core", 
    icon: Star, 
    color: "amber", 
    gradient: "from-amber-500 to-orange-500",
    light: "bg-amber-50 text-amber-600 border-amber-100",
    glow: "border-amber-300",
    tab: "bg-amber-600 shadow-amber-100"
  },
  { 
    id: "technical", 
    label: "Technical", 
    icon: Brain, 
    color: "indigo", 
    gradient: "from-indigo-500 to-blue-600",
    light: "bg-indigo-50 text-indigo-600 border-indigo-100",
    glow: "border-indigo-300",
    tab: "bg-indigo-600 shadow-indigo-100"
  },
  { 
    id: "behavioral", 
    label: "Behavioral", 
    icon: Users, 
    color: "violet", 
    gradient: "from-violet-500 to-purple-600",
    light: "bg-violet-50 text-violet-600 border-violet-100",
    glow: "border-violet-300",
    tab: "bg-violet-600 shadow-violet-100"
  },
  { 
    id: "hr", 
    label: "HR", 
    icon: Shield, 
    color: "rose", 
    gradient: "from-rose-500 to-pink-600",
    light: "bg-rose-50 text-rose-600 border-rose-100",
    glow: "border-rose-300",
    tab: "bg-rose-600 shadow-rose-100"
  },
  { 
    id: "preparation", 
    label: "Prep", 
    icon: Target, 
    color: "cyan", 
    gradient: "from-cyan-500 to-teal-500",
    light: "bg-cyan-50 text-cyan-600 border-cyan-100",
    glow: "border-cyan-300",
    tab: "bg-cyan-600 shadow-cyan-100"
  }
];

/* ----------------------------------
   TIPS
---------------------------------- */

export const TIPS = {
  general: [
    {
      title: "Master First Impressions",
      description: "Dress slightly above company standard. Maintain strong posture and open body language. Ensure background is pristine and lighting is diffuse and frontal.",
      icon: Star, level: "Crucial", readTime: "2 min",
      tags: ["presentation", "video"],
      impact: 95,
      proTip: "Record yourself on Zoom before the call to catch bad angles or lighting."
    },
    {
      title: "Corporate Reconnaissance",
      description: "Deep dive into recent press releases, earnings calls, and engineering blogs. Know their roadmap better than their own candidates.",
      icon: Eye, level: "Advantage", readTime: "4 min",
      tags: ["research", "company"],
      impact: 88,
      proTip: "Use LinkedIn to map the team structure 48h before your call."
    },
    {
      title: "Deploy Active Listening",
      description: "Take a 2-second pause before answering every question. Paraphrase complex multi-part questions back to confirm alignment before diving in.",
      icon: Mic, level: "Crucial", readTime: "2 min",
      tags: ["communication", "psychology"],
      impact: 91,
      proTip: "\"Just to confirm I heard you right — you're asking about X and Y?\""
    },
    {
      title: "Architect Reverse Questions",
      description: "Prepare 5 high-signal questions. Avoid generic ones. E.g., \"What is the largest unsolved bottleneck your team faces today?\" signals maturity.",
      icon: FileText, level: "Advantage", readTime: "3 min",
      tags: ["strategy", "questions"],
      impact: 84,
      proTip: "Never say \"I have no questions.\" It signals low curiosity."
    },
    {
      title: "Energy State Management",
      description: "Do 5 min of power poses before the call. Avoid caffeine spikes. Match the interviewer's energy level — mirror their pace and vocabulary.",
      icon: Flame, level: "Advanced", readTime: "2 min",
      tags: ["mindset", "psychology"],
      impact: 79,
      proTip: "A 10-min run 2 hours before boosts focus for 4+ hours."
    },
    {
      title: "Silence is a Superpower",
      description: "Comfortable pauses signal confidence. Never fill silence with filler words. \"Hmm, let me think through this carefully\" beats rambling every time.",
      icon: CheckCircle, level: "Advanced", readTime: "2 min",
      tags: ["communication", "mindset"],
      impact: 77,
      proTip: "Practice 3-second pauses deliberately in everyday conversations."
    }
  ],
  technical: [
    {
      title: "Vocalize the Abstract",
      description: "Never code in silence. Treat every technical interview as pair-programming with a senior engineer. Narrate your intent before writing a single line.",
      icon: Brain, level: "Crucial", readTime: "3 min",
      tags: ["coding", "communication"],
      impact: 97,
      proTip: "\"I'm going to use a sliding window here to get O(N) instead of O(N²).\""
    },
    {
      title: "Brute Force First",
      description: "Acknowledge the O(N²) baseline, implement it cleanly, then pivot to optimization. Many candidates fail by jumping to cleverness prematurely.",
      icon: Zap, level: "Crucial", readTime: "3 min",
      tags: ["algorithms", "strategy"],
      impact: 94,
      proTip: "A slow correct solution beats a fast broken one every time."
    },
    {
      title: "Edge Case Interrogation",
      description: "Before writing logic, enumerate edge cases aloud: null inputs, empty arrays, negative numbers, overflow. Write test cases first.",
      icon: Lightbulb, level: "Advantage", readTime: "2 min",
      tags: ["testing", "quality"],
      impact: 89,
      proTip: "Ask: \"Should I handle null input?\" — it shows production mindset."
    },
    {
      title: "System Design Scaling",
      description: "Always clarify read/write ratio, expected QPS, data size, and latency SLA before drawing boxes. Designing without constraints is guessing.",
      icon: BarChart3, level: "Advanced", readTime: "4 min",
      tags: ["system design", "architecture"],
      impact: 92,
      proTip: "\"How many daily active users are we designing for?\" — ask this first."
    },
    {
      title: "Complexity Automatically",
      description: "After every solution, state the time and space complexity unprompted. It signals seniority and understanding of operational costs.",
      icon: Eye, level: "Advantage", readTime: "2 min",
      tags: ["algorithms", "seniority"],
      impact: 86,
      proTip: "\"This is O(N log N) time and O(N) space — can we do better?\""
    },
    {
      title: "Code Quality Signaling",
      description: "Use descriptive variable names, extract helper functions, and add inline comments. Readable code communicates culture fit.",
      icon: CheckCircle, level: "Advantage", readTime: "2 min",
      tags: ["code quality", "readability"],
      impact: 81,
      proTip: "Write `leftPointer` not `l`. Legibility over brevity under pressure."
    }
  ],
  behavioral: [
    {
      title: "Military-Grade STAR",
      description: "Situation (10%), Task (10%), Action (60% — use \"I\"), Result (20% — hard ROI metrics). Practice until the ratio is muscle memory.",
      icon: Award, level: "Crucial", readTime: "4 min",
      tags: ["STAR", "storytelling"],
      impact: 98,
      proTip: "\"We grew revenue by 30%\" → \"I redesigned the funnel contributing to a 30% lift.\""
    },
    {
      title: "The Evidence Vault",
      description: "Maintain 10–15 modular work stories that can pivot to address leadership, conflict, failure, success, and ownership prompts.",
      icon: BookMarked, level: "Crucial", readTime: "3 min",
      tags: ["preparation", "stories"],
      impact: 95,
      proTip: "Tag each story with the theme it answers so you can recall it instantly."
    },
    {
      title: "Diplomatic Dissent",
      description: "When asked about conflicts, focus entirely on process failure or misaligned metrics rather than personal friction. Never speak negatively.",
      icon: Shield, level: "Advantage", readTime: "3 min",
      tags: ["conflict", "professionalism"],
      impact: 88,
      proTip: "\"The team had unclear success metrics which led to conflicting priorities.\""
    },
    {
      title: "Post-Mortem Accountability",
      description: "When discussing failures, own the mistake fully without excuses. Outline the systemic safeguards you implemented afterward.",
      icon: TrendingUp, level: "Advanced", readTime: "3 min",
      tags: ["failure", "ownership"],
      impact: 91,
      proTip: "Interviewers want accountability + growth, not blame-shifting."
    },
    {
      title: "Quantify Everything",
      description: "Convert qualitative impact to numbers. \"I improved performance\" → \"I reduced API latency by 340ms, cutting our P95 from 1.2s to 860ms.\"",
      icon: BarChart3, level: "Crucial", readTime: "2 min",
      tags: ["metrics", "impact"],
      impact: 96,
      proTip: "Go back through your stories now and add one hard metric to each."
    },
    {
      title: "Leadership Without Title",
      description: "Frame moments of initiative, mentorship, or cross-team coordination as leadership. Every engineer is a leader on some dimension.",
      icon: Star, level: "Advantage", readTime: "2 min",
      tags: ["leadership", "seniority"],
      impact: 83,
      proTip: "\"I organized a knowledge-sharing session for 12 engineers counts as leadership.\""
    }
  ],
  hr: [
    {
      title: "The Perfect Pitch",
      description: "Structure \"Tell me about yourself\" using Present-Past-Future. Role → past → why you're excited about this future. Under 90 seconds.",
      icon: Mic, level: "Crucial", readTime: "3 min",
      tags: ["pitch", "introduction"],
      impact: 97,
      proTip: "End with a hook: \"...which is exactly why this role at [Company] excites me.\""
    },
    {
      title: "Mission Alignment",
      description: "Map achievements directly to 2–3 of the company's core values. Reference their actual values page, not generic corporate speak.",
      icon: Target, level: "Crucial", readTime: "3 min",
      tags: ["culture", "values"],
      impact: 93,
      proTip: "Say the value explicitly: \"Your value of Customer Obsession resonates because...\""
    },
    {
      title: "Strategic Vulnerability",
      description: "For weaknesses, choose a non-critical soft skill you are actively improving. Pair it with a concrete action: course, mentor, or habit.",
      icon: Zap, level: "Advantage", readTime: "2 min",
      tags: ["self-awareness", "growth"],
      impact: 86,
      proTip: "\"I struggle with public speaking, so I joined Toastmasters 6 months ago.\""
    },
    {
      title: "Compensation Navigation",
      description: "Never give the first salary number. Respond with researched market data: \"I see the market band for this role at X–Y.\" Then anchor high.",
      icon: TrendingUp, level: "Advanced", readTime: "3 min",
      tags: ["salary", "negotiation"],
      impact: 90,
      proTip: "Use the phrase \"total comp\" not just salary — include equity and benefits."
    },
    {
      title: "Timeline Narrative",
      description: "Every job transition should have a forward-looking narrative. \"I sought a larger leadership scope\" beats toxic environment complaints.",
      icon: ChevronRight, level: "Advantage", readTime: "2 min",
      tags: ["narrative", "career"],
      impact: 85,
      proTip: "Future curiosity + growth should always be your framing."
    }
  ],
  preparation: [
    {
      title: "AI Simulation Runs",
      description: "Use the Mock Engine 3–5x per week, rotating weak domains. Track your AI score trajectory and aim for a +5 point per-week progression.",
      icon: Play, level: "Crucial", readTime: "2 min",
      tags: ["practice", "ai"],
      impact: 99,
      proTip: "Always review your AI analysis playback after every session."
    },
    {
      title: "Hardware Redundancy",
      description: "Have a 4G mobile hotspot ready as backup. Use wired ethernet if possible. Test your audio setup the night before — not the morning of.",
      icon: Video, level: "Crucial", readTime: "2 min",
      tags: ["setup", "technical"],
      impact: 91,
      proTip: "Use a USB microphone instead of your laptop mic for better quality."
    },
    {
      title: "Command Center Setup",
      description: "Position camera slightly above eye level. Use diffuse frontal lighting. Clean, minimal backdrop.",
      icon: Eye, level: "Advantage", readTime: "2 min",
      tags: ["video", "environment"],
      impact: 87,
      proTip: "A bookshelf slightly out of focus in the background signals depth."
    },
    {
      title: "Resume Telemetry",
      description: "Every bullet is fair game for deep dive. Be able to draw the architecture of any project from 3 years ago on a virtual whiteboard.",
      icon: FileText, level: "Advanced", readTime: "3 min",
      tags: ["resume", "depth"],
      impact: 94,
      proTip: "Walk through each line and ask \"can I defend every word here?\""
    },
    {
      title: "D-1 Protocol",
      description: "The night before: confirm meeting link, charge all devices, preparing water. Get 7+ hours of sleep. No cramming after 8 PM.",
      icon: Clock, level: "Crucial", readTime: "2 min",
      tags: ["logistics", "mindset"],
      impact: 92,
      proTip: "Write a half-page brain dump before sleeping to clear anxiety."
    }
  ]
};

/* ----------------------------------
   STATS
---------------------------------- */

export const STATS = [
  { label: "Expert Tips", value: 28, suffix: "+", icon: Lightbulb, color: "amber" },
  { label: "Score Boost", value: 18, suffix: "%", icon: TrendingUp, color: "indigo" },
  { label: "Categories", value: 5, suffix: "", icon: BookMarked, color: "violet" },
  { label: "Read Time", value: 12, suffix: "m", icon: Clock, color: "rose" }
];