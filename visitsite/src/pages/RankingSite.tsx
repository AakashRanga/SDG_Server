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
    description: 'GreenMetric World University Rankings'
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

const GreenMetricsArtwork = () => (
  <div className="relative w-28 h-24 sm:w-32 sm:h-28 lg:w-36 lg:h-30 flex items-center justify-center flex-shrink-0">
    <div className="absolute inset-0 bg-teal-400/25 rounded-full blur-2xl transform scale-90" />
    <svg viewBox="0 0 160 135" className="w-full h-full relative z-10" fill="none">
      <defs>
        <linearGradient id="gmBoxTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
        <linearGradient id="gmBoxLeft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#042f2e" />
        </linearGradient>
        <linearGradient id="gmGlow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#4ade80" />
        </linearGradient>
      </defs>
      {/* 3D Open Container */}
      <polygon points="80,72 138,48 80,24 22,48" fill="url(#gmBoxTop)" opacity="0.95" />
      <polygon points="22,48 80,72 80,116 22,92" fill="url(#gmBoxLeft)" />
      <polygon points="80,72 138,48 138,92 80,116" fill="#0d524d" />
      {/* Box Open Flaps */}
      <polygon points="22,48 6,38 60,16 80,24" fill="#5eead4" opacity="0.85" />
      <polygon points="138,48 154,38 100,16 80,24" fill="#2dd4bf" opacity="0.75" />
      {/* Glowing Eco Orb inside */}
      <circle cx="80" cy="42" r="21" fill="url(#gmGlow)" filter="drop-shadow(0 0 12px rgba(56,189,248,0.75))" />
      <path d="M72,36 C75,28 85,28 88,36 C88,43 76,51 76,51" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />
      <circle cx="80" cy="42" r="15" fill="#042f2e" opacity="0.35" />
      {/* Floating Green Leaves & Sparkles */}
      <path d="M58,22 C60,15 68,14 70,19 C70,25 62,27 58,22 Z" fill="#4ade80" />
      <circle cx="118" cy="26" r="3" fill="#ffffff" filter="drop-shadow(0 0 4px #38bdf8)" />
      <circle cx="42" cy="38" r="2" fill="#ffffff" />
      <circle cx="104" cy="62" r="2.5" fill="#5eead4" />
    </svg>
  </div>
);

const QSSustainabilityArtwork = () => (
  <div className="relative w-28 h-24 sm:w-32 sm:h-28 lg:w-36 lg:h-30 flex items-center justify-center flex-shrink-0">
    <div className="absolute inset-0 bg-emerald-400/25 rounded-full blur-2xl transform scale-90" />
    <svg viewBox="0 0 160 135" className="w-full h-full relative z-10" fill="none">
      <defs>
        <linearGradient id="qsGreen1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <linearGradient id="qsGreen2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#052e16" />
        </linearGradient>
        <linearGradient id="qsBlade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
      </defs>
      {/* 3D Sword / Pillar Blade */}
      <polygon points="80,10 92,38 80,108 68,38" fill="url(#qsBlade)" opacity="0.9" filter="drop-shadow(0 0 8px rgba(74,222,128,0.5))" />
      <polygon points="80,10 92,38 80,108" fill="#bbf7d0" opacity="0.6" />
      {/* Left 3D Block */}
      <polygon points="45,55 70,40 70,85 45,100" fill="url(#qsGreen2)" />
      <polygon points="45,55 70,40 55,30 30,45" fill="url(#qsGreen1)" />
      {/* Right 3D Block */}
      <polygon points="90,40 115,55 115,100 90,85" fill="#14532d" />
      <polygon points="90,40 115,55 130,45 105,30" fill="url(#qsGreen1)" />
      {/* Central 3D Diamond with QS Star */}
      <rect x="63" y="51" width="34" height="34" rx="8" fill="url(#qsGreen1)" transform="rotate(45 80 68)" stroke="#bbf7d0" strokeWidth="2" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.4))" />
      <text x="80" y="72" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900" fontFamily="sans-serif">
        QS
      </text>
      {/* Sparkles */}
      <circle cx="125" cy="22" r="3" fill="#ffffff" filter="drop-shadow(0 0 5px #4ade80)" />
      <circle cx="34" cy="34" r="2" fill="#86efac" />
    </svg>
  </div>
);

