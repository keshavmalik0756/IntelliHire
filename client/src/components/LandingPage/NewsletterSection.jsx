import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';
import { useState } from 'react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-16 md:py-20 lg:py-24 bg-transparent relative overflow-hidden">
      {/* Background Decorations - Nature/Tech Theme */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl -z-10" />

      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-emerald-100/50 blur-3xl mix-blend-multiply"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-slate-100/50 blur-3xl mix-blend-multiply"
        animate={{
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-1.5 mb-6 shadow-sm">
             <Mail className="w-4 h-4 text-emerald-600" />
             <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Weekly Insights</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            Stay <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Interview Ready</span>
          </h2>

          <p className="text-slate-500 text-lg mb-10 leading-relaxed">
            Subscribe to get the latest interview tips, new question categories, and career insights delivered to your inbox.
          </p>
          
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-emerald-800 shadow-lg shadow-emerald-100/50"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                <Send size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Thank You!</h3>
              <p>You've been successfully subscribed to our newsletter.</p>
            </motion.div>
          ) : (
            <form 
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              onSubmit={handleSubmit}
            >
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base transition-all duration-300 hover:border-emerald-200 shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button 
                className="bg-slate-900 text-white px-8 py-4 rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto text-base font-bold transition-all duration-300 hover:bg-slate-800 hover:shadow-lg active:scale-95 border border-transparent hover:shadow-emerald-500/20"
                type="submit"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Send size={20} />
                  </motion.div>
                ) : (
                  <>
                    <Send size={20} /> Subscribe
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;