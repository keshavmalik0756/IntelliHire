import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Loader, Calendar, Filter, BarChart3, Target, Zap, Trophy, ShieldCheck, Activity } from 'lucide-react';

/* ─── Shared Glassmorphism Style ─── */
const glassStyle = {
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1.5px solid rgba(0, 0, 0, 0.05)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)',
};

// Loading Skeleton
export const AnalyticsLoadingSkeleton = () => (
  <div className="min-h-screen bg-[#f3f3f3] pb-20 relative overflow-hidden">
    {/* Ambient Blobs */}
    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-[120px] pointer-events-none" />
    <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-[100px] pointer-events-none" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10 relative z-10">
      <div className="flex justify-between items-center mb-12">
        <div className="space-y-3">
          <div className="h-10 w-64 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="h-4 w-96 bg-slate-100 rounded-xl animate-pulse" />
        </div>
        <div className="flex gap-3">
          <div className="h-12 w-32 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="h-12 w-32 bg-slate-200 rounded-2xl animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-44 bg-white rounded-[2.5rem] border border-slate-200/60 animate-pulse shadow-sm" />
        ))}
      </div>

      <div className="h-[500px] bg-white rounded-[2.5rem] border border-slate-200/60 animate-pulse shadow-sm" />
    </div>
  </div>
);

// Advanced Filters
export const AdvancedFilters = ({
  dateRange, setDateRange, selectedCategory, setSelectedCategory,
  chartType, setChartType, selectedMetric, setSelectedMetric
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-2 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg shadow-slate-200/40"
    >
      <div className="relative group">
        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors w-3.5 h-3.5 pointer-events-none" />
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200/60 text-[13px] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
        >
          <option value="all">Timeframe: All Time</option>
          <option value="month">Timeframe: Last Month</option>
          <option value="week">Timeframe: Last Week</option>
        </select>
      </div>

      <div className="relative group">
        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors w-3.5 h-3.5 pointer-events-none" />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200/60 text-[13px] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
        >
          <option value="all">Category: All</option>
          <option value="technical">Category: Technical</option>
          <option value="hr">Category: HR</option>
        </select>
      </div>

      <div className="relative group">
        <BarChart3 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors w-3.5 h-3.5 pointer-events-none" />
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200/60 text-[13px] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
        >
          <option value="trend">View Mode: Trend</option>
          <option value="area">View Mode: Heatmap</option>
          <option value="comparison">View Mode: Comparison</option>
        </select>
      </div>

      <div className="relative group">
        <Activity className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors w-3.5 h-3.5 pointer-events-none" />
        <select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200/60 text-[13px] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
        >
          <option value="all">Metric: Comprehensive</option>
          <option value="score">Metric: AI Score</option>
          <option value="confidence">Metric: Confidence</option>
          <option value="skills">Metric: Skill Mapping</option>
        </select>
      </div>
    </motion.div>
  );
};

