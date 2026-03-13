import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ComposedChart, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine
} from 'recharts';
import { TrendingUp, Brain, Eye, Activity, Target, Award, Zap } from 'lucide-react';

// Advanced Performance Trend Chart
export const AdvancedPerformanceTrendChart = ({ data, chartType }) => {
  const memoizedData = useMemo(() => data, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm hover:shadow-lg transition-all"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-widest">Performance Trajectory</h3>
          <p className="text-sm text-slate-500 mt-1">AI Score & Confidence Evolution</p>
        </div>
        <TrendingUp className="text-emerald-600" size={28} />
      </div>

      <ResponsiveContainer width="100%" height={350}>
        {chartType === 'area' ? (
          <AreaChart data={memoizedData}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              labelStyle={{ color: '#1e293b' }}
            />
            <Legend />
            <Area type="monotone" dataKey="score" stroke="#10b981" fill="url(#colorScore)" name="AI Score" strokeWidth={2} />
            <Area type="monotone" dataKey="confidence" stroke="#6366f1" fill="url(#colorConfidence)" name="Confidence" strokeWidth={2} />
          </AreaChart>
        ) : (
          <LineChart data={memoizedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
              }}
            />
            <Legend />
            <ReferenceLine y={75} stroke="#f59e0b" strokeDasharray="5 5" label="Target" />
            <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} />
            <Line type="monotone" dataKey="confidence" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 5 }} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </motion.div>
  );
};

// Performance Distribution Chart
export const PerformanceDistributionChart = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm hover:shadow-lg transition-all"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-widest">Score Distribution</h3>
          <p className="text-sm text-slate-500 mt-1">Performance across all sessions</p>
        </div>
        <Award className="text-amber-600" size={28} />
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="sessionNumber" stroke="#94a3b8" />
          <YAxis dataKey="score" stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
            }}
          />
          <Scatter name="Scores" data={data} fill="#10b981" />
          <ReferenceLine y={75} stroke="#f59e0b" strokeDasharray="5 5" />
        </ScatterChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// Skill Matrix Chart
export const SkillMatrixChart = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm hover:shadow-lg transition-all"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-widest">Skill Matrix</h3>
          <p className="text-sm text-slate-500 mt-1">Competency profiling</p>
        </div>
        <Brain className="text-amber-600" size={28} />
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis type="number" stroke="#94a3b8" />
          <YAxis dataKey="skill" type="category" stroke="#94a3b8" width={120} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
            }}
          />
          <Bar dataKey="score" fill="#f59e0b" radius={[0, 12, 12, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// Confidence Radar Chart
export const ConfidenceRadarChart = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm hover:shadow-lg transition-all"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-widest">Confidence Profile</h3>
          <p className="text-sm text-slate-500 mt-1">Behavioral metrics</p>
        </div>
        <Eye className="text-teal-600" size={28} />
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="metric" stroke="#94a3b8" />
          <PolarRadiusAxis stroke="#94a3b8" />
          <Radar name="Score" dataKey="value" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.6} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// Weekly Stats Chart
export const WeeklyStatsChart = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm hover:shadow-lg transition-all"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-widest">Weekly Activity</h3>
          <p className="text-sm text-slate-500 mt-1">Sessions & performance</p>
        </div>
        <Activity className="text-violet-600" size={28} />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="week" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
            }}
          />
          <Legend />
          <Bar dataKey="sessions" fill="#8b5cf6" radius={[12, 12, 0, 0]} />
          <Line type="monotone" dataKey="avgScore" stroke="#06b6d4" strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// Category Breakdown Chart
export const CategoryBreakdownChart = ({ data }) => {
  const COLORS = ['#10b981', '#64748b'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm hover:shadow-lg transition-all"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-widest">Interview Mix</h3>
          <p className="text-sm text-slate-500 mt-1">Technical vs HR</p>
        </div>
        <Target className="text-indigo-600" size={28} />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// Goal Progress Chart
export const GoalProgressChart = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm hover:shadow-lg transition-all"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-widest">Goal Progress</h3>
          <p className="text-sm text-slate-500 mt-1">Target achievement</p>
        </div>
        <Zap className="text-yellow-600" size={28} />
      </div>

      <div className="space-y-6">
        {data?.map((goal, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + idx * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700">{goal.name}</span>
              <span className="text-sm font-bold text-emerald-600">{goal.progress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${goal.progress}%` }}
                transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
