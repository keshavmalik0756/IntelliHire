import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import { RiCopperCoinLine, RiArrowDropDownLine } from 'react-icons/ri'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { useSelector, useDispatch } from 'react-redux'
import { updateCredits } from '../store/slices/authSlice'
import api from '../utils/api'
import CreditModal from './popups/CreditModal'
import ProfileMenu from './popups/ProfileMenu'
import Logo from './Logo'

const Navbar = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const location = useLocation()
  const activePath = location.pathname

  const displayCredits = user?.credits ?? 0
  const firstLetter    = user?.name?.[0]?.toUpperCase() || '?'

  // Fetch live credits from backend on mount and whenever user changes
  useEffect(() => {
    if (!user) return;
    api.get('/users/credits')
      .then(res => {
        if (res.data?.success && typeof res.data.credits === 'number') {
          dispatch(updateCredits(res.data.credits));
        }
      })
      .catch(() => {}); // fail silently, will show cached value
  }, [user?._id]);

  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)

  /* ── Scroll-aware state ── */
  const [isScrolled, setIsScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20)
      if (window.scrollY > 20 && isMobileMenuOpen) setIsMobileMenuOpen(false)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [isMobileMenuOpen])

  /* ── Scroll progress bar ── */
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  const mainLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Interview', path: '/interview' },
    { label: 'History', path: '/history' },
    { label: 'Analytics', path: '/analytics' },
  ]

  const moreLinks = [
    { label: 'Tips', path: '/tips' },
    { label: 'Achievements', path: '/achievements' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .nih-nav * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
        .nih-credits-btn { transition: transform .18s, box-shadow .18s; cursor: default; }
        .nih-credits-btn:hover { transform: translateY(-1px); box-shadow: 0 5px 16px rgba(16,185,129,.15); }
        .nih-avatar-wrap { transition: transform .2s; cursor: default; }
        .nih-avatar-wrap:hover { transform: scale(1.1); }
        .nih-mobile-link { position: relative; }
        .nih-mobile-link.active::after {
          content: ''; position: absolute; left: -12px; top: 50%; transform: translateY(-50%);
          width: 4px; height: 4px; border-radius: 50%; background: #059669;
        }
      `}</style>

      {/* ── Ultra-thin scroll progress bar (fixed, sits above navbar) ── */}
      <motion.div
        style={{
          scaleX,
          position: 'fixed',
          top: 0, left: 0, right: 0,
          height: 2,
          background: 'linear-gradient(90deg, #10b981, #14b8a6, #0f766e)',
          transformOrigin: '0%',
          zIndex: 110,
        }}
      />

      {/* ── Navbar shell (fixed) ── */}
      <motion.nav
        className={`nih-nav fixed top-0 left-0 right-0 z-[100] transition-all duration-400 ease-in-out ${
          isScrolled ? 'py-0 px-0' : 'py-3 px-3 sm:py-4 sm:px-6'
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        {/* Inner pill — transparent when at top, glass when scrolled */}
        <div
          className={`mx-auto flex items-center justify-between transition-all duration-400 ease-in-out ${
            isScrolled
              ? 'max-w-full rounded-b-3xl py-3 px-4 sm:px-8 bg-white/85 backdrop-blur-xl border-b border-emerald-500/10 shadow-[0_4px_28px_rgba(16,185,129,0.08)]'
              : 'max-w-[750px] w-full rounded-full py-2 px-3 sm:px-5 bg-white/80 backdrop-blur-xl border-[1.5px] border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)]'
          }`}
        >

          {/* ── LEFT: Logo + Brand ── */}
          <Link to="/home" onClick={() => setIsMobileMenuOpen(false)}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer"
            >
              <Logo size={isScrolled ? "sm" : "md"} />
              <div>
                {!isScrolled && (
                  <p className="hidden xs:block text-[9.5px] lg:text-[10px] text-slate-400 font-medium tracking-[0.2px] mt-[1px]">
                    AI Interview Platform
                  </p>
                )}
              </div>
            </motion.div>
          </Link>

          {/* ── CENTER: Navigation Links (Desktop) ── */}
          <div className="hidden md:flex items-center gap-7">
            {mainLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                className={`text-[13px] font-semibold transition-all duration-300 ${
                  activePath === link.path 
                    ? 'text-emerald-600 scale-105' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* More Dropdown */}
            <div className="relative" onMouseEnter={() => setIsMoreOpen(true)} onMouseLeave={() => setIsMoreOpen(false)}>
              <button 
                className={`flex items-center gap-1 text-[13px] font-semibold transition-all duration-300 ${
                  moreLinks.some(l => l.path === activePath) ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                More
                <RiArrowDropDownLine className={`w-5 h-5 transition-transform duration-300 ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isMoreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-48 py-2 bg-white/95 backdrop-blur-xl border border-emerald-500/10 rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.12)] z-[110]"
                  >
                    {moreLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`block px-4 py-2.5 text-[13px] font-semibold transition-all ${
                          activePath === link.path
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-600'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── RIGHT: Credits + Avatar + Mobile Toggle ── */}
          <div className="flex items-center gap-1.5 sm:gap-3">

            {/* Credits pill */}
            <div className="relative">
              <motion.button
                onClick={() => setIsCreditModalOpen(prev => !prev)}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className={`nih-credits-btn flex items-center gap-1 sm:gap-1.5 py-1.5 px-2 sm:px-3.5 rounded-full border-[1.5px] border-emerald-400/20 transition-colors duration-400 cursor-pointer shadow-none ${
                   isScrolled
                    ? 'bg-gradient-to-br from-emerald-50 to-teal-50'
                    : 'bg-white/65 backdrop-blur-md'
                }`}
              >
                <RiCopperCoinLine className="w-3.5 h-3.5 sm:w-[13px] sm:h-[13px] text-emerald-500" />
                <span className="text-[11px] sm:text-[12px] font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-transparent bg-clip-text whitespace-nowrap">
                  {displayCredits} <span className="hidden xs:inline ml-0.5">Credits</span>
                </span>
              </motion.button>
              <CreditModal isOpen={isCreditModalOpen} onClose={() => setIsCreditModalOpen(false)} />
            </div>

            {/* Avatar Dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setIsProfileMenuOpen(prev => !prev)}
                className="nih-avatar-wrap"
                style={{
                  position: 'relative', width: 32, height: 32, flexShrink: 0,
                  border: 'none', background: 'transparent', padding: 0,
                  cursor: 'pointer', display: 'block',
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute', inset: -2, borderRadius: '50%',
                    background: 'conic-gradient(from 0deg, #10b981, #14b8a6, #059669, #10b981)',
                  }}
                />
                <div style={{
                  position: 'absolute', inset: 1.5, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f0fdf4, #f0f9ff)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 800, color: '#059669', userSelect: 'none',
                }}>
                  {firstLetter}
                </div>
              </motion.button>
              <ProfileMenu isOpen={isProfileMenuOpen} onClose={() => setIsProfileMenuOpen(false)} userName={user?.name} />
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
            >
              {isMobileMenuOpen ? <HiX size={20} /> : <HiMenuAlt3 size={20} />}
            </motion.button>

          </div>
        </div>

        {/* ── MOBILE MENU OVERLAY ── */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-full left-0 right-0 mt-2 mx-3 sm:mx-6 p-4 rounded-3xl bg-white/95 backdrop-blur-2xl border border-emerald-500/10 shadow-[0_20px_40px_rgba(16,185,129,0.12)] flex flex-col gap-2 overflow-hidden"
            >
              {mainLinks.map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`nih-mobile-link flex items-center py-3 px-4 rounded-2xl text-[14px] font-semibold transition-all ${
                      activePath === link.path
                        ? 'bg-emerald-50 text-emerald-600 active'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <div className="px-4 py-2 mt-2">
                 <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">More</p>
                 <div className="grid grid-cols-2 gap-2">
                    {moreLinks.map((link, idx) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-center py-3 rounded-2xl text-[13px] font-semibold transition-all border ${
                          activePath === link.path
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                            : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-emerald-50 hover:border-emerald-100 hover:text-emerald-600'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                 </div>
              </div>
              
              <div className="h-[1px] bg-slate-100 my-1 mx-4" />
              
              <div className="px-4 py-2">
                 <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2">Account</p>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                          {firstLetter}
                       </div>
                       <div>
                          <p className="text-[13px] font-bold text-slate-800 leading-none">{user?.name || 'User'}</p>
                          <p className="text-[11px] text-slate-500 mt-1">{user?.email || 'Student'}</p>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}

export default Navbar