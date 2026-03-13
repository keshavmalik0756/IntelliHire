import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { ArrowRight, Heart } from 'lucide-react';
import { BsTwitterX } from 'react-icons/bs';
import Logo from './Logo';
import { footerSections, socialLinks } from './LandingPage/data';

const Footer = () => {
  const navigate = useNavigate();

  const handleLogin = () => navigate('/login');
  const handleSignup = () => navigate('/signup');

  const handleLinkClick = (link) => {
    if (link.href?.startsWith('#')) {
      const element = document.querySelector(link.href);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.log(`Navigate to ${link.text}`);
    }
  };

  const SocialIcon = ({ name, size = 18 }) => {
    if (name === 'BsTwitterX') return <BsTwitterX size={size} />;
    const IconComponent = LucideIcons[name];
    if (!IconComponent) return null;
    return <IconComponent size={size} />;
  };

  return (
    <footer className="relative bg-slate-50 pt-16 pb-12 overflow-hidden border-t border-slate-200">
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Ambient Bloom - more subtle and centered */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-12">
          
          {/* Brand & Socials (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-4">
              <Logo size="md" className="text-slate-900" />
              <p className="text-slate-600 leading-relaxed max-w-sm text-sm font-medium">
                The advanced AI interview coach that helps you master technical, behavioral, and situational questions with real-time feedback.
              </p>
            </div>
            
            <div className="flex gap-2.5">
              {socialLinks.map(({ icon, url, color }, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-400 transition-all duration-300 ${color}`}
                >
                  <SocialIcon name={icon} size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid (Span 8) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12">
            {footerSections.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-slate-900 font-bold mb-5 text-[11px] uppercase tracking-widest">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <button 
                        onClick={() => handleLinkClick(link)}
                        className="text-slate-500 hover:text-emerald-600 transition-colors text-[13.5px] font-medium flex items-center group"
                      >
                        <span className="w-0 group-hover:w-2 transition-all duration-300 overflow-hidden text-emerald-600 mr-0 group-hover:mr-1">
                          •
                        </span>
                        {link.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p className="text-slate-500 text-[13px] font-medium">
              © {new Date().getFullYear()} IntelliHire Inc.
            </p>
            <span className="hidden md:block text-slate-300 text-xs">|</span>
            <div className="flex items-center gap-4 text-[13px] text-slate-500 font-medium">
               <button className="hover:text-emerald-600 transition-colors">Privacy</button>
               <button className="hover:text-emerald-600 transition-colors">Terms</button>
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-3 py-1.5 bg-emerald-50/50 rounded-full border border-emerald-100/50">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
             <span className="text-emerald-700 text-[10px] font-bold uppercase tracking-wider">Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;