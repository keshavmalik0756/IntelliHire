/**
 * IntelliHire - AI Based Interview Assistance System Landing Page
 * 
 * This file contains the main landing page component with various sections:
 * 1. Hero Section
 * 2. Key Features
 * 3. Study Tools
 * 4. Gamification
 * 5. Platform Overview
 * 6. Newsletter
 * 7. Footer
 */

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Navbar from './LandingPage/Navbar';
import HeroSection from './LandingPage/HeroSection';
import FeaturesSection from './LandingPage/FeaturesSection';
import ToolsSection from './LandingPage/ToolsSection';
import GamificationSection from './LandingPage/GamificationSection';
import PlatformOverviewSection from './LandingPage/PlatformOverviewSection';
import Footer from './LandingPage/Footer';
import LoadingScreen from './LoadingScreen';

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Initializing IntelliHire..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-white overflow-x-hidden selection:bg-emerald-500/30" role="main">
      {/* Premium Scroll Progress Bar - Emerald/Teal/Slate */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-slate-800 origin-left z-50"
        style={{ scaleX }}
      />
      
      <Navbar />
      <HeroSection />
      <PlatformOverviewSection />
      <FeaturesSection />
      <ToolsSection />
      <GamificationSection />
      <Footer />
    </div>
  );
};

export default LandingPage;