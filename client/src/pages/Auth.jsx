import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase/firebaseConfig'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../store/slices/authSlice'
import { BsRobot } from 'react-icons/bs'
import { FcGoogle } from 'react-icons/fc'
import { IoSparkles } from 'react-icons/io5'
import { FiArrowRight, FiZap, FiTarget, FiBarChart2, FiCheckCircle } from 'react-icons/fi'

/* ─── Static data ───────────────────────────────────────────────── */
const FEATURES = [
  { icon: FiZap,       color:'#f59e0b', bg:'#fef3c7', label:'Adaptive AI Question Engine'   },
  { icon: FiTarget,    color:'#10b981', bg:'#d1fae5', label:'Real-Time Performance Coaching' },
  { icon: FiBarChart2, color:'#3b82f6', bg:'#dbeafe', label:'Deep Analytics & Insights'      },
]
const TESTIMONIALS = [
  { name:'Arjun M.',  role:'SDE @ Google',   avatar:'A', color:'#f59e0b', text:'"Landed my dream offer after just 2 weeks of practice!"'               },
  { name:'Priya S.',  role:'PM @ Microsoft', avatar:'P', color:'#10b981', text:'"The AI feedback was so precise, it felt like a real interviewer."'    },
  { name:'Rahul K.',  role:'ML @ Amazon',    avatar:'R', color:'#3b82f6', text:'"Best interview prep platform I\'ve used in my career."'               },
]
const STATS = [
  { val:'10K+', label:'Interviews', color:'#f59e0b' },
  { val:'85%',  label:'Offer Rate', color:'#10b981' },
  { val:'4.9★', label:'Rating',     color:'#3b82f6' },
]

