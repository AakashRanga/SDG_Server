import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, TargetIcon, TrendingUpIcon, DownloadIcon, ExternalLinkIcon, FileIcon, FlaskConicalIcon, FileBarChartIcon, BookOpenIcon, AwardIcon, UsersIcon, GlobeIcon, SparklesIcon, TrophyIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useSDG } from '../contexts/SDGContext';
import { useResearch } from '../contexts/ResearchContext';
import { motion, AnimatePresence } from 'framer-motion';
export function SDGSite() {
  const navigate = useNavigate();
  const {
    sdgData,
    researchActivities,
    reports
  } = useSDG();
  const {
    publications
  } = useResearch();
  const [expandedResearch, setExpandedResearch] = useState<Record<string, boolean>>({});
  const [expandedReports, setExpandedReports] = useState<Record<string, boolean>>({});
  const [expandedPublications, setExpandedPublications] = useState<Record<string, boolean>>({});
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active'>('all');
  const [hoveredGoal, setHoveredGoal] = useState<number | null>(null);
  // Animated counter hook
  const useCounter = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    useEffect(() => {
      if (!hasAnimated) {
        let startTime: number | null = null;
        const animate = (currentTime: number) => {
          if (!startTime) startTime = currentTime;
          const progress = Math.min((currentTime - startTime) / duration, 1);
          setCount(Math.floor(progress * end));
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setHasAnimated(true);
          }
        };
        requestAnimationFrame(animate);
      }
    }, [end, duration, hasAnimated]);
    return count;
  };
  // Official UN SDG Colors
  const sdgGoals = [{
    number: 1,
    title: 'No Poverty',
    description: 'End poverty in all its forms everywhere',
    color: 'from-[#E5243B] to-[#C51E31]',
    solidColor: '#E5243B',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    icon: '🏠'
  }, {
    number: 2,
    title: 'Zero Hunger',
    description: 'End hunger, achieve food security and improved nutrition',
    color: 'from-[#DDA63A] to-[#C4922F]',
    solidColor: '#DDA63A',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    icon: '🌾'
  }, {
    number: 3,
    title: 'Good Health',
    description: 'Ensure healthy lives and promote well-being for all',
    color: 'from-[#4C9F38] to-[#3D8C2D]',
    solidColor: '#4C9F38',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    icon: '❤️'
  }, {
    number: 4,
    title: 'Quality Education',
    description: 'Ensure inclusive and equitable quality education',
    color: 'from-[#C5192D] to-[#A31424]',
    solidColor: '#C5192D',
    bgColor: 'bg-red-50',
    textColor: 'text-red-800',
    icon: '📚'
  }, {
    number: 5,
    title: 'Gender Equality',
    description: 'Achieve gender equality and empower all women and girls',
    color: 'from-[#FF3A21] to-[#E6331D]',
    solidColor: '#FF3A21',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    icon: '⚖️'
  }, {
    number: 6,
    title: 'Clean Water',
    description: 'Ensure availability and sustainable management of water',
    color: 'from-[#26BDE2] to-[#1FA9CC]',
    solidColor: '#26BDE2',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    icon: '💧'
  }, {
    number: 7,
    title: 'Clean Energy',
    description: 'Ensure access to affordable, reliable, sustainable energy',
    color: 'from-[#FCC30B] to-[#E3AF0A]',
    solidColor: '#FCC30B',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    icon: '⚡'
  }, {
    number: 8,
    title: 'Economic Growth',
    description: 'Promote sustained, inclusive economic growth',
    color: 'from-[#A21942] to-[#8A1437]',
    solidColor: '#A21942',
    bgColor: 'bg-red-50',
    textColor: 'text-red-900',
    icon: '💼'
  }, {
    number: 9,
    title: 'Innovation',
    description: 'Build resilient infrastructure, promote innovation',
    color: 'from-[#FD6925] to-[#E45E21]',
    solidColor: '#FD6925',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-800',
    icon: '🏗️'
  }, {
    number: 10,
    title: 'Reduced Inequalities',
    description: 'Reduce inequality within and among countries',
    color: 'from-[#DD1367] to-[#C4115B]',
    solidColor: '#DD1367',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-700',
    icon: '🤝'
  }, {
    number: 11,
    title: 'Sustainable Cities',
    description: 'Make cities and human settlements inclusive and sustainable',
    color: 'from-[#FD9D24] to-[#E48D20]',
    solidColor: '#FD9D24',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    icon: '🏙️'
  }, {
    number: 12,
    title: 'Responsible Consumption',
    description: 'Ensure sustainable consumption and production patterns',
    color: 'from-[#BF8B2E] to-[#A97C28]',
    solidColor: '#BF8B2E',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-800',
    icon: '♻️'
  }, {
    number: 13,
    title: 'Climate Action',
    description: 'Take urgent action to combat climate change',
    color: 'from-[#3F7E44] to-[#356B39]',
    solidColor: '#3F7E44',
    bgColor: 'bg-green-50',
    textColor: 'text-green-800',
    icon: '🌍'
  }, {
    number: 14,
    title: 'Life Below Water',
    description: 'Conserve and sustainably use the oceans and marine resources',
    color: 'from-[#0A97D9] to-[#0985C2]',
    solidColor: '#0A97D9',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    icon: '🐠'
  }, {
    number: 15,
    title: 'Life on Land',
    description: 'Protect, restore and promote sustainable use of ecosystems',
    color: 'from-[#56C02B] to-[#4CAC26]',
    solidColor: '#56C02B',
    bgColor: 'bg-lime-50',
    textColor: 'text-lime-700',
    icon: '🌳'
  }, {
    number: 16,
    title: 'Peace & Justice',
    description: 'Promote peaceful and inclusive societies',
    color: 'from-[#00689D] to-[#005A8A]',
    solidColor: '#00689D',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-900',
    icon: '⚖️'
  }, {
    number: 17,
    title: 'Partnerships',
    description: 'Strengthen the means of implementation',
    color: 'from-[#19486A] to-[#153D5A]',
    solidColor: '#19486A',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-800',
    icon: '🌐'
  }];
  // Function to get total count for each SDG
  function getCountForGoal(goalNumber: number): number {
    const goalData = sdgData[goalNumber] || [];
    const goalResearch = researchActivities[goalNumber] || [];
    const goalReports = reports[goalNumber] || [];
    const goalPublications = getPublicationsForGoal(goalNumber);
    return goalData.length + goalResearch.length + goalReports.length + goalPublications.length;
  }
  const totalInitiatives = Object.values(sdgData).reduce((sum, items) => sum + items.length, 0);
  const totalResearch = Object.values(researchActivities).reduce((sum, items) => sum + items.length, 0);
  const totalReports = Object.values(reports).reduce((sum, items) => sum + items.length, 0);
  const totalPublications = [...publications.journals, ...publications.conferences, ...publications.books].filter(pub => pub.sdgGoals && pub.sdgGoals.length > 0).length;
  const totalCount = totalInitiatives + totalResearch + totalReports + totalPublications;
  const activeGoalsCount = sdgGoals.filter(goal => getCountForGoal(goal.number) > 0).length;
  // Animated counters
  const animatedInitiatives = useCounter(totalInitiatives);
  const animatedResearch = useCounter(totalResearch);
  const animatedPublications = useCounter(totalPublications);
  const animatedReports = useCounter(totalReports);
  const animatedActiveGoals = useCounter(activeGoalsCount);
  const handleFileClick = (url: string) => {
    window.open(url, '_blank');
  };
  function getPublicationsForGoal(goalNumber: number) {
    const allPublications = [...publications.journals.map(p => ({
      ...p,
      type: 'Journal'
    })), ...publications.conferences.map(p => ({
      ...p,
      type: 'Conference'
    })), ...publications.books.map(p => ({
      ...p,
      type: 'Book'
    }))];
    return allPublications.filter(pub => pub.sdgGoals && pub.sdgGoals.includes(goalNumber));
  }
  const filteredGoals = activeFilter === 'active' ? sdgGoals.filter(goal => getCountForGoal(goal.number) > 0) : sdgGoals;
  const achievements = [{
    icon: '🏆',
    title: 'Sustainability Leader',
    description: 'Ranked #1 in regional sustainability initiatives',
    color: 'from-yellow-400 to-amber-500'
  }, {
    icon: '🌟',
    title: 'Innovation Excellence',
    description: 'Award-winning climate research programs',
    color: 'from-blue-400 to-indigo-500'
  }, {
    icon: '🤝',
    title: 'Global Partnerships',
    description: 'Collaborating with 50+ international institutions',
    color: 'from-green-400 to-emerald-500'
  }, {
    icon: '📊',
    title: 'Impact Metrics',
    description: 'Measurable positive change in all SDG areas',
    color: 'from-purple-400 to-pink-500'
  }];
  return <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 min-h-screen flex items-center">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => <motion.div key={i} className="absolute rounded-full bg-white/10" style={{
          width: Math.random() * 100 + 20 + 'px',
          height: Math.random() * 100 + 20 + 'px',
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%'
        }} animate={{
          y: [0, -30, 0],
          x: [0, Math.random() * 20 - 10, 0],
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3]
        }} transition={{
          duration: Math.random() * 5 + 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }} />)}
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 z-10 w-full">
          <motion.button initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} onClick={() => navigate('/sdg')} className="flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-12 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <ArrowLeftIcon className="w-5 h-5" />
            Back to SDG Hub
          </motion.button>
          {/* Main Hero Content */}
          <div className="text-center mb-16">
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
          }} className="inline-block mb-8">
              <div className="relative">
                <motion.div className="absolute inset-0 bg-white/30 blur-3xl" animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }} transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }} />
                <div className="relative bg-white/20 backdrop-blur-sm p-12 rounded-full">
                  <TargetIcon className="w-32 h-32 text-white" />
                </div>
              </div>
            </motion.div>
            <motion.h1 initial={{
            y: 30,
            opacity: 0
          }} animate={{
            y: 0,
            opacity: 1
          }} transition={{
            delay: 0.2
          }} className="text-6xl md:text-8xl font-bold text-white mb-6 drop-shadow-2xl">
              Leading the Way
            </motion.h1>
            <motion.div initial={{
            y: 30,
            opacity: 0
          }} animate={{
            y: 0,
            opacity: 1
          }} transition={{
            delay: 0.3
          }} className="mb-8">
              <p className="text-3xl text-white/95 font-bold mb-4">
                In Sustainable Development
              </p>
              <p className="text-xl text-white/80 max-w-4xl mx-auto">
                Pioneering innovative solutions and research that create lasting
                impact across all 17 UN Sustainable Development Goals
              </p>
            </motion.div>
            {/* Animated Statistics Grid */}
            <motion.div initial={{
            y: 30,
            opacity: 0
          }} animate={{
            y: 0,
            opacity: 1
          }} transition={{
            delay: 0.4
          }} className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-6xl mx-auto mb-12">
              {[{
              value: animatedActiveGoals,
              label: 'Active SDG Goals',
              icon: '🎯',
              color: 'from-yellow-400 to-orange-500'
            }, {
              value: animatedInitiatives,
              label: 'Activities',
              icon: '🚀',
              color: 'from-green-400 to-emerald-500'
            }, {
              value: animatedResearch,
              label: 'Research Projects',
              icon: '🔬',
              color: 'from-blue-400 to-cyan-500'
            }, {
              value: animatedPublications,
              label: 'Publications',
              icon: '📚',
              color: 'from-purple-400 to-pink-500'
            }, {
              value: animatedReports,
              label: 'Impact Reports',
              icon: '📊',
              color: 'from-red-400 to-rose-500'
            }].map((stat, idx) => <motion.div key={idx} initial={{
              scale: 0,
              rotate: -180
            }} animate={{
              scale: 1,
              rotate: 0
            }} transition={{
              delay: 0.5 + idx * 0.1,
              type: 'spring',
              stiffness: 100
            }} whileHover={{
              scale: 1.05,
              y: -5
            }} className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-50 blur-xl group-hover:opacity-75 transition-opacity`} />
                  <div className="relative bg-white/20 backdrop-blur-md p-6 rounded-2xl border-2 border-white/30">
                    <div className="text-5xl mb-3">{stat.icon}</div>
                    <motion.p className="text-6xl font-bold text-white mb-2" key={stat.value}>
                      {stat.value}
                    </motion.p>
                    <p className="text-white/90 font-semibold text-sm">
                      {stat.label}
                    </p>
                  </div>
                </motion.div>)}
            </motion.div>
            {/* Achievement Badges */}
            <motion.div initial={{
            y: 30,
            opacity: 0
          }} animate={{
            y: 0,
            opacity: 1
          }} transition={{
            delay: 0.9
          }} className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {achievements.map((achievement, idx) => <motion.div key={idx} initial={{
              scale: 0
            }} animate={{
              scale: 1
            }} transition={{
              delay: 1 + idx * 0.1,
              type: 'spring'
            }} whileHover={{
              scale: 1.05,
              rotate: [0, -2, 2, 0]
            }} className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-r ${achievement.color} opacity-40 blur-xl group-hover:opacity-70 transition-opacity`} />
                  <div className="relative bg-white/20 backdrop-blur-md p-6 rounded-xl border-2 border-white/30">
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <h3 className="text-white font-bold text-lg mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {achievement.description}
                    </p>
                  </div>
                </motion.div>)}
            </motion.div>
          </div>
        </div>
        {/* Scroll Indicator */}
        <motion.div className="absolute bottom-8 left-1/2 transform -translate-x-1/2" animate={{
        y: [0, 10, 0]
      }} transition={{
        duration: 2,
        repeat: Infinity
      }}>
          <ChevronDownIcon className="w-12 h-12 text-white/60" />
        </motion.div>
      </div>
      {/* Interactive Filter Section */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-lg border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Explore Our Impact
              </h2>
              <div className="flex gap-2">
                <button onClick={() => setActiveFilter('all')} className={`px-6 py-2 rounded-full font-semibold transition-all ${activeFilter === 'all' ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  All Goals ({sdgGoals.length})
                </button>
                <button onClick={() => setActiveFilter('active')} className={`px-6 py-2 rounded-full font-semibold transition-all ${activeFilter === 'active' ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  Active Goals ({activeGoalsCount})
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <SparklesIcon className="w-5 h-5 text-purple-600" />
              <p className="text-gray-600 font-medium">
                Click on any goal to explore detailed initiatives
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* SDG Goals Grid with Enhanced Interactivity */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-16">
          {filteredGoals.map(goal => {
          const goalData = sdgData[goal.number] || [];
          const goalResearch = researchActivities[goal.number] || [];
          const goalReports = reports[goal.number] || [];
          const goalPublications = getPublicationsForGoal(goal.number);
          const hasData = goalData.length > 0 || goalResearch.length > 0 || goalReports.length > 0 || goalPublications.length > 0;
          return <motion.button key={goal.number} initial={{
            opacity: 0,
            scale: 0.8
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} viewport={{
            once: true
          }} whileHover={{
            scale: 1.05,
            rotate: [0, -2, 2, 0],
            transition: {
              duration: 0.3
            }
          }} whileTap={{
            scale: 0.95
          }} onClick={() => setSelectedGoal(selectedGoal === goal.number ? null : goal.number)} className={`relative group bg-gradient-to-br ${goal.color} rounded-3xl shadow-xl hover:shadow-2xl transition-all overflow-hidden aspect-square ${hasData ? 'ring-4 ring-yellow-400 ring-offset-2' : ''}`}>
                {hasData && <motion.div className="absolute top-2 right-2 bg-yellow-400 rounded-full p-2" animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }} transition={{
              duration: 2,
              repeat: Infinity
            }}>
                    <TrophyIcon className="w-5 h-5 text-yellow-900" />
                  </motion.div>}
                <motion.div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/20 to-white/0" animate={{
              rotate: [0, 360]
            }} transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear'
            }} />
                <div className="relative p-6 flex flex-col items-center justify-center h-full">
                  <motion.div className="text-6xl mb-3" animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }} transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}>
                    {goal.icon}
                  </motion.div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full w-14 h-14 flex items-center justify-center mb-3">
                    <span className="text-3xl font-bold text-white">
                      {goal.number}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white text-center leading-tight drop-shadow-lg mb-2">
                    {goal.title}
                  </h3>
                  {hasData && <div className="flex gap-1">
                      <div className="w-2 h-2 bg-white rounded-full" />
                      <div className="w-2 h-2 bg-white rounded-full" />
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>}
                </div>
                <motion.div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" initial={false} />
              </motion.button>;
        })}
        </div>
        {/* Expanded Goal Details */}
        <AnimatePresence>
          {selectedGoal && <motion.div initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: 'auto'
        }} exit={{
          opacity: 0,
          height: 0
        }} className="mb-16">
              {sdgGoals.filter(g => g.number === selectedGoal).map(goal => {
            const goalData = sdgData[goal.number] || [];
            const goalResearch = researchActivities[goal.number] || [];
            const goalReports = reports[goal.number] || [];
            const goalPublications = getPublicationsForGoal(goal.number);
            const hasData = goalData.length > 0 || goalResearch.length > 0 || goalReports.length > 0 || goalPublications.length > 0;
            return <motion.div key={goal.number} initial={{
              opacity: 0,
              y: 50
            }} animate={{
              opacity: 1,
              y: 0
            }} className={`${goal.bgColor} rounded-3xl shadow-2xl overflow-hidden`}>
                      {/* Goal Header */}
                      <div className={`bg-gradient-to-r ${goal.color} p-8 text-white`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div className="text-7xl">{goal.icon}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-2">
                                <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center">
                                  <span className="text-3xl font-bold">
                                    {goal.number}
                                  </span>
                                </div>
                                <h2 className="text-4xl font-bold">
                                  {goal.title}
                                </h2>
                              </div>
                              <p className="text-xl text-white/90">
                                {goal.description}
                              </p>
                            </div>
                          </div>
                          <button onClick={() => setSelectedGoal(null)} className="bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors">
                            <ChevronUpIcon className="w-8 h-8" />
                          </button>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-8">
                          <div className="text-center bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
                            <p className="text-4xl font-bold">
                              {goalData.length}
                            </p>
                            <p className="text-sm text-white/90">Activities</p>
                          </div>
                          <div className="text-center bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
                            <p className="text-4xl font-bold">
                              {goalResearch.length}
                            </p>
                            <p className="text-sm text-white/90">Research</p>
                          </div>
                          <div className="text-center bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
                            <p className="text-4xl font-bold">
                              {goalPublications.length}
                            </p>
                            <p className="text-sm text-white/90">
                              Publications
                            </p>
                          </div>
                          <div className="text-center bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
                            <p className="text-4xl font-bold">
                              {goalReports.length}
                            </p>
                            <p className="text-sm text-white/90">Reports</p>
                          </div>
                        </div>
                      </div>
                      {/* Goal Content */}
                      <div className="p-8">
                        {hasData ? <div className="space-y-8">
                            {/* Activities Section */}
                            {goalData.length > 0 && <div>
                                <h3 className={`text-2xl font-bold ${goal.textColor} mb-4 flex items-center gap-2`}>
                                  <TargetIcon className="w-6 h-6" />
                                  Activities
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {goalData.map(item => <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                      <h3 className={`text-2xl font-bold ${goal.textColor} mb-3`}>
                                        {item.title}
                                      </h3>
                                      <p className="text-gray-600 mb-4 line-clamp-3">
                                        {item.description}
                                      </p>
                                      {item.images && item.images.length > 0 && <div className="grid grid-cols-2 gap-2 mb-4">
                                            {item.images.slice(0, 2).map((image, idx) => <img key={idx} src={image} alt={`${item.title} ${idx + 1}`} className="w-full h-32 object-cover rounded-lg" />)}
                                          </div>}
                                      {item.metrics && item.metrics.length > 0 && <div className="grid grid-cols-2 gap-3 mb-4">
                                            {item.metrics.map((metric, idx) => <div key={idx} className={`${goal.bgColor} p-3 rounded-lg`}>
                                                <p className="text-xs text-gray-600 mb-1">
                                                  {metric.label}
                                                </p>
                                                <p className={`text-xl font-bold ${goal.textColor}`}>
                                                  {metric.value} {metric.unit}
                                                </p>
                                              </div>)}
                                          </div>}
                                      <div className="flex flex-wrap gap-2">
                                        {item.year && <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                            {item.year}
                                          </span>}
                                        {item.category && <span className={`px-3 py-1 ${goal.bgColor} ${goal.textColor} rounded-full text-sm font-medium`}>
                                            {item.category}
                                          </span>}
                                        {item.impact && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                                            <TrendingUpIcon className="w-3 h-3" />
                                            {item.impact}
                                          </span>}
                                      </div>
                                    </div>)}
                                </div>
                              </div>}
                            {/* Research Activities Section */}
                            {goalResearch.length > 0 && <div>
                                <h3 className={`text-2xl font-bold ${goal.textColor} mb-4 flex items-center gap-2`}>
                                  <FlaskConicalIcon className="w-6 h-6" />
                                  Research Grant
                                </h3>
                                <div className="grid grid-cols-1 gap-6">
                                  {goalResearch.map(item => <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                      <h4 className={`text-2xl font-bold ${goal.textColor} mb-3`}>
                                        {item.title}
                                      </h4>
                                      <p className="text-gray-600 mb-4">
                                        {item.description}
                                      </p>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                        <div className={`${goal.bgColor} p-3 rounded-lg`}>
                                          <p className="text-xs text-gray-600">
                                            Lead Researcher
                                          </p>
                                          <p className={`text-sm font-semibold ${goal.textColor}`}>
                                            {item.leadResearcher}
                                          </p>
                                        </div>
                                        <div className={`${goal.bgColor} p-3 rounded-lg`}>
                                          <p className="text-xs text-gray-600">
                                            Department
                                          </p>
                                          <p className={`text-sm font-semibold ${goal.textColor}`}>
                                            {item.department}
                                          </p>
                                        </div>
                                        {item.fundingAmount && <div className={`${goal.bgColor} p-3 rounded-lg`}>
                                            <p className="text-xs text-gray-600">
                                              Funding
                                            </p>
                                            <p className={`text-sm font-semibold ${goal.textColor}`}>
                                              {item.fundingAmount}
                                            </p>
                                          </div>}
                                        {item.publications && <div className={`${goal.bgColor} p-3 rounded-lg`}>
                                            <p className="text-xs text-gray-600">
                                              Publications
                                            </p>
                                            <p className={`text-sm font-semibold ${goal.textColor}`}>
                                              {item.publications}
                                            </p>
                                          </div>}
                                      </div>
                                      {item.files && item.files.length > 0 && <div className="mt-4">
                                          <button onClick={() => setExpandedResearch(prev => ({
                            ...prev,
                            [item.id]: !prev[item.id]
                          }))} className={`flex items-center gap-2 text-sm font-semibold ${goal.textColor} mb-3 hover:underline`}>
                                            <FileIcon className="w-4 h-4" />
                                            Publications & Project Files (
                                            {item.files.length})
                                          </button>
                                          {expandedResearch[item.id] && <div className="space-y-2">
                                              {item.files.map((file, idx) => <button key={idx} onClick={() => handleFileClick(file.url)} className="w-full flex items-center justify-between bg-blue-50 hover:bg-blue-100 p-3 rounded-lg transition-colors group">
                                                  <div className="flex items-center gap-3">
                                                    <FileIcon className="w-5 h-5 text-blue-600" />
                                                    <div className="text-left">
                                                      <p className="text-sm font-medium text-gray-800 group-hover:text-blue-700">
                                                        {file.name}
                                                      </p>
                                                      <p className="text-xs text-gray-500">
                                                        {file.size}
                                                      </p>
                                                    </div>
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    <ExternalLinkIcon className="w-4 h-4 text-blue-600" />
                                                    <span className="text-xs text-blue-600 font-medium">
                                                      Open
                                                    </span>
                                                  </div>
                                                </button>)}
                                            </div>}
                                        </div>}
                                      <div className="flex flex-wrap gap-2 mt-4">
                                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                          {item.year}
                                        </span>
                                        <span className={`px-3 py-1 ${goal.bgColor} ${goal.textColor} rounded-full text-sm font-medium`}>
                                          {item.researchType}
                                        </span>
                                      </div>
                                    </div>)}
                                </div>
                              </div>}
                            {/* Publications Section */}
                            {goalPublications.length > 0 && <div>
                                <h3 className={`text-2xl font-bold ${goal.textColor} mb-4 flex items-center gap-2`}>
                                  <BookOpenIcon className="w-6 h-6" />
                                  Publications & Scholarly Output
                                </h3>
                                <div className="grid grid-cols-1 gap-6">
                                  {goalPublications.map(item => <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                      <div className="flex items-start justify-between mb-3">
                                        <h4 className={`text-2xl font-bold ${goal.textColor} flex-1`}>
                                          {item.title}
                                        </h4>
                                        <span className={`px-3 py-1 ${goal.bgColor} ${goal.textColor} rounded-full text-sm font-medium`}>
                                          {item.type}
                                        </span>
                                      </div>
                                      <p className="text-gray-600 mb-4">
                                        {item.description}
                                      </p>
                                      {item.link && <div className="mb-4">
                                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                            <ExternalLinkIcon className="w-4 h-4" />
                                            View Publication
                                          </a>
                                        </div>}
                                      {item.files && item.files.length > 0 && <div className="mt-4">
                                          <button onClick={() => setExpandedPublications(prev => ({
                            ...prev,
                            [item.id]: !prev[item.id]
                          }))} className={`flex items-center gap-2 text-sm font-semibold ${goal.textColor} mb-3 hover:underline`}>
                                            <FileIcon className="w-4 h-4" />
                                            View Files ({item.files.length})
                                          </button>
                                          {expandedPublications[item.id] && <div className="space-y-2">
                                              {item.files.map((file, idx) => <button key={idx} onClick={() => handleFileClick(file.url)} className="w-full flex items-center justify-between bg-purple-50 hover:bg-purple-100 p-3 rounded-lg transition-colors group">
                                                  <div className="flex items-center gap-3">
                                                    <FileIcon className="w-5 h-5 text-purple-600" />
                                                    <div className="text-left">
                                                      <p className="text-sm font-medium text-gray-800 group-hover:text-purple-700">
                                                        {file.name}
                                                      </p>
                                                      <p className="text-xs text-gray-500">
                                                        {file.size}
                                                      </p>
                                                    </div>
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    <ExternalLinkIcon className="w-4 h-4 text-purple-600" />
                                                    <span className="text-xs text-purple-600 font-medium">
                                                      Open
                                                    </span>
                                                  </div>
                                                </button>)}
                                            </div>}
                                        </div>}
                                      <div className="flex flex-wrap gap-2 mt-4">
                                        {item.year && <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                            {item.year}
                                          </span>}
                                        {item.status && <span className={`px-3 py-1 ${item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'} rounded-full text-sm font-medium`}>
                                            {item.status}
                                          </span>}
                                      </div>
                                    </div>)}
                                </div>
                              </div>}
                            {/* Reports Section */}
                            {goalReports.length > 0 && <div>
                                <h3 className={`text-2xl font-bold ${goal.textColor} mb-4 flex items-center gap-2`}>
                                  <FileBarChartIcon className="w-6 h-6" />
                                  SDG Reports
                                </h3>
                                <div className="grid grid-cols-1 gap-6">
                                  {goalReports.map(item => <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                      {item.coverImage && <div className="relative h-64">
                                          <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        </div>}
                                      <div className="p-6">
                                        <h4 className={`text-2xl font-bold ${goal.textColor} mb-3`}>
                                          {item.title}
                                        </h4>
                                        <p className="text-gray-600 mb-4">
                                          {item.executiveSummary}
                                        </p>
                                        {item.files && item.files.length > 0 && <div className="mb-4">
                                              <button onClick={() => setExpandedReports(prev => ({
                              ...prev,
                              [item.id]: !prev[item.id]
                            }))} className={`flex items-center gap-2 text-sm font-semibold ${goal.textColor} mb-3 hover:underline`}>
                                                <DownloadIcon className="w-4 h-4" />
                                                Download Report Files (
                                                {item.files.length})
                                              </button>
                                              {expandedReports[item.id] && <div className="space-y-2">
                                                  {item.files.map((file, idx) => <button key={idx} onClick={() => handleFileClick(file.url)} className="w-full flex items-center justify-between bg-green-50 hover:bg-green-100 p-3 rounded-lg transition-colors group">
                                                        <div className="flex items-center gap-3">
                                                          <FileIcon className="w-5 h-5 text-green-600" />
                                                          <div className="text-left">
                                                            <p className="text-sm font-medium text-gray-800 group-hover:text-green-700">
                                                              {file.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                              {file.size}
                                                            </p>
                                                          </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                          <DownloadIcon className="w-4 h-4 text-green-600" />
                                                          <span className="text-xs text-green-600 font-medium">
                                                            Download
                                                          </span>
                                                        </div>
                                                      </button>)}
                                                </div>}
                                            </div>}
                                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                          {item.year}
                                        </span>
                                      </div>
                                    </div>)}
                                </div>
                              </div>}
                          </div> : <div className="text-center py-12">
                            <div className="text-6xl mb-4 opacity-30">
                              {goal.icon}
                            </div>
                            <p className="text-gray-500 text-lg">
                              No data recorded yet for this goal
                            </p>
                          </div>}
                      </div>
                    </motion.div>;
          })}
            </motion.div>}
        </AnimatePresence>
      </div>
      {/* Enhanced Footer with Call to Action */}
      <motion.div initial={{
      opacity: 0
    }} whileInView={{
      opacity: 1
    }} viewport={{
      once: true
    }} className="relative overflow-hidden bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 py-24">
        <div className="absolute inset-0 opacity-20">
          {[...Array(30)].map((_, i) => <motion.div key={i} className="absolute bg-white rounded-full" style={{
          width: Math.random() * 6 + 2 + 'px',
          height: Math.random() * 6 + 2 + 'px',
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%'
        }} animate={{
          y: [0, -30, 0],
          opacity: [0.3, 0.8, 0.3]
        }} transition={{
          duration: Math.random() * 3 + 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }} />)}
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
          <motion.div initial={{
          scale: 0
        }} whileInView={{
          scale: 1
        }} viewport={{
          once: true
        }} className="inline-block mb-8">
            <AwardIcon className="w-24 h-24 text-white" />
          </motion.div>
          <motion.h2 initial={{
          y: 30,
          opacity: 0
        }} whileInView={{
          y: 0,
          opacity: 1
        }} viewport={{
          once: true
        }} className="text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Together Towards 2030
          </motion.h2>
          <motion.p initial={{
          y: 30,
          opacity: 0
        }} whileInView={{
          y: 0,
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          delay: 0.1
        }} className="text-2xl text-white/90 max-w-4xl mx-auto mb-12">
            Join us in creating a sustainable future through innovation,
            research, and collaborative action
          </motion.p>
          <motion.div initial={{
          y: 30,
          opacity: 0
        }} whileInView={{
          y: 0,
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          delay: 0.2
        }} className="flex flex-wrap items-center justify-center gap-6">
            <motion.button whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} className="bg-white text-blue-600 px-12 py-5 rounded-full font-bold text-xl hover:shadow-2xl transition-all flex items-center gap-3">
              <GlobeIcon className="w-6 h-6" />
              Explore Partnerships
            </motion.button>
            <motion.button whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} className="bg-white/20 backdrop-blur-sm text-white px-12 py-5 rounded-full font-bold text-xl hover:bg-white/30 transition-all border-2 border-white/50 flex items-center gap-3">
              <UsersIcon className="w-6 h-6" />
              Join Our Community
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>;
}