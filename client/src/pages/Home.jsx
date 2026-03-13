import React from 'react';
import { HiSparkles } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BsMic, BsRobot, BsClock, BsClipboardCheck, BsFileEarmarkText, BsFileEarmarkPdf, BsGraphUp, BsCameraVideo, BsCodeSlash, BsPeople, BsDiagram3 } from 'react-icons/bs';
import aiEvaluationImg from '../assets/ai-evaluation.png';
import resumeInterviewImg from '../assets/resume-interview.png';
import pdfReportImg from '../assets/pdf-report.png';
import historyAnalyticsImg from '../assets/history-analytics.png';
import confidenceDetectionImg from '../assets/confidence-detection.png';
import technicalInterviewImg from '../assets/technical-interview.png';
import behavioralInterviewImg from '../assets/behavioral-interview.png';
import systemDesignImg from '../assets/system-design.png';

const Badge = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="flex justify-center mb-8"
  >
    <div className="bg-white shadow-sm border border-slate-200/60 text-slate-600 text-sm sm:text-base font-semibold px-4 py-2 sm:px-5 sm:py-2.5 rounded-full flex items-center gap-2 transition-all hover:shadow-md hover:-translate-y-0.5">
      <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
        <HiSparkles size={14} className="text-emerald-500" />
      </div>
      <span className="tracking-wide">AI Based Interview Assistance System</span>
    </div>
  </motion.div>
);

const Headline = () => {
    const navigate = useNavigate();
    return(
          <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
    className="text-center mb-16 md:mb-20 w-full"
  >
    <h1
      className="
        text-3xl sm:text-5xl md:text-6xl lg:text-[72px]
        font-extrabold tracking-tight text-slate-900
        leading-tight sm:leading-[1.1]
        max-w-4xl mx-auto flex flex-col items-center
        gap-4 md:gap-6 lg:gap-8
      "
    >
      <span>Practice Interviews with</span>
      <span className="relative inline-block">
        <span className="relative z-10 text-emerald-600 bg-emerald-100 px-4 py-2 rounded-full">
          AI Intelligence
        </span>
      </span>
    </h1>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      className="text-gray-600 mt-6 max-w-2xl mx-auto text-base sm:text-lg"
    >
      Role-based mock interviews with smart follow-ups, adaptive difficulty, 
      and real-time performance evaluation.
    </motion.p>
        <div className="flex flex-wrap justify-center gap-4 mt-10">
      <motion.button
        onClick={() => navigate('/interview')}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all hover:-translate-y-0.5"
      >
        Start Interview
      </motion.button>

      <motion.button
        onClick={() => navigate('/interview')}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        className="bg-white text-black border-[1.5px] border-black/40 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all hover:-translate-y-0.5"
      >
        View History
      </motion.button>
    </div>
  </motion.div>
    );
};

