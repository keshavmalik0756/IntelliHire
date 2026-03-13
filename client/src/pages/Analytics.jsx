import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { RefreshCw, Download, BarChart3, Target } from 'lucide-react';
import api from '../utils/api';
import {
  AdvancedPerformanceTrendChart,
  PerformanceDistributionChart,
  SkillMatrixChart,
  ConfidenceRadarChart,
  WeeklyStatsChart,
  CategoryBreakdownChart,
  GoalProgressChart,
} from '../components/analytics/AdvancedCharts';
import {
  AnalyticsLoadingSkeleton,
  AdvancedFilters,
  AnimatedKPICards,
  AIInsightsPanel,
  ComparisonAnalysisPanel,
  DetailedMetricsTable
} from '../components/analytics/AdvancedUI';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [chartType, setChartType] = useState('trend');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [comparisonPeriod, setComparisonPeriod] = useState('previous');

  // Fetch analytics data
  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange, selectedCategory]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const params = {
        dateRange,
        category: selectedCategory
      };

      const res = await api.get('/interview/analytics', { params });
      if (res.data.success) {
        setAnalyticsData(res.data.data);
      }
    } catch (error) {
      console.error('Analytics fetch error:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAnalyticsData();
    setRefreshing(false);
    toast.success('Analytics updated');
  }, []);

  if (loading && !analyticsData) {
    return <AnalyticsLoadingSkeleton />;
  }

  const data = analyticsData;

  return (
    <div className="min-h-screen bg-[#f3f3f3] pb-20 relative overflow-hidden font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *{font-family:'Inter',sans-serif;}
        .grad-text{
          background:linear-gradient(120deg,#f59e0b,#10b981,#3b82f6);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
      `}</style>

      {/* Ambient Blobs */}
      {[
        { w: 600, h: 600, t: '-10%', l: '-10%', bg: 'rgba(16,185,129,.08)' },
        { w: 500, h: 500, b: '-10%', r: '-5%', bg: 'rgba(59,130,246,.06)' },
        { w: 400, h: 400, t: '30%', r: '10%', bg: 'rgba(245,158,11,.05)' },
      ].map(({ w, h, t, l, b, r, bg }, i) => (
        <motion.div key={i}
          style={{
            position: 'absolute', width: w, height: h, top: t, left: l, bottom: b, right: r,
            borderRadius: '60% 40% 70% 30%/50% 60% 40% 50%', background: bg, filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0
          }}
          animate={{ borderRadius: ['60% 40% 70% 30%/50% 60% 40% 50%', '40% 60% 30% 70%/60% 40% 60% 40%', '60% 40% 70% 30%/50% 60% 40% 50%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Dot Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(0,0,0,.04) 1px,transparent 1px)',
        backgroundSize: '32px 32px', pointerEvents: 'none', zIndex: 0
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8 relative z-10">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-sm">
                <BarChart3 className="text-emerald-500 w-5 h-5" />
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Analytics <span className="grad-text">Hub</span></h1>
            </div>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest ml-1">Advanced performance diagnostics & AI recommendations</p>
          </div>
          
          <div className="flex items-center gap-2.5">
            <motion.button
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs border border-slate-200 shadow-sm transition-all disabled:opacity-50"
            >
              <RefreshCw size={16} className={`${refreshing ? 'animate-spin' : ''} text-emerald-500`} />
              Sync Data
            </motion.button>
            <motion.button
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-xl shadow-slate-900/10 transition-all"
            >
              <Download size={16} className="text-emerald-400" /> 
              Export Report
            </motion.button>
          </div>
        </motion.div>

        {/* Filters Group */}
        <AdvancedFilters
          dateRange={dateRange}
          setDateRange={setDateRange}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          chartType={chartType}
          setChartType={setChartType}
          selectedMetric={selectedMetric}
          setSelectedMetric={setSelectedMetric}
        />

        {/* Dashboard Content */}
        {data ? (
          <div className="space-y-10">
            {/* KPI Overview */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 ml-1">
                <Target className="text-indigo-500 w-3.5 h-3.5" />
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Efficiency Overview</h2>
              </div>
              <AnimatedKPICards data={data} comparisonPeriod={comparisonPeriod} />
            </div>

            {/* Visual Analytics */}
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AdvancedPerformanceTrendChart data={data.performanceTrend} chartType={chartType} />
                <PerformanceDistributionChart data={data.performanceDistribution} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SkillMatrixChart data={data.skillAnalysis} />
                <ConfidenceRadarChart data={data.confidenceMetrics} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <WeeklyStatsChart data={data.weeklyStats} />
                <CategoryBreakdownChart data={data.categoryBreakdown} />
                <GoalProgressChart data={data.goalProgress} />
              </div>
            </div>

            {/* Intelligent Layer */}
            <div className="space-y-8">
              <AIInsightsPanel data={data} />
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                <ComparisonAnalysisPanel data={data} comparisonPeriod={comparisonPeriod} setComparisonPeriod={setComparisonPeriod} />
                <DetailedMetricsTable data={data} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-dashed border-slate-300">
             <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 mb-4 animate-pulse">
                <BarChart3 size={32} />
             </div>
             <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Waiting for data stream...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