// Animated KPI Cards
export const AnimatedKPICards = ({ data }) => {
  const kpis = [
    { label: 'Total Sessions', value: data.summaryStats.totalSessions, delta: data.summaryStats.sessionsDelta, icon: <BarChart3 className="w-6 h-6" />, color: '#10b981', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Average Score', value: `${data.summaryStats.averageScore}%`, delta: data.summaryStats.scoreDelta, icon: <Target className="w-6 h-6" />, color: '#6366f1', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    { label: 'Improvement Rate', value: `+${data.summaryStats.improvementRate}%`, delta: data.summaryStats.improvementDelta, icon: <TrendingUp className="w-6 h-6" />, color: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Best Score', value: `${data.summaryStats.bestScore}%`, delta: data.summaryStats.bestScoreDelta, icon: <Trophy className="w-6 h-6" />, color: '#eab308', bg: 'bg-yellow-50', border: 'border-yellow-100' },
    { label: 'Consistency', value: `${data.summaryStats.consistency}%`, delta: data.summaryStats.consistencyDelta, icon: <Zap className="w-6 h-6" />, color: '#06b6d4', bg: 'bg-cyan-50', border: 'border-cyan-100' },
    { label: 'Completion Rate', value: `${data.summaryStats.completionRate}%`, delta: data.summaryStats.completionDelta, icon: <ShieldCheck className="w-6 h-6" />, color: '#22c55e', bg: 'bg-green-50', border: 'border-green-100' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {kpis.map((kpi, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + idx * 0.05 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          style={glassStyle}
          className="relative overflow-hidden rounded-3xl p-6 group cursor-default"
        >
          {/* Decorative Background Blob */}
          <div className={`absolute -right-6 -bottom-6 w-28 h-28 rounded-full ${kpi.bg} opacity-50 blur-2xl group-hover:scale-150 transition-transform duration-700`} />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className={`w-12 h-12 rounded-xl ${kpi.bg} ${kpi.border} border flex items-center justify-center text-slate-900 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                <div style={{ color: kpi.color }}>{kpi.icon}</div>
              </div>
              
              {kpi.delta !== undefined && (
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black tracking-tight ${kpi.delta >= 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                  {kpi.delta >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {Math.abs(kpi.delta)}%
                </div>
              )}
            </div>

            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
            <div className="flex items-baseline gap-2">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-3xl font-black text-slate-900 tracking-tighter"
              >
                {kpi.value}
              </motion.span>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Global</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// AI Insights Panel
export const AIInsightsPanel = ({ data }) => {
  const insights = data.aiInsights || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
      style={glassStyle}
      className="rounded-3xl p-8 relative overflow-hidden"
    >
      {/* Sparkle Decorations */}
      <Sparkles className="absolute top-6 right-6 text-amber-500/10 pointer-events-none" size={100} />

      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="w-14 h-14 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shadow-inner rotate-3">
          <Sparkles size={28} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI Insights <span className="text-amber-500">Center</span></h3>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Personalized Growth Recommendations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
        {insights.map((insight, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + idx * 0.1 }}
            whileHover={{ scale: 1.01 }}
            className={`p-5 rounded-[1.5rem] border transition-all ${
              insight.type === 'success'
                ? 'bg-emerald-50/50 border-emerald-100 hover:border-emerald-300'
                : insight.type === 'warning'
                ? 'bg-amber-50/50 border-amber-100 hover:border-amber-300'
                : 'bg-blue-50/50 border-blue-100 hover:border-blue-300'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                insight.type === 'success' ? 'bg-white text-emerald-500' :
                insight.type === 'warning' ? 'bg-white text-amber-500' :
                'bg-white text-blue-500'
              }`}>
                {insight.type === 'success' && <CheckCircle size={20} />}
                {insight.type === 'warning' && <AlertCircle size={20} />}
                {insight.type === 'info' && <Loader size={20} className="animate-spin-slow" />}
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-base tracking-tight mb-1">{insight.title}</p>
                <p className="text-[13px] font-medium text-slate-600 leading-relaxed">{insight.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Comparison Analysis Panel
export const ComparisonAnalysisPanel = ({ data, comparisonPeriod, setComparisonPeriod }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      style={glassStyle}
      className="rounded-3xl p-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Period <span className="text-emerald-500">Comparison</span></h3>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">Growth Tracking Engine</p>
        </div>
        <div className="relative">
          <select
            value={comparisonPeriod}
            onChange={(e) => setComparisonPeriod(e.target.value)}
            className="pl-4 pr-10 py-2.5 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-[13px] font-extrabold outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-sm appearance-none cursor-pointer"
          >
            <option value="previous">Bench: Previous Period</option>
            <option value="lastMonth">Bench: Last Month</option>
            <option value="lastQuarter">Bench: Last Quarter</option>
          </select>
          <TrendingUp className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.comparisonMetrics?.map((metric, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 + idx * 0.05 }}
            className="p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200/60 relative group"
          >
            <div className="flex justify-between items-start mb-5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.name}</p>
              <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${metric.change >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {metric.change >= 0 ? '+' : ''}{metric.change}%
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-black text-slate-900 tracking-tighter">{metric.current}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active</p>
                </div>
                <div className="w-8 h-[2px] bg-slate-100" />
                <div className="text-right">
                  <p className="text-lg font-black text-slate-400 tracking-tighter">{metric.previous}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Base</p>
                </div>
              </div>

              {/* Progress Visualizer */}
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (metric.current / (metric.previous || 1)) * 100)}%` }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className={`h-full rounded-full ${metric.change >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Detailed Metrics Table
export const DetailedMetricsTable = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65 }}
      style={glassStyle}
      className="rounded-3xl p-8 overflow-hidden"
    >
      <div className="flex items-center gap-3.5 mb-8">
        <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xl shadow-slate-900/10">
          <Activity size={22} />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Performance <span className="text-blue-500">Breakdown</span></h3>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Core Diagnostic Matrix</p>
        </div>
      </div>

      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-sm border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="px-5 py-3 text-left font-black text-slate-400 uppercase tracking-widest text-[9px]">Metric Interface</th>
              <th className="px-5 py-3 text-left font-black text-slate-400 uppercase tracking-widest text-[9px]">Current Read</th>
              <th className="px-5 py-3 text-left font-black text-slate-400 uppercase tracking-widest text-[9px]">Optimization Target</th>
              <th className="px-5 py-3 text-left font-black text-slate-400 uppercase tracking-widest text-[9px]">Registry Status</th>
              <th className="px-5 py-3 text-right font-black text-slate-400 uppercase tracking-widest text-[9px]">Vector Trend</th>
            </tr>
          </thead>
          <tbody>
            {data.detailedMetrics?.map((metric, idx) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + idx * 0.05 }}
                className="group cursor-default"
              >
                <td className="px-5 py-4 font-black text-slate-900 bg-slate-50/50 rounded-l-2xl border-y border-l border-slate-100 group-hover:bg-slate-50 transition-colors">
                  {metric.name}
                </td>
                <td className="px-5 py-4 font-bold text-slate-700 bg-slate-50/50 border-y border-slate-100 group-hover:bg-slate-50 transition-colors text-[13px]">
                  {metric.current}
                </td>
                <td className="px-5 py-4 font-bold text-slate-500 bg-slate-50/50 border-y border-slate-100 group-hover:bg-slate-50 transition-colors text-[13px]">
                  {metric.target}
                </td>
                <td className="px-5 py-4 bg-slate-50/50 border-y border-slate-100 group-hover:bg-slate-50 transition-colors">
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
                    metric.status === 'on-track' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : metric.status === 'warning' 
                      ? 'bg-amber-50 text-amber-700 border-amber-100' 
                      : 'bg-rose-50 text-rose-700 border-rose-100'
                  }`}>
                    {metric.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right bg-slate-50/50 rounded-r-2xl border-y border-r border-slate-100 group-hover:bg-slate-50 transition-colors">
                  <div className="flex justify-end">
                    {metric.trend === 'up' ? (
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-inner">
                        <TrendingUp size={16} />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shadow-inner">
                        <TrendingDown size={16} />
                      </div>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
