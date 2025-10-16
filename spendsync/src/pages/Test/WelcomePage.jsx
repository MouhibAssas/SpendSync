import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/welcome/Navbar';
import HeroSection from '../../components/welcome/HeroSection';
import FeaturesSection from '../../components/welcome/FeaturesSection';
import CTASection from '../../components/welcome/CTASection';
import Footer from '../../components/welcome/Footer';
import { useInView } from 'react-intersection-observer';
import toast from 'react-hot-toast'

const WelcomePage = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/signup');
  };
  
  const handleLogin = () => {
    navigate('/login');
  };

  // Intersection observer for scroll animations
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Floating animation for background elements
  const floatingVariants = {
    animate: {
      y: [0, -15, 0],
      x: [0, 5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          variants={floatingVariants}
          animate="animate"
        />
        <motion.div
          className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "2s" }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-gray-700 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <Navbar />

      <HeroSection onGetStarted={handleGetStarted} />

      <FeaturesSection />

      <CTASection onGetStarted={handleGetStarted} />

      <Footer />
    </div>
  );
};

export default WelcomePage;