const THEImpactArtwork = () => (
  <div className="relative w-28 h-24 sm:w-32 sm:h-28 lg:w-36 lg:h-30 flex items-center justify-center flex-shrink-0">
    <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl transform scale-90" />
    <svg viewBox="0 0 160 135" className="w-full h-full relative z-10" fill="none">
      <defs>
        <linearGradient id="theBoxTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="theBoxFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="theGoldBadge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="theCyanBadge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      {/* Mystery / Impact Box Body */}
      <polygon points="90,38 140,53 90,68 40,53" fill="url(#theBoxTop)" stroke="#64748b" strokeWidth="1" />
      <polygon points="40,53 90,68 90,112 40,97" fill="url(#theBoxFront)" />
      <polygon points="90,68 140,53 140,97 90,112" fill="#0f172a" />
      {/* Box details */}
      <text x="65" y="83" fill="#94a3b8" fontSize="10" fontWeight="900" transform="skewY(16)" letterSpacing="1">
        IMPACT
      </text>
      <text x="65" y="96" fill="#cbd5e1" fontSize="9" fontWeight="900" transform="skewY(16)">
        BOX
      </text>
      {/* Floating Golden Coin */}
      <rect x="20" y="66" width="22" height="22" rx="5" fill="url(#theGoldBadge)" transform="rotate(-15 31 77)" stroke="#fef08a" strokeWidth="1.5" filter="drop-shadow(0 0 10px rgba(245,158,11,0.6))" />
      <path d="M28,79 L31,74 L34,79" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-15 31 77)" />
      {/* Floating Holographic Blue Chip */}
      <rect x="122" y="20" width="20" height="20" rx="5" fill="url(#theCyanBadge)" transform="rotate(18 132 30)" stroke="#bae6fd" strokeWidth="1.5" filter="drop-shadow(0 0 12px rgba(56,189,248,0.8))" />
      <path d="M129,33 L132,28 L135,33" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(18 132 30)" />
      {/* Sparkles */}
      <circle cx="145" cy="48" r="2.5" fill="#ffffff" filter="drop-shadow(0 0 4px #38bdf8)" />
      <circle cx="34" cy="48" r="2" fill="#fde047" />
    </svg>
  </div>
);

const DEFAULT_BOXES: RankingBoxItem[] = [
  {
    ranking_slug: 'green-metrics',
    ranking_name: 'Green Metrics',
    tag_label: 'GREENMETRIC',
    box_title: 'GREEN\nMETRICS',
    description: 'Campus setting, energy, waste, water & eco-education',
    button_text: 'Explore',
    accent_color: '#10b981',
    is_active: true,
  },
  {
    ranking_slug: 'qs-sustainability',
    ranking_name: 'QS Sustainability',
    tag_label: 'QS RANKINGS',
    box_title: 'QS SUSTAIN\nABILITY',
    description: 'Environmental, social & governance impact metrics',
    button_text: 'Explore',
    accent_color: '#22c55e',
    is_active: true,
  },
  {
    ranking_slug: 'the-impact-rankings',
    ranking_name: 'THE Impact Rankings',
    tag_label: 'TIMES HIGHER EDUCATION',
    box_title: 'THE IMPACT\nRANKINGS',
    description: '17 UN Sustainable Development Goals survey & evidence',
    button_text: 'Explore',
    accent_color: '#38bdf8',
    is_active: true,
  }
];

