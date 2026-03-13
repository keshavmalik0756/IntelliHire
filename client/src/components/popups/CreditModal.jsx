import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { RiCopperCoinLine } from 'react-icons/ri'
import { FiZap, FiX } from 'react-icons/fi'

/**
 * CreditModal — dropdown popover that appears directly below its trigger.
 * Render this inside a `position: relative` wrapper for correct anchoring.
 */
const CreditModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const ref       = useRef(null)

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    // Slight delay so the opening click itself doesn't immediately close
    const timer = setTimeout(() => document.addEventListener('mousedown', handleClick), 0)
    return () => { clearTimeout(timer); document.removeEventListener('mousedown', handleClick) }
  }, [isOpen, onClose])

  const handleBuy = () => {
    onClose()
    navigate('/pricing')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          key="credit-popover"
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0,  scale: 1     }}
          exit={{   opacity: 0, y: -8, scale: 0.95   }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="absolute top-[calc(100%+8px)] -right-3 sm:-right-1 md:right-0 z-[300] w-[calc(100vw-32px)] max-w-[260px] sm:max-w-[320px]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {/* Arrow */}
          <div className="absolute top-[-6px] right-[24px] sm:right-[18px] md:right-[16px] w-3 h-3 bg-white border-[1.5px] border-emerald-500/15 border-b-0 border-r-0 rotate-45 rounded-tl-[2px] z-10" />

          {/* Card */}
          <div style={{
            background: 'rgba(255,255,255,0.98)',
            borderRadius: 16,
            border: '1.5px solid rgba(16,185,129,.15)',
            boxShadow: '0 16px 48px rgba(16,185,129,.12), 0 4px 12px rgba(0,0,0,.07)',
            overflow: 'hidden',
          }}>
            {/* Gradient top strip */}
            <div style={{
              height: 3,
              background: 'linear-gradient(90deg, #10b981, #14b8a6, #059669)',
            }} />

            <div className="p-3 sm:p-4 sm:px-4.5 pb-2.5 sm:pb-3.5">
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>

                {/* Icon + title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: 'linear-gradient(135deg, #f0fdf4, #f0f9ff)',
                      border: '1.5px solid rgba(16,185,129,.18)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <RiCopperCoinLine size={18} color="#059669" />
                  </motion.div>

                  <p className="text-[12px] sm:text-[13.5px] font-extrabold text-slate-900 leading-[1.2]">
                    Need more credits<br/>to continue?
                  </p>
                </div>

                {/* Close X */}
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

              {/* Body text */}
              <p className="text-[11px] sm:text-[12px] text-slate-500 leading-[1.5] mb-3 sm:mb-3.5">
                Your AI credits are running low. Top up now to keep practising with unlimited mock interview sessions.
              </p>

              {/* CTA */}
              <motion.button
                onClick={handleBuy}
                whileHover={{ scale: 1.02, boxShadow: '0 6px 20px rgba(16,185,129,.25)' }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-2.5 sm:py-3 px-4 rounded-[10px] border-none text-white text-[12px] sm:text-[13px] font-bold cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(16,185,129,.2)] transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                }}
              >
                <FiZap size={14} />
                Buy More Credits
              </motion.button>

              <button
                onClick={onClose}
                style={{
                  width: '100%', marginTop: 7, padding: '7px',
                  borderRadius: 8, border: 'none', background: 'transparent',
                  color: '#94a3b8', fontSize: 11.5, fontWeight: 500,
                  cursor: 'pointer', transition: 'color .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#475569'}
                onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
              >
                Maybe later
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CreditModal
