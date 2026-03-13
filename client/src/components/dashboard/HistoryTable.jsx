import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Award, ChevronRight, Clock, Box, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CATEGORY_DOT = {
  Technical:   'bg-emerald-500',
  HR:          'bg-slate-500',
  Behavioral:  'bg-amber-500',
  Situational: 'bg-teal-500',
};

const getScoreStyle = (score) => {
  if (score >= 80) return { pill: 'bg-emerald-100 text-emerald-700 border-emerald-200', bar: 'bg-emerald-500' };
  if (score >= 50) return { pill: 'bg-amber-100 text-amber-700 border-amber-200',   bar: 'bg-amber-500'   };
  return             { pill: 'bg-slate-100 text-slate-700 border-slate-200',        bar: 'bg-slate-500'    };
};

const StatusBadge = ({ status }) => {
  const styles = {
    completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
    pending: 'bg-slate-100 text-slate-800 border-slate-200',
    abandoned: 'bg-rose-100 text-rose-800 border-rose-200',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status] || styles.pending}`}>
      {status.replace('-', ' ')}
    </span>
  );
};

const HistoryTable = ({ history }) => {
  const navigate = useNavigate();

  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-slate-200/60 shadow-sm text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
          <Box size={32} />
        </div>
        <h3 className="text-slate-900 font-extrabold text-lg mb-2">No Sessions Yet</h3>
        <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6 font-medium">Your interview history will appear here once you complete your first practice session.</p>
        <motion.button
           whileHover={{ scale: 1.02 }}
           whileTap={{ scale: 0.98 }}
           onClick={() => navigate('/interview')}
           className="px-6 py-2.5 bg-emerald-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-colors"
        >
           Take First Step
        </motion.button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <h3 className="text-slate-900 font-extrabold text-sm tracking-tight flex items-center gap-2 uppercase">
          <Clock size={16} className="text-emerald-500" /> Recent Sessions
        </h3>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Category & Role</th>
              <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest hidden sm:table-cell">Date</th>
              <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">AI Score</th>
              <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {history.map((session, idx) => {
              const score = session.finalReport?.overallScore || 0;
              const scoreStyle = getScoreStyle(score);
              const dotColor = CATEGORY_DOT[session.mode === 'technical' ? 'Technical' : 'HR'] || CATEGORY_DOT.Technical;

              return (
                <motion.tr 
                  key={session._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (idx * 0.05) }}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => navigate(`/interview/results/${session._id}`)}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${dotColor} shadow-sm shrink-0`} />
                      <div className="flex flex-col">
                        <span className="text-sm font-extrabold text-slate-900 leading-none mb-1.5">{session.role}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{session.mode} Round</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 hidden sm:table-cell">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                      <Calendar size={13} className="text-slate-300" />
                      {new Date(session.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-2">
                       <span className={`w-fit px-2.5 py-1 rounded-full text-[10px] font-black border ${scoreStyle.pill}`}>
                         {score}%
                       </span>
                       <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${score}%` }}
                           transition={{ duration: 1, delay: 0.5 }}
                           className={`h-full ${scoreStyle.bar}`} 
                         />
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={session.status} />
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 rounded-xl bg-slate-100 text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default HistoryTable;
