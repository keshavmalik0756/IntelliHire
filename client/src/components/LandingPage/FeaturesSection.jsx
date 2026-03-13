import SectionTitle from './SectionTitle';
import FeatureCard from './FeatureCard';
import { keyFeatures } from './data';

const FeaturesSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <section id="features" className="py-16 md:py-20 lg:py-24 relative overflow-hidden bg-slate-50/50">
      {/* Ambient Background Elements - Matching Hero Theme */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-100/50 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDuration: '5s' }} />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-teal-100/50 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDuration: '8s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-white border border-emerald-100 rounded-full px-4 py-1.5 mb-6 shadow-sm">
             <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
             <span className="text-sm font-semibold text-slate-600">Powerful Capabilities</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
             Everything you need to <br className="hidden sm:block" />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
               ace your interview
             </span>
          </h2>
          
          <p className="text-lg text-slate-600 leading-relaxed">
            Our platform combines advanced AI analysis with proven interview techniques specifically designed to help you stand out from the competition.
          </p>
        </div>

        {/* Features Grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
           {keyFeatures.map((feature, idx) => (
             <FeatureCard key={idx} {...feature} index={idx} />
           ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;