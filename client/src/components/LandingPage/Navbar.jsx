import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Sparkles, Brain, BookOpen, BarChart as BarChartIcon, Mail, X, Menu } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../Logo';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '#hero', icon: <Sparkles size={16} /> },
    { label: 'Features', href: '#features', icon: <Brain size={16} /> },
    { label: 'Practice', href: '#tools', icon: <BookOpen size={16} /> },
    { label: 'Gamification', href: '#gamification', icon: <BarChartIcon size={16} /> },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false);
    }
  };

  const handleNavItemClick = (e, href) => {
    if (location.pathname === '/' && href.startsWith('#')) {
      scrollToSection(e, href);
    } else {
      if (href.startsWith('#')) {
        navigate(`/${href}`);
      } else {
        navigate(href);
      }
      setIsMobileMenuOpen(false);
    }
  };

  const menuVariants = {
    closed: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
    open: { opacity: 1, scale: 1, transition: { duration: 0.2 } }
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled ? 'py-4' : 'py-6'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`
          relative flex items-center justify-between rounded-full transition-all duration-500
          ${isScrolled 
            ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-emerald-100/50 border border-white/40 px-6 py-3 mx-auto max-w-5xl' 
            : 'bg-transparent px-0 py-0 max-w-full'}
        `}>
          
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={(e) => handleNavItemClick(e, '#hero')}>
            <Logo size="md" className={`transition-colors duration-300 ${isScrolled ? "text-slate-900" : "text-slate-800"}`} />
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
            <div className={`
              flex items-center gap-1 p-1 rounded-full transition-all duration-300
              ${isScrolled ? 'bg-slate-100/50' : 'bg-white/40 backdrop-blur-md border border-white/40 shadow-sm'}
            `}>
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  onClick={(e) => handleNavItemClick(e, item.href)}
                  className={`
                    relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2
                    hover:bg-white hover:text-emerald-600 hover:shadow-sm
                    ${isScrolled ? 'text-slate-600' : 'text-slate-700'}
                  `}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
             <button 
              onClick={() => navigate('/login')}
              className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-colors ${
                isScrolled ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-700 hover:bg-white/50'
              }`}
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 rounded-full bg-slate-100 text-slate-900 hover:bg-slate-200 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="absolute top-full left-0 right-0 mt-4 mx-4 p-4 rounded-3xl bg-white shadow-2xl shadow-emerald-100 ring-1 ring-slate-100 lg:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-2">
                {navItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    onClick={(e) => handleNavItemClick(e, item.href)}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors text-slate-600 font-medium"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      {item.icon}
                    </div>
                    {item.label}
                  </a>
                ))}
                <div className="h-px bg-slate-100 my-2" />
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => navigate('/login')} className="p-3 rounded-xl bg-slate-50 text-slate-700 font-semibold text-center hover:bg-slate-100">
                    Sign In
                  </button>
                  <button onClick={() => navigate('/signup')} className="p-3 rounded-xl bg-emerald-600 text-white font-semibold text-center hover:bg-emerald-700">
                    Sign Up
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

       {/* Scroll Progress - Ultra-thin and premium */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-600 via-teal-500 to-slate-800 origin-left z-[60]"
        style={{ scaleX }}
      />
    </motion.nav>
  );
};

export default Navbar;