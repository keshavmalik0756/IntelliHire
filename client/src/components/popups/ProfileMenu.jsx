import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiUser, FiLogOut, FiSettings, FiX } from 'react-icons/fi'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../../store/slices/authSlice'

const ProfileMenu = ({ isOpen, onClose, userName }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    const timer = setTimeout(() => document.addEventListener('mousedown', handleClick), 0)
    return () => { clearTimeout(timer); document.removeEventListener('mousedown', handleClick) }
  }, [isOpen, onClose])

  const handleProfile = () => {
    onClose()
    navigate('/profile')
  }

  const handleLogout = async () => {
    onClose()
    await dispatch(logoutUser())
    navigate('/')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          key="profile-popover"
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0,  scale: 1     }}
          exit={{   opacity: 0, y: -8, scale: 0.95   }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="absolute top-[calc(100%+8px)] -right-2 sm:-right-1 md:right-0 z-[300] w-[calc(100vw-32px)] max-w-[220px] sm:max-w-[260px]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {/* Arrow */}
          <div className="absolute top-[-6px] right-[22px] sm:right-[18px] md:right-[16px] w-3 h-3 bg-white border-[1.5px] border-emerald-500/15 border-b-0 border-r-0 rotate-45 rounded-tl-[2px] z-10" />

          {/* Card Wrapper */}
          <div style={{
            background: 'rgba(255,255,255,0.98)',
            borderRadius: 16,
            border: '1.5px solid rgba(16,185,129,.15)',
            boxShadow: '0 16px 48px rgba(16,185,129,.12), 0 4px 12px rgba(0,0,0,.08)',
            overflow: 'hidden',
          }}>
            {/* Gradient top strip */}
            <div style={{
              height: 3,
              background: 'linear-gradient(90deg, #10b981, #14b8a6, #059669)',
            }} />

            <div className="p-3 sm:p-4 pb-2 sm:pb-2.5">
              
              {/* Header: User Badge + Close Button */}
              <div className="flex items-start justify-between mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-emerald-500/10">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Floating Avatar Icon inside the menu */}
                  <motion.div
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      width: 42, height: 42,
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, #f0fdf4, #f0f9ff)',
                      border: '1.5px solid rgba(16,185,129,.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <FiUser size={20} color="#059669" />
                  </motion.div>

                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-[9.5px] sm:text-[11px] text-emerald-500 font-bold uppercase tracking-wider mb-0.5">
                      Signed in as
                    </p>
                    <p className="text-[13.5px] sm:text-[15px] text-slate-900 font-extrabold whitespace-nowrap overflow-hidden text-ellipsis leading-tight">
                      {userName || 'User'}
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  style={{
                    width: 24, height: 24, borderRadius: '50%', border: 'none',
                    background: '#f1f5f9', cursor: 'pointer', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#64748b', transition: 'background .15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                  onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                >
                  <FiX size={12} />
                </button>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                
                {/* Profile Button */}
                <motion.button
                  onClick={handleProfile}
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2 sm:py-2.5 px-3 sm:px-3.5 rounded-[10px] border-none bg-transparent text-slate-600 text-[12px] sm:text-[13.5px] font-semibold cursor-pointer flex items-center gap-2.5 sm:gap-3 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: '#e2e8f0', color: '#64748b',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <FiSettings size={14} />
                  </div>
                  Account Settings
                </motion.button>

                {/* Logout Button */}
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2 sm:py-2.5 px-3 sm:px-3.5 rounded-[10px] border-none bg-transparent text-red-500 text-[12px] sm:text-[13.5px] font-semibold cursor-pointer flex items-center gap-2.5 sm:gap-3 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: '#fee2e2', color: '#ef4444',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <FiLogOut size={14} />
                  </div>
                  Log Out
                </motion.button>

              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ProfileMenu
