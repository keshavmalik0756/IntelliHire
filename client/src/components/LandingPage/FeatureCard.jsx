import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

const FeatureCard = ({ icon, title, description, color, index }) => {
  let IconComponent = null;
  if (typeof icon === 'string' && LucideIcons[icon]) {
    IconComponent = LucideIcons[icon];
  }

  // Extract base color name (e.g., 'blue', 'violet') from convenience classes
  // This assumes the format 'text-color-600'
  const colorName = color ? color.split('-')[1] : 'blue';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      className="group relative h-full"
    >
      <div className={`
        relative h-full bg-white p-8 rounded-2xl
        border border-slate-100 shadow-sm
        transition-all duration-300 ease-out
        hover:shadow-xl hover:-translate-y-2
        hover:border-${colorName}-200
        overflow-hidden
      `}>
        
        {/* Soft colorful gradient background blush on hover */}
        <div className={`
          absolute -right-16 -top-16 w-32 h-32 rounded-full blur-3xl opacity-0 
          group-hover:opacity-20 transition-opacity duration-500
          bg-${colorName}-500
        `} />

        {/* Icon Container */}
        <div className={`
          w-14 h-14 rounded-2xl mb-6 flex items-center justify-center
          transition-colors duration-300
          bg-${colorName}-50 text-${colorName}-600
          group-hover:scale-110 group-hover:rotate-3
        `}>
          {IconComponent ? <IconComponent size={28} /> : icon}
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-slate-800">
          {title}
        </h3>
        
        <p className="text-slate-500 text-sm leading-relaxed">
          {description}
        </p>

        {/* Bottom colored line on hover */}
        <div className={`
          absolute bottom-0 left-0 w-full h-1 
          bg-gradient-to-r from-${colorName}-500 to-${colorName}-300
          transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left
        `} />
      </div>
    </motion.div>
  );
};

export default FeatureCard;