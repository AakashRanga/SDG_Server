import React, { Children } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, TargetIcon, ExternalLinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';
export function SDGData() {
  const navigate = useNavigate();
  const sdgGoals = [{
    number: 1,
    title: 'No Poverty',
    color: 'from-red-500 to-red-700',
    icon: '🏠'
  }, {
    number: 2,
    title: 'Zero Hunger',
    color: 'from-yellow-500 to-yellow-700',
    icon: '🌾'
  }, {
    number: 3,
    title: 'Good Health',
    color: 'from-green-500 to-green-700',
    icon: '❤️'
  }, {
    number: 4,
    title: 'Quality Education',
    color: 'from-red-600 to-red-800',
    icon: '📚'
  }, {
    number: 5,
    title: 'Gender Equality',
    color: 'from-orange-500 to-orange-700',
    icon: '⚖️'
  }, {
    number: 6,
    title: 'Clean Water',
    color: 'from-cyan-500 to-cyan-700',
    icon: '💧'
  }, {
    number: 7,
    title: 'Clean Energy',
    color: 'from-yellow-400 to-yellow-600',
    icon: '⚡'
  }, {
    number: 8,
    title: 'Economic Growth',
    color: 'from-red-700 to-red-900',
    icon: '💼'
  }, {
    number: 9,
    title: 'Innovation',
    color: 'from-orange-600 to-orange-800',
    icon: '🏗️'
  }, {
    number: 10,
    title: 'Reduced Inequalities',
    color: 'from-pink-500 to-pink-700',
    icon: '🤝'
  }, {
    number: 11,
    title: 'Sustainable Cities',
    color: 'from-amber-500 to-amber-700',
    icon: '🏙️'
  }, {
    number: 12,
    title: 'Responsible Consumption',
    color: 'from-yellow-600 to-yellow-800',
    icon: '♻️'
  }, {
    number: 13,
    title: 'Climate Action',
    color: 'from-green-600 to-green-800',
    icon: '🌍'
  }, {
    number: 14,
    title: 'Life Below Water',
    color: 'from-blue-500 to-blue-700',
    icon: '🐠'
  }, {
    number: 15,
    title: 'Life on Land',
    color: 'from-lime-500 to-lime-700',
    icon: '🌳'
  }, {
    number: 16,
    title: 'Peace & Justice',
    color: 'from-blue-700 to-blue-900',
    icon: '⚖️'
  }, {
    number: 17,
    title: 'Partnerships',
    color: 'from-indigo-600 to-indigo-800',
    icon: '🌐'
  }];
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0,
      scale: 0.9
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  };
  return <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 min-h-[40vh] flex items-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v6h6V4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-12 text-center z-10 w-full">
          <button onClick={() => navigate('/')} className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Dashboard
          </button>
          <button onClick={() => navigate('/sdg/site')} className="absolute top-6 right-6 flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors shadow-lg">
            <ExternalLinkIcon className="w-5 h-5" />
            Visit Site
          </button>
          <motion.div initial={{
          scale: 0,
          rotate: -180
        }} animate={{
          scale: 1,
          rotate: 0
        }} transition={{
          type: 'spring',
          stiffness: 100,
          damping: 15
        }} className="inline-block mb-6">
            <div className="bg-white/20 backdrop-blur-sm p-8 rounded-full">
              <TargetIcon className="w-20 h-20 text-white" />
            </div>
          </motion.div>
          <motion.h1 initial={{
          y: 20,
          opacity: 0
        }} animate={{
          y: 0,
          opacity: 1
        }} transition={{
          delay: 0.2
        }} className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            SDG-Hub
          </motion.h1>
          <motion.p initial={{
          y: 20,
          opacity: 0
        }} animate={{
          y: 0,
          opacity: 1
        }} transition={{
          delay: 0.3
        }} className="text-xl text-indigo-100 max-w-3xl mx-auto drop-shadow-md">
            Sustainable Development Goals Data Collection
          </motion.p>
          <motion.p initial={{
          y: 20,
          opacity: 0
        }} animate={{
          y: 0,
          opacity: 1
        }} transition={{
          delay: 0.4
        }} className="text-lg text-indigo-200 max-w-2xl mx-auto mt-2">
            Select a goal to contribute data and track progress
          </motion.p>
        </div>
      </div>
      {/* SDG Goals Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {sdgGoals.map(goal => <motion.button key={goal.number} variants={itemVariants} whileHover={{
          scale: 1.05,
          rotate: [0, -2, 2, -2, 0],
          transition: {
            duration: 0.3
          }
        }} whileTap={{
          scale: 0.95
        }} onClick={() => navigate(`/sdg/${goal.number}`)} className={`relative group bg-gradient-to-br ${goal.color} rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden aspect-square`}>
              {/* Animated background effect */}
              <motion.div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/20 to-white/0" animate={{
            rotate: [0, 360]
          }} transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear'
          }} />
              {/* Content */}
              <div className="relative p-6 flex flex-col items-center justify-center h-full">
                <motion.div className="text-6xl mb-3" animate={{
              scale: [1, 1.1, 1]
            }} transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}>
                  {goal.icon}
                </motion.div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold text-white">
                    {goal.number}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white text-center leading-tight drop-shadow-lg">
                  {goal.title}
                </h3>
              </div>
              {/* Hover effect */}
              <motion.div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" initial={false} />
            </motion.button>)}
        </motion.div>
      </div>
      {/* Info Section */}
      <motion.div initial={{
      y: 50,
      opacity: 0
    }} animate={{
      y: 0,
      opacity: 1
    }} transition={{
      delay: 0.6
    }} className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            About the Sustainable Development Goals
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            The 17 Sustainable Development Goals (SDGs) are a universal call to
            action to end poverty, protect the planet, and ensure that all
            people enjoy peace and prosperity by 2030. Click on any goal above
            to add data and track your institution's contributions.
          </p>
        </div>
      </motion.div>
    </div>;
}