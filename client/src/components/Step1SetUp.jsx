import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { 
    User, 
    Briefcase, 
    Building2, 
    Target, 
    Zap, 
    ShieldCheck, 
    UploadCloud, 
    FileText, 
    CheckCircle2, 
    ChevronRight,
    Sparkles,
    Settings2,
    MessageSquare,
    BrainCircuit,
    Wand2,
    PlayCircle
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import PrimaryButton from "./common/PrimaryButton";

function Step1SetUp({ onStart }) {
    const location = useLocation();
    const initialCategory = location.state?.category || "";

    const [role, setRole] = useState(initialCategory === "Technical" ? "Software Engineer" : "");
    const [experience, setExperience] = useState("");
    const [targetCompany, setTargetCompany] = useState("");
    const [mode, setMode] = useState(initialCategory === "Technical" ? "technical" : initialCategory === "HR" ? "hr" : "technical");
    const [difficultyLevel, setDifficultyLevel] = useState(initialCategory === "Technical" ? "advanced" : "intermediate");
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [focusTopics, setFocusTopics] = useState([]);
    const [resumeAnalysis, setResumeAnalysis] = useState(null);
    const [analysisDone, setAnalysisDone] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);

    const TOPIC_SUGGESTIONS = {
        technical: ["React", "Node.js", "System Design", "Python", "Data Structures", "Algorithms", "Cloud (AWS)", "Database Optimization"],
        hr: ["Conflict Resolution", "Leadership", "Teamwork", "Career Goals", "Problem Solving", "Adaptability", "Time Management"]
    };

    const toggleTopic = (topic) => {
        setFocusTopics(prev => 
            prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
        );
    };

    // Sync state if category changes
    useEffect(() => {
        if (initialCategory === "Technical") {
            setMode("technical");
            setDifficultyLevel("advanced");
            if (!role) setRole("Software Engineer");
        } else if (initialCategory === "HR") {
            setMode("hr");
            setDifficultyLevel("intermediate");
        } else if (initialCategory === "Behavioral") {
            setMode("hr");
        }
    }, [initialCategory]);

    const handleUpload = async () => {
        if (!resumeFile) return;
        setAnalyzing(true);
        const formData = new FormData();
        formData.append("resume", resumeFile);

        try {
            const { data } = await api.post("/interview/analyze-resume", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (data.success) {
                const analysis = data.data;
                const { skills: extractedSkills, recommendedRoles, yearsOfExperience, projects: extractedProjects } = analysis;
                
                if (extractedSkills) setSkills(extractedSkills);
                if (extractedProjects) setProjects(extractedProjects);
                if (recommendedRoles && recommendedRoles.length > 0 && !role) setRole(recommendedRoles[0]);
                if (yearsOfExperience !== undefined && !experience) setExperience(`${yearsOfExperience} years`);
                
                setResumeAnalysis(analysis);
                setAnalysisDone(true);
            }
        } catch (error) {
            console.error("Error analyzing resume:", error);
            toast.error("Resume analysis failed");
        } finally {
            setAnalyzing(false);
        }
    };

    return(
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 py-12"
        >
            <div className="w-full max-w-7xl grid lg:grid-cols-12 gap-8 items-stretch pt-4">
                
                {/* Left Side: Info & Preparation */}
                <motion.div 
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="lg:col-span-5 flex flex-col justify-between"
                >
                    <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[2.5rem] p-10 shadow-2xl shadow-emerald-500/5 h-full relative overflow-hidden group">
                        {/* Decorative Background Glows */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-emerald-500/20 transition-colors duration-700" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -ml-20 -mb-20 transition-colors duration-700" />

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                                <Sparkles size={14} className="animate-pulse" />
                                Mission Control
                            </div>
                            
                            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                                Launch Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                                    AI Interview
                                </span>
                            </h2>
                            
                            <p className="text-slate-500 text-lg mb-12 leading-relaxed font-medium">
                                Configure your personalized session. Our AI adapts to your target company, role, and focus areas to provide high-fidelity practice.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { icon: Briefcase, title: "Targeted Simulation", desc: "Scenario matched to your specific role and company goals." },
                                    { icon: BrainCircuit, title: "Adaptive Difficulty", desc: "Question complexity evolves based on your performance." },
                                    { icon: ShieldCheck, title: "Industry Standard", desc: "Behavioral and technical patterns from top tech companies." }
                                ].map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + (index * 0.1) }}
                                        className="flex items-start gap-4 p-5 bg-white/50 backdrop-blur-sm border border-slate-100 rounded-2xl hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-300 shadow-sm"
                                    >
                                        <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-200">
                                            <feature.icon size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm mb-1">{feature.title}</h4>
                                            <p className="text-slate-500 text-xs font-medium leading-relaxed">{feature.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: Configuration Console */}
                <motion.div 
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="lg:col-span-7"
                >
                    <div className="bg-white border border-slate-200/60 rounded-[2.5rem] p-8 lg:p-12 shadow-2xl shadow-slate-200/50">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-2xl font-extrabold text-slate-900">Configure Session</h3>
                                <p className="text-slate-400 text-sm font-medium">Fine-tune the interview parameters</p>
                            </div>
                            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
                                <Settings2 size={16} className="text-slate-400" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">v2.0 Active</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Role & Experience Row */}
                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Target Role</label>
                                    <div className="relative group">
                                        <Briefcase className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                        <input 
                                            type="text" 
                                            value={role} 
                                            onChange={(e) => setRole(e.target.value)} 
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-300" 
                                            placeholder="e.g. Software Engineer" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Experience Level</label>
                                    <div className="relative group">
                                        <Target className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                        <input 
                                            type="text" 
                                            value={experience} 
                                            onChange={(e) => setExperience(e.target.value)} 
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-300" 
                                            placeholder="e.g. 2 years, Senior" 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Target Company (New Feature) */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Target Company (Optional)</label>
                                <div className="relative group">
                                    <Building2 className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                    <input 
                                        type="text" 
                                        value={targetCompany} 
                                        onChange={(e) => setTargetCompany(e.target.value)} 
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-300" 
                                        placeholder="e.g. Google, Amazon, Meta" 
                                    />
                                </div>
                            </div>

                            {/* Mode & Tone Row */}
                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Interview Type</label>
                                    <div className="relative group">
                                        <Zap className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors-none pointer-events-none" size={18} />
                                        <select
                                            value={mode}
                                            onChange={(e) => setMode(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl appearance-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 cursor-pointer"
                                        >
                                            <option value="technical">Technical Round</option>
                                            <option value="hr">HR & Behavioral</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Difficulty</label>
                                    <div className="relative group">
                                        <Wand2 className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors-none pointer-events-none" size={18} />
                                        <select
                                            value={difficultyLevel}
                                            onChange={(e) => setDifficultyLevel(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl appearance-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 cursor-pointer"
                                        >
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                            <option value="expert">Expert / Leadership</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Focus Topics (Interactive Chips - New) */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Focus Topics</label>
                                    <span className="text-[10px] font-bold text-slate-400">{focusTopics.length} Selected</span>
                                </div>
                                <div className="flex flex-wrap gap-2 p-5 bg-emerald-50/30 border border-emerald-100/60 rounded-[1.5rem] min-h-[90px] shadow-inner-sm">
                                    {TOPIC_SUGGESTIONS[mode]?.map((topic) => {
                                        const isSelected = focusTopics.includes(topic);
                                        return (
                                            <button
                                                key={topic}
                                                onClick={() => toggleTopic(topic)}
                                                className={`px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all duration-300 flex items-center gap-2 ${
                                                    isSelected 
                                                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 border-emerald-600" 
                                                    : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-600 hover:shadow-sm"
                                                }`}
                                            >
                                                {isSelected ? (
                                                    <CheckCircle2 size={13} className="text-emerald-100" />
                                                ) : (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                                )}
                                                {topic}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Resume Analysis Section (Enhanced) */}
                            <AnimatePresence mode="wait">
                                {!analysisDone ? (
                                    <motion.div
                                        key="upload"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        onClick={() => !analyzing && document.getElementById("resumeUpload").click()}
                                        className={`group relative border-2 border-dashed rounded-[2rem] p-8 text-center cursor-pointer transition-all duration-500 ${
                                            resumeFile ? "border-emerald-500 bg-emerald-50/30" : "border-slate-200 hover:border-emerald-400 hover:bg-slate-50"
                                        }`}
                                    >
                                        <div className="relative z-10">
                                            <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
                                                resumeFile ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "bg-slate-100 text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600"
                                            }`}>
                                                <UploadCloud size={32} />
                                            </div>
                                            <input 
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                id="resumeUpload" 
                                                className="hidden"
                                                onChange={(e)=>setResumeFile(e.target.files[0])}
                                            />
                                            <h4 className="text-slate-900 font-bold mb-1">
                                                {resumeFile ? resumeFile.name : "Smart Resume Integration"}
                                            </h4>
                                            <p className="text-slate-400 text-xs font-medium max-w-xs mx-auto mb-6">
                                                Fast extraction for skills, projects and experience (Optional)
                                            </p>

                                            {resumeFile && (
                                                <motion.button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUpload();
                                                    }}
                                                    disabled={analyzing}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }} 
                                                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl hover:bg-slate-800 transition shadow-xl"
                                                >
                                                    {analyzing ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                            Processing Intelligence...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <BrainCircuit size={16} />
                                                            Analyze for Better Match
                                                        </>
                                                    )}
                                                </motion.button>
                                            )}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="analysis"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-emerald-50/50 border border-emerald-100 rounded-[2rem] p-8 overflow-hidden relative"
                                    >
                                        {/* Background Decoration */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
                                        
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-emerald-600 text-white rounded-lg shadow-lg shadow-emerald-200">
                                                <FileText size={18} />
                                            </div>
                                            <div>
                                                <h3 className="text-slate-900 font-bold text-sm">Resume Analysis Complete</h3>
                                                <p className="text-emerald-600/60 text-[10px] font-bold uppercase tracking-widest">Profiles Synchronized</p>
                                            </div>
                                        </div>

                                        <div className="space-y-6 relative z-10">
                                            {projects.length > 0 && (
                                                <div>
                                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2 ml-1">Key Projects Detected</p>
                                                    <div className="space-y-2">
                                                        {projects.slice(0, 3).map((project, index) => (
                                                            <div key={index} className="flex items-center gap-2 text-slate-600 text-xs py-2 px-3 bg-white/80 rounded-xl border border-white shadow-sm">
                                                                <ChevronRight size={12} className="text-emerald-500" />
                                                                {typeof project === 'string' ? project : project.title}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {skills.length > 0 && (
                                                <div>
                                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-3 ml-1">Detected Skill Graph</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {skills.slice(0, 8).map((skill, index) => (
                                                            <span key={index} className="bg-white text-emerald-700 px-3 py-1 rounded-full text-[10px] font-extrabold border border-emerald-100 shadow-sm">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                        {skills.length > 8 && <span className="text-slate-400 text-[10px] font-bold p-1">+{skills.length - 8} more</span>}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <button 
                                            onClick={() => {setAnalysisDone(false); setResumeFile(null);}}
                                            className="mt-6 text-[10px] font-bold text-slate-400 hover:text-emerald-600 transition-colors"
                                        >
                                            ← Change Resume
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Final Action */}
                            <div className="pt-4">
                                <PrimaryButton
                                    disabled={!role || !experience}
                                    isLoading={isInitializing}
                                    onClick={async () => {
                                        setIsInitializing(true);
                                        try {
                                            await onStart({ 
                                                role, 
                                                experience, 
                                                mode, 
                                                difficultyLevel, 
                                                skills, 
                                                projects, 
                                                resumeAnalysis, 
                                                targetCompany,
                                                focusTopics,
                                                interviewType: "practice" 
                                            });
                                        } finally {
                                            setIsInitializing(false);
                                        }
                                    }}
                                >
                                    Initialize Interview Session
                                </PrimaryButton>
                                <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-4">
                                    Secure AI Session &bull; Real-time Feedback
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div> 
        </motion.div>
    );
}

export default Step1SetUp;