/* ═══════════════════════════════════════════════════════════════════
   AUTH PAGE
═══════════════════════════════════════════════════════════════════ */
const Auth = () => {
  const dispatch                   = useDispatch()
  const navigate                   = useNavigate()
  const { user }                   = useSelector((state) => state.auth)
  const [hovered,    setHovered]    = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [done,       setDone]       = useState(false)
  const [activeTest, setActiveTest] = useState(0)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  // Auto-advance testimonials every 3 seconds
  useEffect(() => {
    const t = setInterval(() => setActiveTest(i => (i + 1) % TESTIMONIALS.length), 3000)
    return () => clearInterval(t)
  }, [])

  const [error,      setError]      = useState('')

  const handleGoogle = async () => {
    setLoading(true)
    setError('')
    try {
      // 1 - Google popup
      const result   = await signInWithPopup(auth, googleProvider)
      const idToken  = await result.user.getIdToken()

      // 2 - Exchange with our backend → get app JWT + user object
      const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const res = await fetch(`${API}/api/v1/auth/google`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ idToken }),
      })

      if (!res.ok) {
        const { message } = await res.json().catch(() => ({}))
        throw new Error(message || 'Server error. Please try again.')
      }

      const data = await res.json()

      // 3 - Persist token + user via Redux
      dispatch(login(data))

      setDone(true)

      // 4 - Redirect after celebration animation finishes
      setTimeout(() => {
        navigate('/home')
      }, 2800)

    } catch (err) {
      setError(err.message || 'Sign-in failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *{font-family:'Inter',sans-serif;box-sizing:border-box;margin:0;padding:0;}
        .grad-text{
          background:linear-gradient(120deg,#f59e0b,#10b981,#3b82f6);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        html,body,#root{height:100%;}
      `}</style>

      {/* ── Full-page wrapper ── */}
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden" style={{
        background:'linear-gradient(145deg,#fffbef 0%,#f0fdf4 50%,#eff6ff 100%)',
      }}>

        {/* Ambient blobs */}
        {[
          { w:520, h:520, t:'-12%', l:'-10%', bg:'rgba(251,191,36,.13)' },
          { w:420, h:420, b:'-10%', r:'-8%',  bg:'rgba(16,185,129,.10)' },
          { w:300, h:300, t:'35%',  r:'12%',   bg:'rgba(59,130,246,.08)' },
        ].map(({ w,h,t,l,b,r,bg }, i) => (
          <motion.div key={i}
            style={{ position:'absolute', width:w, height:h, top:t, left:l, bottom:b, right:r,
              borderRadius:'60% 40% 70% 30%/50% 60% 40% 50%', background:bg, filter:'blur(70px)', pointerEvents:'none' }}
            animate={{ borderRadius:['60% 40% 70% 30%/50% 60% 40% 50%','40% 60% 30% 70%/60% 40% 60% 40%','60% 40% 70% 30%/50% 60% 40% 50%'] }}
            transition={{ duration:13, repeat:Infinity, ease:'easeInOut' }}
          />
        ))}

        {/* Dot grid */}
        <div style={{ position:'absolute', inset:0,
          backgroundImage:'radial-gradient(rgba(0,0,0,.065) 1px,transparent 1px)',
          backgroundSize:'32px 32px', pointerEvents:'none' }}
        />

        {/* ══ UNIFIED CARD ══ */}
        <motion.div
          initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }} transition={{ duration:.65, ease:'easeOut' }}
          className="flex flex-col lg:flex-row w-full max-w-[1000px] min-h-[600px] lg:min-h-[640px] rounded-[24px] lg:rounded-[28px] overflow-hidden z-10"
          style={{
            boxShadow:'0 8px 12px rgba(0,0,0,.06), 0 32px 80px rgba(0,0,0,.1)',
            border:'1.5px solid rgba(0,0,0,.07)',
          }}
        >

          {/* ══ LEFT: Branding panel (desktop only) ══ */}
          <div className="hidden lg:flex flex-[0_0_52%] flex-col justify-between relative overflow-hidden px-10 py-11" style={{
            background:'linear-gradient(145deg,#ffffff 0%,#fafafa 100%)',
            borderRight:'1.5px solid rgba(0,0,0,.06)',
          }}>

            {/* Corner accents */}
            <div style={{ position:'absolute', top:0, right:0, width:200, height:200,
              background:'linear-gradient(225deg,#fef3c7 0%,transparent 70%)',
              borderRadius:'0 0 0 100%', pointerEvents:'none' }}/>
            <div style={{ position:'absolute', bottom:0, left:0, width:160, height:160,
              background:'linear-gradient(45deg,#d1fae5 0%,transparent 70%)',
              borderRadius:'0 100% 0 0', pointerEvents:'none' }}/>

            {/* Top section */}
            <div style={{ position:'relative', zIndex:1 }}>

              {/* Logo */}
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.2 }}
                style={{ display:'flex', alignItems:'center', gap:12, marginBottom:36 }}>
                <motion.div
                  animate={{ rotate:[0,6,-6,0] }} transition={{ duration:6, repeat:Infinity, ease:'easeInOut' }}
                  style={{ width:48, height:48, borderRadius:14, flexShrink:0,
                    background:'linear-gradient(135deg,#f59e0b,#f97316)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:22, boxShadow:'0 6px 20px rgba(245,158,11,.32)' }}>
                  <BsRobot color="white"/>
                </motion.div>
                <div>
                  <p style={{ fontSize:18, fontWeight:800, color:'#111827', letterSpacing:'-0.4px', lineHeight:1.2 }}>IntelliHire</p>
                  <p style={{ fontSize:11.5, color:'#9ca3af', fontWeight:500 }}>AI Interview Platform</p>
                </div>
              </motion.div>

              {/* Headline */}
              <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.3 }}>
                <h2 style={{ fontSize:36, fontWeight:900, color:'#111827',
                  lineHeight:1.13, letterSpacing:'-1.5px', marginBottom:14 }}>
                  Land your<br/>dream job{' '}
                  <span className="grad-text">smarter.</span>
                </h2>
                <p style={{ color:'#6b7280', fontSize:14, lineHeight:1.75, marginBottom:28, maxWidth:330 }}>
                  Practice with AI that adapts to you, delivers real-time coaching,
                  and prepares you for every curveball.
                </p>
              </motion.div>

              {/* Feature list */}
              <div style={{ display:'flex', flexDirection:'column', gap:11, marginBottom:28 }}>
                {FEATURES.map(({ icon:Icon, color, bg, label }, i) => (
                  <motion.div key={label}
                    initial={{ opacity:0, x:-14 }} animate={{ opacity:1, x:0 }} transition={{ delay:.38+i*.07 }}
                    style={{ display:'flex', alignItems:'center', gap:11 }}>
                    <div style={{ width:33, height:33, borderRadius:10, background:bg, flexShrink:0,
                      display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Icon size={14} color={color}/>
                    </div>
                    <span style={{ color:'#374151', fontSize:13.5, fontWeight:500, flex:1 }}>{label}</span>
                    <FiCheckCircle size={14} color={color}/>
                  </motion.div>
                ))}
              </div>

              {/* Stats row */}
              <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.58 }}
                style={{ display:'flex', gap:10 }}>
                {STATS.map(({ val, label, color }) => (
                  <div key={label} style={{ flex:1, padding:'12px 8px', borderRadius:12,
                    background:`${color}10`, border:`1.5px solid ${color}22`, textAlign:'center' }}>
                    <div style={{ fontSize:17, fontWeight:900, color }}>{val}</div>
                    <div style={{ fontSize:10.5, color:'#9ca3af', fontWeight:600, marginTop:2 }}>{label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Bottom: Testimonials */}
            <div style={{ position:'relative', zIndex:1 }}>
              <div style={{ height:1, background:'linear-gradient(90deg,transparent,#e5e7eb,transparent)', margin:'22px 0' }}/>

              <AnimatePresence mode="wait">
                <motion.div key={activeTest}
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                  transition={{ duration:.28 }}
                  style={{ background:'#f9fafb', borderRadius:13, padding:'14px 16px',
                    border:'1px solid #f0f0f0', marginBottom:12 }}>
                  <p style={{ color:'#4b5563', fontSize:13, lineHeight:1.6, fontStyle:'italic', marginBottom:10 }}>
                    {TESTIMONIALS[activeTest].text}
                  </p>
                  <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                    <div style={{ width:28, height:28, borderRadius:'50%', flexShrink:0,
                      background:`linear-gradient(135deg,${TESTIMONIALS[activeTest].color},${TESTIMONIALS[activeTest].color}88)`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:11, color:'white', fontWeight:800 }}>
                      {TESTIMONIALS[activeTest].avatar}
                    </div>
                    <div>
                      <p style={{ fontSize:12.5, fontWeight:700, color:'#111827', lineHeight:1.2 }}>
                        {TESTIMONIALS[activeTest].name}
                      </p>
                      <p style={{ fontSize:11, color:'#9ca3af' }}>{TESTIMONIALS[activeTest].role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Dot nav */}
              <div style={{ display:'flex', gap:6 }}>
                {TESTIMONIALS.map(({ color }, i) => (
                  <motion.button key={i} onClick={() => setActiveTest(i)}
                    animate={{ width: i===activeTest ? 22 : 6 }}
                    transition={{ duration:.28 }}
                    style={{ height:6, borderRadius:4, border:'none', cursor:'pointer',
                      background: i===activeTest ? color : '#e5e7eb' }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ══ RIGHT: Auth form ══ */}
          <div className="flex-1 flex flex-col justify-center sm:justify-between relative overflow-hidden bg-white px-5 sm:px-8 py-8 sm:py-11 lg:px-10 lg:py-11">

            {/* Amber corner accent */}
            <div style={{ position:'absolute', top:0, right:0, width:140, height:140,
              background:'linear-gradient(225deg,#fef3c740,transparent 70%)',
              borderRadius:'0 0 0 100%', pointerEvents:'none' }}/>

            {/* ── Section 1: Brand header ── */}
            <div style={{ textAlign:'center', marginBottom:24 }}>
              {/* Animated icon with glow ring */}
              <motion.div
                animate={{ y:[-4,4,-4] }} transition={{ duration:3.5, repeat:Infinity, ease:'easeInOut' }}
                style={{ display:'inline-flex', position:'relative', marginBottom:14 }}>
                <motion.div animate={{ scale:[1,1.6,1], opacity:[.35,0,.35] }} transition={{ duration:2.4, repeat:Infinity }}
                  style={{ position:'absolute', inset:-12, borderRadius:'50%', border:'2px solid #f59e0b', pointerEvents:'none' }}/>
                <motion.div animate={{ scale:[1,1.4,1], opacity:[.25,0,.25] }} transition={{ duration:2.4, repeat:Infinity, delay:.5 }}
                  style={{ position:'absolute', inset:-20, borderRadius:'50%', border:'2px solid #10b981', pointerEvents:'none' }}/>
                <div style={{ width:60, height:60, borderRadius:18,
                  background:'linear-gradient(135deg,#f59e0b,#f97316,#10b981)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:26, boxShadow:'0 10px 32px rgba(245,158,11,.3)' }}>
                  <BsRobot color="white"/>
                </div>
              </motion.div>

              {/* Brand name with gradient */}
              <h2 style={{ fontSize:20, fontWeight:900, letterSpacing:'-0.5px', lineHeight:1.2,
                background:'linear-gradient(135deg,#d97706,#059669,#2563eb)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                marginBottom:3 }}>
                IntelliHire
              </h2>
              <p style={{ fontSize:11.5, color:'#9ca3af', fontWeight:500, marginBottom:14 }}>
                AI-Powered Interview Platform
              </p>

              {/* Trust chips row */}
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { emoji:'🔒', label:'Secure Login',    bg:'#f0fdf4', border:'#bbf7d0', text:'#065f46' },
                  { emoji:'⚡', label:'Instant Access',  bg:'#fffbeb', border:'#fde68a', text:'#92400e' },
                ].map(({ emoji, label, bg, border, text }) => (
                  <div key={label} style={{ display:'flex', alignItems:'center', gap:5,
                    background:bg, border:`1px solid ${border}`, borderRadius:999,
                    padding:'4px 12px' }}>
                    <span style={{ fontSize:12 }}>{emoji}</span>
                    <span style={{ fontSize:11, fontWeight:700, color:text }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Section 2: Heading ── */}
            <div style={{ marginBottom:20 }}>
              <h1 style={{ fontSize:22, fontWeight:800, color:'#111827', letterSpacing:'-0.5px', marginBottom:8, lineHeight:1.3 }}>
                Start your AI journey
              </h1>
              <p style={{ color:'#6b7280', fontSize:13.5, lineHeight:1.65 }}>
                Sign in to practice mock interviews, track growth, and
                unlock AI-powered performance insights.
              </p>
            </div>

            {/* ── Section 3: AI badge ── */}
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:22,
              background:'linear-gradient(135deg,#fef3c7,#d1fae5)',
              border:'1.5px solid #fde68a', borderRadius:10, padding:'8px 14px', width:'fit-content' }}>
              <IoSparkles size={14} color="#f59e0b"/>
              <span style={{ fontSize:12, fontWeight:700,
                background:'linear-gradient(90deg,#d97706,#059669)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                AI-Powered Mock Interviews
              </span>
            </div>

            {/* ── Section 4: Google CTA ── */}
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  initial={{ opacity:0, scale:.85 }}
                  animate={{ opacity:1, scale:1 }}
                  transition={{ duration:.4, ease:'easeOut' }}
                  style={{ textAlign:'center', padding:'10px 0', position:'relative' }}
                >
                  {/* Confetti burst — 8 particles */}
                  {[0,45,90,135,180,225,270,315].map((deg, i) => (
                    <motion.div key={i}
                      initial={{ x:0, y:0, opacity:1, scale:1 }}
                      animate={{ x: Math.cos(deg*Math.PI/180)*52, y: Math.sin(deg*Math.PI/180)*52, opacity:0, scale:0 }}
                      transition={{ delay:i*.03, duration:.7, ease:'easeOut' }}
                      style={{ position:'absolute', top:'50%', left:'50%', width:8, height:8, borderRadius:'50%', marginLeft:-4, marginTop:-4,
                        background:['#f59e0b','#10b981','#3b82f6','#f97316','#8b5cf6','#ec4899','#06b6d4','#84cc16'][i] }}
                    />
                  ))}

                  {/* Animated circle + SVG checkmark */}
                  <div style={{ position:'relative', display:'inline-flex', marginBottom:16 }}>
                    {/* Outer ripple rings */}
                    <motion.div animate={{ scale:[1,1.8], opacity:[.4,0] }} transition={{ duration:1.2, repeat:Infinity }}
                      style={{ position:'absolute', inset:-10, borderRadius:'50%', border:'2px solid #10b981', pointerEvents:'none' }}/>
                    <motion.div animate={{ scale:[1,2.2], opacity:[.3,0] }} transition={{ duration:1.2, delay:.3, repeat:Infinity }}
                      style={{ position:'absolute', inset:-10, borderRadius:'50%', border:'2px solid #f59e0b', pointerEvents:'none' }}/>

                    {/* Gradient circle */}
                    <motion.div
                      initial={{ scale:0, rotate:-90 }} animate={{ scale:1, rotate:0 }}
                      transition={{ type:'spring', stiffness:260, damping:18, delay:.1 }}
                      style={{ width:72, height:72, borderRadius:'50%',
                        background:'linear-gradient(135deg,#10b981,#059669)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        boxShadow:'0 12px 40px rgba(16,185,129,.4)' }}>
                      {/* SVG draw-on checkmark */}
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                        <motion.path d="M8 18 L15 25 L28 11" stroke="white" strokeWidth="3.5"
                          strokeLinecap="round" strokeLinejoin="round" fill="none"
                          initial={{ pathLength:0 }} animate={{ pathLength:1 }}
                          transition={{ delay:.35, duration:.55, ease:'easeOut' }}/>
                      </svg>
                    </motion.div>
                  </div>

                  {/* Text */}
                  <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.5 }}>
                    <p style={{ fontSize:19, fontWeight:900, letterSpacing:'-0.5px', marginBottom:4,
                      background:'linear-gradient(135deg,#059669,#2563eb)',
                      WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                      You're in! 🚀
                    </p>
                    <p style={{ color:'#6b7280', fontSize:13, marginBottom:14 }}>
                      Setting up your account…
                    </p>

                    {/* Animated shimmer progress bar */}
                    <div style={{ height:5, borderRadius:99, background:'#e5e7eb', overflow:'hidden', marginBottom:6 }}>
                      <motion.div initial={{ width:'0%' }} animate={{ width:'100%' }}
                        transition={{ delay:.55, duration:2.2, ease:'easeInOut' }}
                        style={{ height:'100%', borderRadius:99,
                          background:'linear-gradient(90deg,#10b981,#3b82f6,#8b5cf6)',
                          backgroundSize:'200% 100%' }}/>
                    </div>
                    <p style={{ fontSize:10.5, color:'#9ca3af' }}>Redirecting you…</p>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.button key="google" onClick={handleGoogle} disabled={loading}
                  onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
                  whileHover={{ scale:1.02, boxShadow:'0 8px 28px rgba(0,0,0,.10)' }} whileTap={{ scale:.97 }}
                  style={{ width:'100%', padding:'14px 20px', background:'#fff',
                    border:'1.5px solid #e5e7eb', borderRadius:13,
                    display:'flex', alignItems:'center', justifyContent:'center', gap:12,
                    cursor:loading?'not-allowed':'pointer', position:'relative', overflow:'hidden',
                    boxShadow:'0 2px 8px rgba(0,0,0,.05)' }}>
                  <AnimatePresence>
                    {hovered && !loading && (
                      <motion.div initial={{ x:'-110%', opacity:.5 }} animate={{ x:'210%', opacity:.5 }}
                        exit={{ opacity:0 }} transition={{ duration:.5 }}
                        style={{ position:'absolute', inset:0, pointerEvents:'none',
                          background:'linear-gradient(90deg,transparent,rgba(245,158,11,.14),rgba(16,185,129,.14),transparent)' }}/>
                    )}
                  </AnimatePresence>
                  {loading ? (
                    <><motion.div animate={{ rotate:360 }} transition={{ duration:.7, repeat:Infinity, ease:'linear' }}
                      style={{ width:20, height:20, border:'2.5px solid #e5e7eb', borderTopColor:'#f59e0b', borderRadius:'50%' }}/>
                    <span style={{ color:'#6b7280', fontSize:14.5, fontWeight:600 }}>Connecting…</span></>
                  ) : (
                    <><FcGoogle size={22}/>
                    <span style={{ color:'#111827', fontSize:15, fontWeight:700 }}>Continue with Google</span>
                    <motion.div animate={{ x:hovered?4:0 }} transition={{ duration:.2 }} style={{ marginLeft:'auto' }}>
                      <FiArrowRight size={16} color="#9ca3af"/>
                    </motion.div></>
                  )}
                </motion.button>
              )}
            </AnimatePresence>

            {/* ── Error message ── */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                  style={{ marginTop:10, padding:'9px 12px', borderRadius:10,
                    background:'#fef2f2', border:'1.5px solid #fecaca',
                    display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:14 }}>⚠️</span>
                  <p style={{ color:'#b91c1c', fontSize:12.5, fontWeight:500 }}>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Section 5: Social proof ── */}
            <div style={{ marginTop:16, padding:'11px 14px',
              background:'#f9fafb', borderRadius:12, border:'1px solid #f0f0f0',
              display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ display:'flex' }}>
                {['#f59e0b','#10b981','#3b82f6','#8b5cf6'].map((c,i) => (
                  <div key={i} style={{ width:24, height:24, borderRadius:'50%', background:c,
                    border:'2px solid white', marginLeft:i>0?-8:0,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:9.5, color:'white', fontWeight:800 }}>
                    {['A','P','R','K'][i]}
                  </div>
                ))}
              </div>
              <p style={{ color:'#4b5563', fontSize:11.5, fontWeight:500 }}>
                <strong style={{ color:'#111827' }}>2,400+</strong> professionals joined this month
              </p>
            </div>

            {/* ── Footer ── */}
            <p style={{ textAlign:'center', marginTop:14, color:'#d1d5db', fontSize:11 }}>
              <a href="#" style={{ color:'#9ca3af', textDecoration:'none' }}>Terms of Service</a>
              {' · '}
              <a href="#" style={{ color:'#9ca3af', textDecoration:'none' }}>Privacy Policy</a>
            </p>
          </div>

        </motion.div>{/* end unified card */}
      </div>
    </>
  )
}

export default Auth