const FeatureCard = () => {
    return(
        <main>
   <div className='flex flex-col md:flex-row justify-center items-center gap-10 mb-28'>
        {
            [
                {
                    icon:<BsRobot size={24}/>,
                    step:"Step 1",
                    title:"Role & Experience Selection",
                    description:"AI adjust difficulty based on selected job role."
                },
                {
                    icon:<BsMic size={24}/>,
                    step:"Step 2",
                    title:"Smart Voice Interview",
                    description:"Dynamic follow-up questions based on your answers."
                },
                {
                    icon:<BsClock size={24}/>,
                    step:"Step 3",
                    title:"Timer based Simulation",
                    description:"Real interview pressure with time tracking."
                }   
            ].map((feature, index) => (
                <motion.div
                key={index}
                initial={{ opacity: 0, y: 60, rotate: index === 0 ? -4 : index === 1 ? 3 : index === 2 ? -3 : 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 + index * 0.2 }}
                whileHover={{ rotate: 0, scale: 1.06 }}
                className="relative bg-white rounded-3xl border-2 border-green-100 hover:border-green-500 p-10 w-80 max-w-[90%] shadow-md hover:shadow-2xl transition-all duration-300"
                >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white border-2 border-green-500 text-green-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                        {feature.icon}
                    </div>
                    <div className='pt-10 text-center'>
                        <div className='text-sm text-green-600 font-semibold mb-2 tracking-wider'>{feature.step}</div>
                        <h3 className='font-semibold mb-3 text-lg'>{feature.title}</h3>
                        <p className='text-gray-500 text-sm leading-relaxed'>{feature.description}</p>
                    </div>


                </motion.div>
            ))
        }
   </div>
   <div className='mb-32 max-w-6xl mx-auto'>
        <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-4xl font-semibold text-center mb-16'>
            Advanced AI{" "}
            <span className='text-green-600'>Capabilities</span>
        </motion.h2>
      <div className='grid md:grid-cols-2 gap-8 px-4 sm:px-6'>
        {[
          {
            icon: <BsClipboardCheck size={20} />,
            title: "AI Answer Evaluation",
            description: "Get instant, detailed feedback on your interview answers, highlighting strengths and areas for improvement.",
            image: aiEvaluationImg // AI interview illustration
          },
          {
            icon: <BsFileEarmarkText size={20} />,
            title: "Resume Based Interview",
            description: "The AI tailors its questions based on your uploaded resume, simulating a personalized, real-world interview experience.",
            image: resumeInterviewImg // Resume interview concept
          },
          {
            icon: <BsFileEarmarkPdf size={20} />,
            title: "Download PDF Report",
            description: "Easily export a comprehensive summary of your performance, including metrics and feedback, as a downloadable PDF.",
            image: pdfReportImg // PDF download icon
          },
          {
            icon: <BsGraphUp size={20} />,
            title: "History and Analytics",
            description: "Track your progress over time with detailed analytics and a complete history of all your past interview sessions.",
            image: historyAnalyticsImg // Analytics dashboard
    }
  ].map((capability, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover-shadow-xl transition-all"
    >
      <div className='flex flex-col md:flex-row items-center gap-8'>
        <div className='w-full md:w-1/2 flex justify-center'>
          <img src={capability.image} alt={capability.title} className='w-full h-auto rounded-2xl object-contain max-h-64' />
        </div>
        <div className='w-full md:w-1/2'>
          <div className='bg-green-50 text-green-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6'>
            {capability.icon}
          </div>
          <h3 className='text-xl font-semibold mb-3'>{capability.title}</h3>
          <p className='text-gray-500 text-sm leading-relaxed'>{capability.description}</p>
        </div>
      </div>
    </motion.div>
  ))}
      </div>
   </div>
    <div className='mb-32 max-w-6xl mx-auto'>
        <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-4xl font-semibold text-center mb-16'>
            Multiple Interview{" "}
            <span className='text-green-600'>Modes</span>
        </motion.h2>
      <div className='grid md:grid-cols-2 gap-8 px-4 sm:px-6'>
        {[
          {
            icon: <BsCameraVideo size={24} />,
            title: "Confidence Detection",
            description: "Advanced AI tracks your micro-expressions and speech patterns to analyze and report your confidence levels in real-time.",
            image: confidenceDetectionImg 
          },
          {
            icon: <BsCodeSlash size={24} />,
            title: "Technical Interview",
            description: "Deep-dive technical rounds focusing on coding concepts, algorithms, and tech-stack specific domain knowledge.",
            image: technicalInterviewImg 
          },
          {
            icon: <BsPeople size={24} />,
            title: "Behavioral Interview",
            description: "Prepare for HR and managerial rounds with STAR method situational questions focusing on leadership and conflict.",
            image: behavioralInterviewImg 
          },
          {
            icon: <BsDiagram3 size={24} />,
            title: "System Design",
            description: "Advanced architecture rounds testing your ability to design highly scalable, fault-tolerant, and distributed software systems.",
            image: systemDesignImg
    }
  ].map((capability, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover-shadow-xl transition-all"
    >
      <div className='flex flex-col md:flex-row items-center gap-8'>
        <div className='w-full md:w-1/2 flex justify-center'>
          <img src={capability.image} alt={capability.title} className='w-full h-auto rounded-2xl object-contain max-h-64' />
        </div>
        <div className='w-full md:w-1/2'>
          <div className='bg-green-50 text-green-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6'>
            {capability.icon}
          </div>
          <h3 className='text-xl font-semibold mb-3'>{capability.title}</h3>
          <p className='text-gray-500 text-sm leading-relaxed'>{capability.description}</p>
        </div>
      </div>
    </motion.div>
  ))}
      </div>
   </div>
   </main>
   );
};

const Home = () => {
  return (
    <div className="flex flex-col">

      <main className="flex-1 px-4 sm:px-6 pb-20 flex flex-col relative">
        <Badge />
        <Headline />
        <FeatureCard />
      </main>
    </div>
  );
};

export default Home;