const getBoxCardStyle = (slug: string) => {
  if (slug === 'green-metrics') {
    return {
      bg: 'bg-gradient-to-br from-[#0a2e33] via-[#082226] to-[#041518]',
      border: 'border-teal-500/30 hover:border-teal-400/80',
      shadow: 'hover:shadow-teal-900/30',
      tagColor: 'text-teal-300/80',
      descColor: 'text-teal-100/70',
      gridPattern: 'bg-[radial-gradient(#2dd4bf_1px,transparent_1px)]',
    };
  }
  if (slug === 'qs-sustainability') {
    return {
      bg: 'bg-gradient-to-br from-[#0b3818] via-[#082711] to-[#04160a]',
      border: 'border-emerald-500/30 hover:border-emerald-400/80',
      shadow: 'hover:shadow-emerald-900/30',
      tagColor: 'text-emerald-300/80',
      descColor: 'text-emerald-100/70',
      gridPattern: 'bg-[radial-gradient(#4ade80_1px,transparent_1px)]',
    };
  }
  if (slug === 'the-impact-rankings') {
    return {
      bg: 'bg-gradient-to-br from-[#162325] via-[#111c1e] to-[#0a1213]',
      border: 'border-slate-600/40 hover:border-amber-400/80',
      shadow: 'hover:shadow-slate-900/40',
      tagColor: 'text-cyan-300/80',
      descColor: 'text-slate-200/70',
      gridPattern: 'bg-[radial-gradient(#38bdf8_1px,transparent_1px)]',
    };
  }
  return {
    bg: 'bg-gradient-to-br from-[#1e1b4b] via-[#0f172a] to-[#020617]',
    border: 'border-indigo-500/30 hover:border-indigo-400/80',
    shadow: 'hover:shadow-indigo-900/30',
    tagColor: 'text-indigo-300/80',
    descColor: 'text-indigo-100/70',
    gridPattern: 'bg-[radial-gradient(#818cf8_1px,transparent_1px)]',
  };
};

const renderBoxArtwork = (box: RankingBoxItem) => {
  if (box.ranking_slug === 'green-metrics') return <GreenMetricsArtwork />;
  if (box.ranking_slug === 'qs-sustainability') return <QSSustainabilityArtwork />;
  if (box.ranking_slug === 'the-impact-rankings') return <THEImpactArtwork />;
  return (
    <div className="relative w-28 h-24 sm:w-32 sm:h-28 lg:w-36 lg:h-30 flex items-center justify-center flex-shrink-0">
      <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl transform scale-90" />
      <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md">
        <span className="text-3xl sm:text-4xl drop-shadow-md">{box.icon || '🏆'}</span>
      </div>
    </div>
  );
};

export function RankingSite() {
  const navigate = useNavigate();
  const {
    rankingData,
    rankingBoxes,
    getRankingDataBySDG,
    viewFile
  } = useRankingData();
  const { sdgSlug } = useParams();
  const [selectedSDG, setSelectedSDG] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredSDG, setHoveredSDG] = useState<number | null>(null);

  const activeBoxes = (rankingBoxes && rankingBoxes.length > 0)
    ? rankingBoxes.filter(b => b.is_active !== false)
    : DEFAULT_BOXES;
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
          {/* Sustainability Frameworks FAQ - 3 Interactive Boxes (Above Explore by SDG Goal) */}
          <div className="mb-20">
            {/* Eyebrow / Section Title Header */}
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <SparklesIcon className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                Institutional Ranking FAQs & Evidence
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent ml-2" />
            </div>

            {/* Dynamic Ranking Boxes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeBoxes.map((box) => {
                const style = getBoxCardStyle(box.ranking_slug);
                return (
                  <motion.div
                    key={box.id || box.ranking_slug}
                    whileHover={{ y: -6, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => navigate(`/ranking-data/site/faq/${box.ranking_slug}`)}
                    className={`group relative rounded-3xl p-5 sm:p-6 overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl border transition-all ${style.bg} ${style.border} ${style.shadow}`}
                  >
                    {/* Background matrix texture */}
                    <div className={`absolute inset-0 opacity-15 [background-size:16px_16px] pointer-events-none ${style.gridPattern}`} />
                    {/* Subtle shine sweep */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

                    <div className="relative z-10 flex items-center justify-between gap-3 h-full">
                      <div className="flex flex-col justify-between h-full py-1 min-w-0 flex-1">
                        <div>
                          <span className={`text-[11px] font-black uppercase tracking-widest mb-1.5 block ${style.tagColor}`}>
                            {box.tag_label || 'RANKINGS'}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight leading-snug mb-2 drop-shadow-sm whitespace-pre-line break-words">
                            {box.box_title || box.ranking_name}
                          </h3>
                          <p className={`text-xs line-clamp-2 max-w-[185px] mb-4 ${style.descColor}`}>
                            {box.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-white/10 text-white border border-white/20 backdrop-blur-md group-hover:bg-white group-hover:text-gray-900 transition-all duration-300 w-fit shadow-xs"
                        >
                          <span>{box.button_text || 'Explore'}</span>
                          <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>

                      {renderBoxArtwork(box)}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

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