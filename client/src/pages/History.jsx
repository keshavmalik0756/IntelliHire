import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Clock,
    TrendingUp,
    Eye,
    RotateCcw,
    Filter,
    Search,
    ChevronDown,
    BarChart3,
    FileText,
    Download,
    ArrowRight,
    Trash2,
    ArrowLeft
} from 'lucide-react';
import { interviewService } from '../services/interviewService';
import { toast } from 'react-hot-toast';

const History = () => {
    const navigate = useNavigate();
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const categories = ['all', 'Technical', 'HR', 'Behavioral', 'Situational'];
    const sortOptions = [
        { value: 'date', label: 'Latest First' },
        { value: 'score', label: 'Highest Score' },
        { value: 'duration', label: 'Duration' },
    ];

    const fetchInterviewHistory = useCallback(async () => {
        try {
            setLoading(true);
            const response = await interviewService.getInterviewHistory(
                currentPage,
                10,
                { category: filterCategory, search: searchTerm, sortBy }
            );
            
            if (response.success) {
                setInterviews(response.data);
                setTotalPages(response.totalPages || 1);
            }
        } catch (error) {
           console.error('Error fetching interview history:', error);
           toast.error('Failed to load history');
        } finally {
            setLoading(false);
        }
    }, [currentPage, filterCategory, sortBy, searchTerm]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchInterviewHistory();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [fetchInterviewHistory]);

    const handleDeleteInterview = (sessionId) => {
        setDeleteConfirmId(sessionId);
    };

    const confirmDelete = async () => {
        if (!deleteConfirmId) return;
        try {
            const res = await interviewService.deleteInterview(deleteConfirmId);
            if (res.success) {
                toast.success('Session deleted');
                fetchInterviewHistory();
            }
        } catch (error) {
            console.error('Error deleting interview:', error);
            toast.error('Delete failed');
        } finally {
            setDeleteConfirmId(null);
        }
    };

    const handleRetakeInterview = (category) => {
        navigate('/steps', { state: { category } });
    };

    const handleViewResults = (sessionId) => {
        navigate(`/interview/results/${sessionId}`);
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-600';
        if (score >= 60) return 'text-amber-600';
        return 'text-rose-600';
    };

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold uppercase tracking-wider rounded-lg">Completed</span>;
            case 'in-progress':
                return <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> In Progress</span>;
            case 'abandoned':
                return <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-100 text-[10px] font-bold uppercase tracking-wider rounded-lg">Abandoned</span>;
            default:
                return <span className="px-2.5 py-1 bg-slate-50 text-slate-700 border border-slate-100 text-[10px] font-bold uppercase tracking-wider rounded-lg">{status || 'Pending'}</span>;
        }
    };

    if (loading && interviews.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{
                background:'linear-gradient(145deg,#fffbef 0%,#f0fdf4 50%,#eff6ff 100%)',
            }}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-widest animate-pulse">Syncing History...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-20 font-sans relative overflow-hidden" style={{
            background:'linear-gradient(145deg,#fffbef 0%,#f0fdf4 50%,#eff6ff 100%)',
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
                *{font-family:'Inter',sans-serif;}
                .grad-text{
                    background:linear-gradient(120deg,#f59e0b,#10b981,#3b82f6);
                    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
                }
            `}</style>

            {/* Ambient blobs - Matching Auth.jsx */}
            {[
                { w:520, h:520, t:'-12%', l:'-10%', bg:'rgba(251,191,36,.13)' },
                { w:420, h:420, b:'-10%', r:'-8%',  bg:'rgba(16,185,129,.10)' },
                { w:300, h:300, t:'35%',  r:'12%',   bg:'rgba(59,130,246,.08)' },
            ].map(({ w,h,t,l,b,r,bg }, i) => (
                <motion.div key={i}
                    style={{ position:'absolute', width:w, height:h, top:t, left:l, bottom:b, right:r,
                    borderRadius:'60% 40% 70% 30%/50% 60% 40% 50%', background:bg, filter:'blur(70px)', pointerEvents:'none', zIndex: 0 }}
                    animate={{ borderRadius:['60% 40% 70% 30%/50% 60% 40% 50%','40% 60% 30% 70%/60% 40% 60% 40%','60% 40% 70% 30%/50% 60% 40% 50%'] }}
                    transition={{ duration:13, repeat:Infinity, ease:'easeInOut' }}
                />
            ))}

            {/* Dot grid - Matching Auth.jsx */}
            <div style={{ position:'absolute', inset:0,
                backgroundImage:'radial-gradient(rgba(0,0,0,.065) 1px,transparent 1px)',
                backgroundSize:'32px 32px', pointerEvents:'none', zIndex: 0 }}
            />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="flex items-center gap-3 mb-4">
                            <button 
                                onClick={() => navigate('/dashboard')}
                                className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-100 transition-all shadow-sm"
                            >
                                <ArrowLeft size={18} />
                            </button>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                                Session <span className="grad-text">History</span>
                            </h1>
                        </div>
                        <p className="text-sm md:text-base text-slate-500 font-medium max-w-xl">
                            A complete log of your AI interview journey. Review performance, track progress, and refine your skills.
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
                         <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-2xl text-xs font-bold shadow-sm hover:border-emerald-200 hover:bg-emerald-50/30 transition-all">
                            <Download className="w-4 h-4 text-emerald-500" />
                            Export CSV
                        </button>
                    </motion.div>
                </div>

                {/* Filters Bar */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8"
                >
                    {/* Search */}
                    <div className="md:col-span-6 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search sessions, roles, categories..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all placeholder:text-slate-400 shadow-sm"
                        />
                    </div>

                    {/* Category */}
                    <div className="md:col-span-3 relative group">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
                        <select
                            value={filterCategory}
                            onChange={(e) => {
                                setFilterCategory(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 outline-none appearance-none cursor-pointer focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-sm"
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category === 'all' ? 'All Rounds' : `${category} Round`}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                    </div>

                    {/* Sort */}
                    <div className="md:col-span-3 relative group">
                        <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 outline-none appearance-none cursor-pointer focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-sm"
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                    </div>
                </motion.div>

                {/* History List */}
                <div className="space-y-4 min-h-[400px]">
                    <AnimatePresence mode='wait'>
                        {loading && interviews.length > 0 ? (
                           <motion.div 
                                key="loading-overlay"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.7 }}
                                exit={{ opacity: 0 }}
                                className="flex justify-center p-12 bg-white/50 rounded-3xl border border-slate-200 backdrop-blur-sm"
                            >
                                <div className="w-8 h-8 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                           </motion.div>
                        ) : interviews.length === 0 ? (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/80 backdrop-blur-md rounded-[2rem] border border-slate-200/60 p-16 text-center shadow-lg"
                                style={{
                                    boxShadow:'0 8px 12px rgba(0,0,0,.03), 0 32px 80px rgba(0,0,0,.05)',
                                }}
                            >
                                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner rotate-3">
                                    <FileText className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-2">No Sessions Found</h3>
                                <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">
                                    {searchTerm || filterCategory !== 'all'
                                        ? "We couldn't find any sessions matching those filters."
                                        : "You haven't completed any interviews yet. Start your journey today!"
                                    }
                                </p>
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95"
                                >
                                    Start Practice Session <ArrowRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ) : (
                            <div className="space-y-4">
                                {interviews.map((interview, index) => {
                                    const score = interview.finalReport?.overallScore || interview.totalScore || 0;
                                    
                                    return (
                                    <motion.div
                                        key={interview._id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-3xl p-5 sm:p-6 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 relative overflow-hidden"
                                        style={{
                                            boxShadow:'0 4px 6px rgba(0,0,0,.02), 0 10px 20px rgba(0,0,0,.03)',
                                        }}
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                            
                                            <div className="flex-1 flex items-center gap-5 sm:gap-8">
                                                {/* Score Circle */}
                                                <div className="flex-shrink-0 relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-slate-100 shadow-inner flex flex-col items-center justify-center group-hover:border-emerald-100 transition-colors">
                                                     <span className={`text-xl sm:text-2xl font-black ${getScoreColor(score)}`}>{score}</span>
                                                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest -mt-1">Score</span>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col mb-2">
                                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                                            <h3 className="font-bold text-slate-900 text-base sm:text-lg truncate tracking-tight">
                                                                {interview.role || (interview.mode === 'technical' ? 'Technical Interview' : 'HR Interview')}
                                                            </h3>
                                                            {getStatusBadge(interview.status)}
                                                        </div>
                                                        {interview.role && (
                                                            <p className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest bg-emerald-50 w-fit px-2 py-0.5 rounded-md border border-emerald-100/50">
                                                                {interview.mode === 'technical' ? 'Technical' : 'HR'} Round
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs sm:text-sm font-bold text-slate-400">
                                                        <div className="flex items-center gap-1.5 grayscale group-hover:grayscale-0 transition-all">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            {new Date(interview.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 grayscale group-hover:grayscale-0 transition-all text-slate-500">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            {Math.round((interview.duration || 0) / 60)}m
                                                        </div>
                                                        <div className="flex items-center gap-1.5 grayscale group-hover:grayscale-0 transition-all">
                                                            <BarChart3 className="w-3.5 h-3.5" />
                                                            {interview.questions?.length || 0} Questions
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    onClick={() => handleViewResults(interview._id)}
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all shadow-sm active:scale-95"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Review
                                                </button>
                                                <button
                                                    onClick={() => handleRetakeInterview(interview.category || interview.role)}
                                                    className="p-3 bg-slate-50/50 text-slate-400 border border-slate-200 rounded-2xl hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100 transition-all active:scale-95"
                                                    title="Retake Interview"
                                                >
                                                    <RotateCcw className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteInterview(interview._id)}
                                                    className="p-3 bg-slate-50/50 text-slate-400 border border-slate-200 rounded-2xl hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all active:scale-95"
                                                    title="Delete History"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )})}
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Simplified Pagination */}
                {totalPages > 1 && interviews.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center mt-12 mb-10"
                    >
                        <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-slate-200 p-1.5 rounded-2xl shadow-sm gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => {
                                        setCurrentPage(page);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === page
                                        ? 'bg-emerald-600 text-white shadow-md'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Modal - Aligned with Emerald Theme */}
            <AnimatePresence>
                {deleteConfirmId && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden relative"
                        >
                            <div className="p-8 sm:p-10">
                                <div className="w-20 h-20 rounded-3xl bg-rose-50 flex items-center justify-center mb-8 mx-auto rotate-12 group">
                                    <Trash2 className="w-10 h-10 text-rose-500" />
                                </div>
                                <h3 className="text-2xl font-black text-center text-slate-900 mb-2 tracking-tight">Delete Session?</h3>
                                <p className="text-center text-slate-500 mb-10 font-medium text-sm sm:text-base leading-relaxed">
                                    This will permanently remove this session from your history and analytics. This action cannot be undone.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setDeleteConfirmId(null)}
                                        className="px-6 py-4 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-all tracking-wide"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="px-6 py-4 bg-rose-600 text-white font-bold rounded-2xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20 tracking-wide"
                                    >
                                        Delete Forever
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default History;
