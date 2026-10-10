import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRankingData } from '../contexts/RankingDataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, TrophyIcon, TargetIcon, FileTextIcon, DownloadIcon, SearchIcon, StarIcon, AwardIcon, TrendingUpIcon, ChevronRightIcon, SparklesIcon, Medal, EyeIcon } from 'lucide-react';
const SDG_INFO = [{
  number: 1,
  title: 'No Poverty',
  color: 'from-red-500 to-red-700',
  solidColor: '#E5243B',
  imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-01.jpg'
}, {
  number: 2,
  title: 'Zero Hunger',
  color: 'from-yellow-500 to-yellow-700',
  solidColor: '#DDA63A',
  imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-02.jpg'
}, {
  number: 3,
  title: 'Good Health',
  color: 'from-green-500 to-green-700',
  solidColor: '#4C9F38',
  imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-03.jpg'
}, {
  number: 4,
  title: 'Quality Education',
  color: 'from-red-600 to-red-800',
  solidColor: '#C5192D',
  imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-04.jpg'
}, {
  number: 5,
  title: 'Gender Equality',
  color: 'from-orange-500 to-orange-700',
  solidColor: '#FF3A21',
  imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-05.jpg'
}, {
  number: 6,
  title: 'Clean Water',
  color: 'from-cyan-500 to-cyan-700',
  solidColor: '#26BDE2',
  imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-06.jpg'
}, {
  number: 7,
  title: 'Clean Energy',
  color: 'from-yellow-400 to-yellow-600',
  solidColor: '#FCC30B',
  imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-07.jpg'
}, {
  number: 8,
  title: 'Economic Growth',
  color: 'from-red-700 to-red-900',
  solidColor: '#A21942',
  imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-08.jpg'
}, {
  number: 9,
  title: 'Innovation',
  color: 'from-orange-600 to-orange-800',
  solidColor: '#FD6925',
  imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-09.jpg'
}, {
  number: 10,
  title: 'Reduced Inequalities',
  color: 'from-pink-500 to-pink-700',
  solidColor: '#DD1367',
  imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-10.jpg'
}, {
  number: 11,
  title: 'Sustainable Cities',
  color: 'from-amber-500 to-amber-700',
  solidColor: '#FD9D24',
  imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-11.jpg'
}, {
  number: 12,
  title: 'Responsible Consumption',
  color: 'from-yellow-600 to-yellow-800',
  solidColor: '#BF8B2E',
  imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-12.jpg'
}, {
  number: 13,
  title: 'Climate Action',
  color: 'from-green-600 to-green-800',
  solidColor: '#3F7E44',
  imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-13.jpg'
}, {
  number: 14,
  title: 'Life Below Water',
  color: 'from-blue-500 to-blue-700',
  solidColor: '#0A97D9',
  imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-14.jpg'
}, {
  number: 15,
  title: 'Life on Land',
  color: 'from-lime-500 to-lime-700',
  solidColor: '#56C02B',
  imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-15.jpg'
}, {
  number: 16,
  title: 'Peace & Justice',
  color: 'from-blue-700 to-blue-900',
  solidColor: '#00689D',
  imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-16.jpg'
}, {
  number: 17,
  title: 'Partnerships',
  color: 'from-indigo-600 to-indigo-800',
  solidColor: '#19486A',
  imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-17.jpg'
}];
const RANKING_INFO = {
  'THE Impact Rankings': {
    color: 'from-orange-500 to-red-600',
    icon: '🏆',
    description: 'Times Higher Education Impact Rankings'
  },
  'QS Sustainability': {
    color: 'from-green-500 to-emerald-600',
    icon: '🌱',
    description: 'QS World University Rankings: Sustainability'
  },
  'Green Metrics': {
    color: 'from-blue-500 to-cyan-600',
    icon: '🌍',
    description: 'UI GreenMetric World University Rankings'
  }
};
const AnimatedCounter = ({
  end,
  duration = 2
}: {
  end: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);
  return <span>{count}</span>;
};
export function RankingSite() {
  const navigate = useNavigate();
  const {
    rankingData,
    getRankingDataBySDG,
    viewFile
  } = useRankingData();
  const { sdgSlug } = useParams();
  const [selectedSDG, setSelectedSDG] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredSDG, setHoveredSDG] = useState<number | null>(null);
  // Use ranking data from context but only include visible items for the public site
  const filteredData = selectedSDG
    ? getRankingDataBySDG(selectedSDG)
      .filter(item => item.isVisible) // only show visible items
      .filter(item => {
        const matchesSearch = item.criteriaName.toLowerCase().includes(searchQuery.toLowerCase()) || item.question.toLowerCase().includes(searchQuery.toLowerCase()) || item.fileName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
      })
    : [];
  const currentSDG = SDG_INFO.find(sdg => sdg.number === selectedSDG);
  const groupedByRanking = filteredData.reduce((acc, item) => {
    if (!acc[item.rankingName]) {
      acc[item.rankingName] = [];
    }
    acc[item.rankingName].push(item);
    return acc;
  }, {} as Record<string, typeof filteredData>);
  const slugify = (title: string) => title.toLowerCase().replace(/[^a-z0-9]/g, '');

  // when route param changes, pick the matching SDG
  useEffect(() => {
    // If no slug provided, clear selected SDG to show the SDG grid
    if (!sdgSlug) {
      setSelectedSDG(null);
      return;
    }
    const match = SDG_INFO.find(s => slugify(s.title) === sdgSlug);
    if (match) setSelectedSDG(match.number); else setSelectedSDG(null);
  }, [sdgSlug]);

  // Public site uses context data; no direct API fetch needed here.

  return <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
    {/* Hero Section - Sustainability Commitment */}
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 min-h-[60vh] flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0]
        }} transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }} />
        <motion.div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, -30, 0]
        }} transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut'
        }} />
        {/* Floating Icons */}
        {[...Array(6)].map((_, i) => <motion.div key={i} className="absolute" style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`
        }} animate={{
          y: [0, -30, 0],
          rotate: [0, 360],
          opacity: [0.2, 0.5, 0.2]
        }} transition={{
          duration: 5 + i,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: i * 0.5
        }}>
          <TargetIcon className="w-12 h-12 text-white/20" />
        </motion.div>)}
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="absolute top-0 left-6">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white hover:text-white/80 transition-colors bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Home
          </button>
        </div>
        <div className="text-center">
          <motion.div initial={{
            scale: 0,
            opacity: 0
          }} animate={{
            scale: 1,
            opacity: 1
          }} transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            delay: 0.2
          }} className="inline-block mb-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-8 shadow-2xl border-2 border-white/30">
              <TargetIcon className="w-20 h-20 text-white" />
            </div>
          </motion.div>
          <motion.h1 initial={{
            y: 50,
            opacity: 0
          }} animate={{
            y: 0,
            opacity: 1
          }} transition={{
            delay: 0.4,
            duration: 0.8
          }} className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Sustainable Development Goals
            <br />
            <span className="text-6xl md:text-7xl">
              Documentation & Achievements
            </span>
          </motion.h1>
          <motion.p initial={{
            y: 50,
            opacity: 0
          }} animate={{
            y: 0,
            opacity: 1
          }} transition={{
            delay: 0.6,
            duration: 0.8
          }} className="text-xl text-white/90 max-w-3xl mx-auto drop-shadow-md">
            Committed to advancing sustainability through measurable impact
            across all UN Sustainable Development Goals
          </motion.p>
        </div>
      </div>
    </div>
    {/* SDG Selection or Detail View */}
    <section className="py-24 px-6 bg-gradient-to-b from-white to-amber-50">
      <div className="max-w-7xl mx-auto">
        {!selectedSDG ? <div>
          <motion.div initial={{
            opacity: 0,
            y: 50
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.8
          }} className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Explore by SDG Goal
            </h2>
            <p className="text-xl text-gray-600">
              Select a goal to view our ranking documentation and
              achievements
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {SDG_INFO.map((sdg, index) => {
              // Count only visible ranking items so badge matches what clicking the SDG shows
              const count = getRankingDataBySDG(sdg.number).filter(item => item.isVisible).length;
              const isHovered = hoveredSDG === sdg.number;
              const sdgSlugLocal = slugify(sdg.title);
              return <motion.button key={sdg.number} initial={{
                opacity: 0,
                y: 30
              }} whileInView={{
                opacity: 1,
                y: 0
              }} viewport={{
                once: true
              }} transition={{
                delay: index * 0.03,
                duration: 0.5,
                ease: [0.25, 0.4, 0.25, 1]
              }} whileHover={{
                y: -12,
                transition: {
                  duration: 0.3,
                  ease: [0.25, 0.4, 0.25, 1]
                }
              }} whileTap={{
                scale: 0.98
              }} onClick={() => navigate(`/ranking-data/site/${sdgSlugLocal}`)} onMouseEnter={() => setHoveredSDG(sdg.number)} onMouseLeave={() => setHoveredSDG(null)} className={`relative rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden aspect-square group ${count === 0 ? 'opacity-50' : ''}`}>
                {/* Background gradient overlay on hover */}
                <motion.div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-300" style={{
                  background: `linear-gradient(135deg, ${sdg.solidColor}40, ${sdg.solidColor}80)`
                }} />
                {/* SDG Logo Image */}
                <motion.img src={sdg.imageUrl} alt={`SDG ${sdg.number}: ${sdg.title}`} className="w-full h-full object-cover" initial={{
                  scale: 1
                }} whileHover={{
                  scale: 1.05,
                  transition: {
                    duration: 0.4,
                    ease: [0.25, 0.4, 0.25, 1]
                  }
                }} />
                {/* Shine effect on hover */}
                <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0" animate={isHovered ? {
                  opacity: [0, 0.3, 0],
                  x: ['-100%', '100%']
                } : {}} transition={{
                  duration: 0.8,
                  ease: 'easeInOut'
                }} />
                {/* Document count badge */}
                {count > 0 && <motion.div initial={{
                  scale: 0,
                  rotate: -180
                }} animate={{
                  scale: 1,
                  rotate: 0
                }} transition={{
                  delay: index * 0.03 + 0.3,
                  type: 'spring',
                  stiffness: 200,
                  damping: 15
                }} whileHover={{
                  scale: 1.1,
                  rotate: [0, -10, 10, 0],
                  transition: {
                    duration: 0.5
                  }
                }} className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-sm font-bold shadow-lg z-10 border-4 border-white">
                  {count}
                </motion.div>}
                {/* Glow effect for active items */}
                {count > 0 && <motion.div className="absolute inset-0 rounded-2xl" style={{
                  boxShadow: `0 0 0 0 ${sdg.solidColor}40`
                }} animate={isHovered ? {
                  boxShadow: [`0 0 0 0 ${sdg.solidColor}40`, `0 0 0 8px ${sdg.solidColor}00`]
                } : {}} transition={{
                  duration: 0.6,
                  ease: 'easeOut'
                }} />}
              </motion.button>;
            })}
          </div>
        </div> : <div>
          {/* Back Button and Search */}
          <div className="flex items-center justify-between mb-8">
            <motion.button onClick={() => {
              navigate('/ranking-data/site');
              setSearchQuery('');
            }} whileHover={{
              scale: 1.05,
              x: -5
            }} whileTap={{
              scale: 0.95
            }} className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all">
              <ArrowLeftIcon className="w-5 h-5" />
              Back to SDG Goals
            </motion.button>
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search documents..." className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 w-80 transition-all" />
            </div>
          </div>
          {/* Selected SDG Header */}
          <motion.div initial={{
            opacity: 0,
            y: 50
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }} className={`bg-gradient-to-r ${currentSDG?.color} rounded-3xl shadow-2xl p-12 mb-12 relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10">
                {currentSDG?.imageUrl && <img src={currentSDG.imageUrl} alt={currentSDG.title} className="w-48 h-48 object-cover opacity-30" />}
              </div>
            </div>
            <div className="relative flex items-center gap-8">
              <motion.div  className="w-36 h-36">
                {currentSDG?.imageUrl && <img src={currentSDG.imageUrl} alt={currentSDG.title} className="w-full h-full object-contain" />}
              </motion.div>
              <div className="flex-1">
                <div className="bg-white/20 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center mb-4">
                  <span className="text-1xl font-bold text-white">
                  SDG  {currentSDG?.number}
                  </span>
                </div>
                <h2 className="text-5xl font-bold text-white mb-4">
                  {currentSDG?.title}
                </h2>
                <div className="flex items-center gap-6">
                  <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                    <p className="text-white font-semibold text-lg">
                      {filteredData.length} document
                      {filteredData.length !== 1 ? 's' : ''} available
                    </p>
                  </div>
                  {/* <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full flex items-center gap-2">
                    <StarIcon className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                    <p className="text-white font-semibold text-lg">
                      #1 Ranked
                    </p>
                  </div> */}
                </div>
              </div>
            </div>
          </motion.div>
          {/* Documents Grouped by Ranking */}
          {filteredData.length === 0 ? <motion.div initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} className="bg-white rounded-2xl shadow-xl p-16 text-center">
            <FileTextIcon className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <p className="text-xl text-gray-500">
              No documents found for this SDG
            </p>
          </motion.div> : <div className="space-y-12">
            {Object.entries(groupedByRanking).map(([rankingName, items], groupIndex) => {
              const rankingInfo = RANKING_INFO[rankingName as keyof typeof RANKING_INFO];
              return <motion.div key={rankingName} initial={{
                opacity: 0,
                y: 50
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: groupIndex * 0.2,
                duration: 0.6
              }}>
                {/* Ranking Header */}
                <div className={`bg-gradient-to-r ${rankingInfo.color} rounded-2xl shadow-xl p-8 mb-6`}>
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{rankingInfo.icon}</div>
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-2">
                        {rankingName}
                      </h3>
                      <p className="text-white/90 text-lg">
                        {items.length} document
                        {items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Documents Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {items.map((item, index) => <motion.div key={item.id} initial={{
                    opacity: 0,
                    x: index % 2 === 0 ? -50 : 50
                  }} animate={{
                    opacity: 1,
                    x: 0
                  }} transition={{
                    delay: index * 0.1,
                    duration: 0.5
                  }} whileHover={{
                    y: -5,
                    scale: 1.02
                  }} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border-2 border-gray-100 hover:border-amber-200">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                            {item.criteriaName}
                          </span>
                          <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                            {item.year}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                          {item.question}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <FileTextIcon className="w-4 h-4" />
                            <span className="font-medium">
                              {item.fileName}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                          <span>{item.fileSize}</span>
                          <span>•</span>
                          <span>Uploaded: {item.uploadDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4">
					

                      <motion.button onClick={() => viewFile(item.fileUrl || `/uploads/ranking-data/${item.fileName}`)} whileHover={{
                        scale: 1.05
                      }} whileTap={{
                        scale: 0.95
                      }} className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2 shadow-lg">
                        <EyeIcon className="w-5 h-5" />
                        View Document
                      </motion.button>
                    </div>
                  </motion.div>)}
                </div>
              </motion.div>;
            })}
          </div>}
        </div>}
      </div>
    </section>
  </div>;
}