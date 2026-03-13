import User from '../models/User.js';
import Interview from '../models/interview.js';
import geminiService from './gemini.service.js';

/**
 * Achievement Definitions (Static template)
 */
const ACHIEVEMENT_TEMPLATES = [
    {
        id: 'FIRST_INTERVIEW',
        title: 'First Word',
        description: 'Complete your first ever AI-powered interview session.',
        icon: 'Star',
        target: 1,
        reward: '+50 XP'
    },
    {
        id: 'COMMUNICATION_PRO',
        title: 'Communication Pro',
        description: 'Average 85+ score in Communication over 5 interviews.',
        icon: 'ShieldCheck',
        target: 5,
        reward: 'Pro Badge'
    },
    {
        id: 'FAST_LEARNER',
        title: 'Fast Learner',
        description: 'Improve your technical score by 20% within a week.',
        icon: 'Zap',
        target: 20, // percentage improvement
        reward: '+200 XP'
    },
    {
        id: 'INTERVIEW_MASTER',
        title: 'Interview Master',
        description: 'Complete 10 Mock interviews across all categories.',
        icon: 'Trophy',
        target: 10,
        reward: 'Master Certificate'
    }
];

export const evaluateAchievements = async (userId) => {
    try {
        const user = await User.findById(userId);
        const interviews = await Interview.find({ userId, status: 'completed' }).sort({ createdAt: -1 });

        if (!user || interviews.length === 0) return;

        // Initialize achievements if empty
        if (!user.achievements || user.achievements.length === 0) {
            user.achievements = ACHIEVEMENT_TEMPLATES.map(t => ({
                ...t,
                progress: 0,
                status: 'locked'
            }));
        }

        // Logic-based evaluation
        const firstInterview = user.achievements.find(a => a.id === 'FIRST_INTERVIEW');
        if (firstInterview && firstInterview.status !== 'unlocked') {
            firstInterview.progress = 1;
            firstInterview.status = 'unlocked';
            firstInterview.unlockedAt = new Date();
            user.xp += 50;
        }

        const interviewMaster = user.achievements.find(a => a.id === 'INTERVIEW_MASTER');
        if (interviewMaster && interviewMaster.status !== 'unlocked') {
            interviewMaster.progress = interviews.length;
            if (interviewMaster.progress >= interviewMaster.target) {
                interviewMaster.status = 'unlocked';
                interviewMaster.unlockedAt = new Date();
            } else if (interviewMaster.progress > 0) {
                interviewMaster.status = 'in-progress';
            }
        }

        // AI-based evaluation via Gemini
        // We'll prepare a summary of performance for Gemini to analyze
        const performanceSummary = interviews.map(i => ({
            date: i.createdAt,
            overallScore: i.finalReport?.overallScore || 0,
            technical: i.performance?.technicalScore || 0,
            communication: i.performance?.communicationScore || 0
        }));

        const prompt = `You are an achievement system evaluator for IntilliHire. Analyze the user's interview history and decide progress for these specific achievements:
        
        Achievements to Evaluate:
        1. COMMUNICATION_PRO: Target is an average of 85+ in communication score over 5 interviews.
        2. FAST_LEARNER: Target is a 20% improvement in technical score compared to their first interview.
        
        User Performance History:
        ${JSON.stringify(performanceSummary)}
        
        Current Achievement Progress:
        ${JSON.stringify(user.achievements.filter(a => ['COMMUNICATION_PRO', 'FAST_LEARNER'].includes(a.id)))}
        
        Return ONLY a JSON object with updated progress (0-100) or status for these two achievements. 
        Example format:
        {
            "COMMUNICATION_PRO": { "progress": 3, "status": "in-progress" },
            "FAST_LEARNER": { "progress": 15, "status": "in-progress" }
        }
        
        If an achievement is already 'unlocked', do not change its status but you can update progress.`;

        try {
            const aiResult = await geminiService.callAI(prompt, { temperature: 0.2 });
            
            if (aiResult.COMMUNICATION_PRO) {
                const a = user.achievements.find(acc => acc.id === 'COMMUNICATION_PRO');
                if (a && a.status !== 'unlocked') {
                    a.progress = aiResult.COMMUNICATION_PRO.progress;
                    a.status = aiResult.COMMUNICATION_PRO.status;
                    if (a.status === 'unlocked') a.unlockedAt = new Date();
                }
            }

            if (aiResult.FAST_LEARNER) {
                const a = user.achievements.find(acc => acc.id === 'FAST_LEARNER');
                if (a && a.status !== 'unlocked') {
                    a.progress = aiResult.FAST_LEARNER.progress;
                    a.status = aiResult.FAST_LEARNER.status;
                    if (a.status === 'unlocked') a.unlockedAt = new Date();
                }
            }
        } catch (aiErr) {
            console.error("AI Achievement evaluation failed:", aiErr.message);
        }

        // Update User Stats (Level, XP)
        // Simple XP to Level logic
        const experienceToNextLevel = user.level * 1000;
        if (user.xp >= experienceToNextLevel) {
            user.level += 1;
            // Optionally reward level up
        }

        // Streak Logic
        const today = new Date().setHours(0,0,0,0);
        const lastActivity = user.lastActivityAt ? new Date(user.lastActivityAt).setHours(0,0,0,0) : 0;
        
        if (today === lastActivity) {
            // Already active today
        } else if (today - lastActivity === 86400000) {
            user.streak += 1;
        } else {
            user.streak = 1;
        }
        user.lastActivityAt = new Date();

        await user.save();
        return user.achievements;

    } catch (error) {
        console.error("Error in evaluateAchievements:", error);
        throw error;
    }
};

export default {
    evaluateAchievements
};
