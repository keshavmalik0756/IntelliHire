import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../utils/api';

// Components
import DashboardHeader from '../components/dashboard/DashboardHeader';
import InterviewStats from '../components/dashboard/InterviewStats';
import HistoryTable from '../components/dashboard/HistoryTable';
import StartInterviewCard from '../components/dashboard/StartInterviewCard';

const INTERVIEW_CATEGORIES = [
  { id: 'Technical', title: 'Technical Round', description: 'Algorithms, Data Structures & Coding', icon: 'Code' },
  { id: 'HR', title: 'HR & Behavioral', description: 'Communication, Culture & Situational', icon: 'User' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, historyRes] = await Promise.all([
        api.get('/interview/stats'),
        api.get('/interview/history')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (historyRes.data.success) {
        // Show only latest 5 for dashboard
        setHistory(historyRes.data.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast.error('Failed to sync dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStartInterview = (categoryId) => {
    navigate('/interview', { state: { category: categoryId } });
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-10">
        
        {/* Header Section */}
        <DashboardHeader user={user} onRefresh={fetchDashboardData} />

        {/* Stats Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest pl-1 border-l-4 border-emerald-500">Performance Overview</h2>
            <button 
              onClick={() => navigate('/analytics')}
              className="text-emerald-600 text-xs font-bold hover:underline"
            >
              Detailed Analytics →
            </button>
          </div>
          <InterviewStats stats={stats} loading={loading} />
        </section>

        {/* Main Content: Launch Cards & History */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Recent History - Left Side (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
               <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest pl-1 border-l-4 border-emerald-500">Recent Activity</h2>
               <button 
                 onClick={() => navigate('/history')}
                 className="text-slate-500 text-xs font-bold hover:text-emerald-600 transition-colors"
               >
                 View Full History
               </button>
            </div>
            {loading ? (
               <div className="h-64 bg-white rounded-3xl animate-pulse border border-slate-200/60 shadow-sm" />
            ) : (
               <HistoryTable history={history} />
            )}
          </div>

          {/* Quick Launch - Right Side (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between">
               <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest pl-1 border-l-4 border-emerald-500">Quick Launch</h2>
            </div>
            <div className="grid grid-cols-1 gap-5">
              {INTERVIEW_CATEGORIES.map((category, idx) => (
                <StartInterviewCard 
                  key={category.id} 
                  category={category} 
                  onStart={handleStartInterview}
                  delay={0.1 + (idx * 0.1)}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
