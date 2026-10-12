import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRankingData } from '../contexts/RankingDataContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  ExternalLinkIcon,
  FileTextIcon,
  CheckCircle2Icon,
  SearchIcon,
  ChevronDownIcon,
  SendIcon,
  XIcon,
  Building2Icon,
  CalendarIcon
} from 'lucide-react';

export const SDG_INFO = [
  {
    number: 1,
    title: 'No Poverty',
    label: 'No Poverty (SDG 1)',
    color: 'from-red-500 to-red-700',
    solidColor: '#E5243B',
    imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-01.jpg'
  },
  {
    number: 2,
    title: 'Zero Hunger',
    label: 'Zero Hunger (SDG 2)',
    color: 'from-yellow-500 to-yellow-700',
    solidColor: '#DDA63A',
    imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-02.jpg'
  },
  {
    number: 3,
    title: 'Good Health and Well-Being',
    label: 'Good Health and Well-Being (SDG 3)',
    color: 'from-green-500 to-green-700',
    solidColor: '#4C9F38',
    imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-03.jpg'
  },
  {
    number: 4,
    title: 'Quality Education',
    label: 'Quality Education (SDG 4)',
    color: 'from-red-600 to-red-800',
    solidColor: '#C5192D',
    imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-04.jpg'
  },
  {
    number: 5,
    title: 'Gender Equality',
    label: 'Gender Equality (SDG 5)',
    color: 'from-orange-500 to-orange-700',
    solidColor: '#FF3A21',
    imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-05.jpg'
  },
  {
    number: 6,
    title: 'Clean Water and Sanitation',
    label: 'Clean water and sanitation (SDG 6)',
    color: 'from-cyan-500 to-cyan-700',
    solidColor: '#26BDE2',
    imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-06.jpg'
  },
  {
    number: 7,
    title: 'Affordable and Clean Energy',
    label: 'Affordable and Clean Energy (SDG 7)',
    color: 'from-yellow-400 to-yellow-600',
    solidColor: '#FCC30B',
    imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-07.jpg'
  },
  {
    number: 8,
    title: 'Decent Work and Economic Growth',
    label: 'Decent Work and Economic Growth (SDG 8)',
    color: 'from-red-700 to-red-900',
    solidColor: '#A21942',
    imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-08.jpg'
  },
  {
    number: 9,
    title: 'Industry, Innovation and Infrastructure',
    label: 'Industry, Innovation and Infrastructure (SDG 9)',
    color: 'from-orange-600 to-orange-800',
    solidColor: '#FD6925',
    imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-09.jpg'
  },
  {
    number: 10,
    title: 'Reduced Inequalities',
    label: 'Reduced Inequalities (SDG 10)',
    color: 'from-pink-500 to-pink-700',
    solidColor: '#DD1367',
    imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-10.jpg'
  },
  {
    number: 11,
    title: 'Sustainable Cities and Communities',
    label: 'Sustainable Cities and Communities (SDG 11)',
    color: 'from-amber-500 to-amber-700',
    solidColor: '#FD9D24',
    imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-11.jpg'
  },
  {
    number: 12,
    title: 'Responsible Consumption and Production',
    label: 'Responsible consumption and production (SDG 12)',
    color: 'from-yellow-600 to-yellow-800',
    solidColor: '#BF8B2E',
    imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-12.jpg'
  },
  {
    number: 13,
    title: 'Climate Action',
    label: 'Climate Action (SDG 13)',
    color: 'from-green-600 to-green-800',
    solidColor: '#3F7E44',
    imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-13.jpg'
  },
  {
    number: 14,
    title: 'Life Below Water',
    label: 'Life Below Water (SDG 14)',
    color: 'from-blue-500 to-blue-700',
    solidColor: '#0A97D9',
    imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-14.jpg'
  },
  {
    number: 15,
    title: 'Life on Land',
    label: 'Life on Land (SDG 15)',
    color: 'from-lime-500 to-lime-700',
    solidColor: '#56C02B',
    imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-15.jpg'
  },
  {
    number: 16,
    title: 'Peace, Justice and Strong Institutions',
    label: 'Peace,Justice and Strong Institutions (SDG 16)',
    color: 'from-blue-700 to-blue-900',
    solidColor: '#00689D',
    imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-16.jpg'
  },
  {
    number: 17,
    title: 'Partnerships for the Goals',
    label: 'Partnerships for the Goals (SDG 17)',
    color: 'from-indigo-600 to-indigo-800',
    solidColor: '#19486A',
    imageUrl: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-17.jpg'
  }
];

export interface RankingConfig {
  slug: string;
  name: string;
  shortName: string;
  eyebrow: string;
  badge: string;
  description: string;
  surveyName: string;
  gradient: string;
  headerBg: string;
  accentColor: string;
  icon: string;
}

export const RANKINGS_CONFIG: Record<string, RankingConfig> = {
  'green-metrics': {
    slug: 'green-metrics',
    name: 'Green Metrics',
    shortName: 'UI GreenMetric',
    eyebrow: 'WORLD UNIVERSITY RANKINGS',
    badge: 'UI GREENMETRIC 2026',
    description: 'UI GreenMetric World University Rankings measures university commitment to environmental sustainability across Setting & Infrastructure, Energy & Climate, Waste, Water, Transportation, and Education.',
    surveyName: 'UI GreenMetric Sustainability',
    gradient: 'from-teal-600 via-emerald-600 to-cyan-700',
    headerBg: '#0f766e',
    accentColor: '#10b981',
    icon: '🌍'
  },
  'qs-sustainability': {
    slug: 'qs-sustainability',
    name: 'QS Sustainability',
    shortName: 'QS Sustainability',
    eyebrow: 'QS WORLD UNIVERSITY RANKINGS',
    badge: 'QS SUSTAINABILITY 2026',
    description: 'QS World University Rankings: Sustainability assesses institutional performance across Environmental Impact, Social Impact, and Governance metrics driving tangible global change.',
    surveyName: 'QS Sustainability',
    gradient: 'from-emerald-600 via-green-600 to-teal-700',
    headerBg: '#15803d',
    accentColor: '#22c55e',
    icon: '🌱'
  },
  'the-impact-rankings': {
    slug: 'the-impact-rankings',
    name: 'THE Impact Rankings',
    shortName: 'THE Impact Rankings',
    eyebrow: 'TIMES HIGHER EDUCATION',
    badge: 'THE IMPACT SURVEY',
    description: 'Times Higher Education (THE) Impact Rankings evaluate university performance against the United Nations 17 Sustainable Development Goals across Research, Stewardship, Outreach, and Teaching.',
    surveyName: 'IMPACT',
    gradient: 'from-amber-600 via-orange-600 to-red-600',
    headerBg: '#b6862c', // Gold/bronze like the FIU reference screenshot!
    accentColor: '#f59e0b',
    icon: '🏆'
  }
};

export function RankingFAQReference() {
  const navigate = useNavigate();
  const { rankingSlug } = useParams<{ rankingSlug?: string }>();
  const { rankingData, viewFile, previewFile } = useRankingData();

  // Normalize selected ranking slug
  const activeSlug = useMemo(() => {
    if (rankingSlug && RANKINGS_CONFIG[rankingSlug]) {
      return rankingSlug;
    }
    // Default to the-impact-rankings or match if fuzzy
    if (rankingSlug?.includes('green')) return 'green-metrics';
    if (rankingSlug?.includes('qs')) return 'qs-sustainability';
    return 'the-impact-rankings';
  }, [rankingSlug]);

  const activeRanking = RANKINGS_CONFIG[activeSlug];

  // Filter state
  const [selectedSDG, setSelectedSDG] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitForm, setSubmitForm] = useState({
    sdgNumber: '1',
    evidenceLink: '',
    description: '',
    contributorEmail: '',
    submitted: false
  });

  // Extract all data for active ranking
  const rankingItems = useMemo(() => {
    return rankingData.filter(item => {
      if (!item.isVisible) return false;
      const rName = item.rankingName.toLowerCase();
      if (activeSlug === 'green-metrics') {
        return rName.includes('green') || rName.includes('ui');
      }
      if (activeSlug === 'qs-sustainability') {
        return rName.includes('qs');
      }
      if (activeSlug === 'the-impact-rankings') {
        return rName.includes('the') || rName.includes('impact');
      }
      return false;
    });
  }, [rankingData, activeSlug]);

  // Available years in dataset
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(rankingItems.map(item => item.year).filter(Boolean)));
    return years.sort().reverse();
  }, [rankingItems]);

  // Filtered rows for the FAQ table
  const displayedRows = useMemo(() => {
    return rankingItems.filter(item => {
      // SDG filter
      if (selectedSDG !== 'all' && item.sdgNumber !== selectedSDG) {
        return false;
      }
      // Year filter
      if (selectedYear !== 'all' && item.year !== selectedYear) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQuestion = item.question?.toLowerCase().includes(query);
        const matchesCriteria = item.criteriaName?.toLowerCase().includes(query);
        const matchesFile = item.fileName?.toLowerCase().includes(query);
        const matchesSDG = `sdg ${item.sdgNumber}`.includes(query) || `goal ${item.sdgNumber}`.includes(query);
        if (!matchesQuestion && !matchesCriteria && !matchesFile && !matchesSDG) {
          return false;
        }
      }
      return true;
    });
  }, [rankingItems, selectedSDG, selectedYear, searchQuery]);

  // Group multiple evidences for the same question if any
  const groupedQuestions = useMemo(() => {
    const map = new Map<string, typeof displayedRows>();
    displayedRows.forEach(item => {
      const key = `${item.sdgNumber}__${item.criteriaName}__${item.question}`;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(item);
    });
    return Array.from(map.entries()).map(([key, items]) => {
      const first = items[0];
      return {
        key,
        sdgNumber: first.sdgNumber,
        criteriaName: first.criteriaName,
        question: first.question,
        year: first.year,
        items
      };
    });
  }, [displayedRows]);

  // Count items per SDG for badges
  const countPerSDG = useMemo(() => {
    const counts: Record<number, number> = {};
    rankingItems.forEach(item => {
      counts[item.sdgNumber] = (counts[item.sdgNumber] || 0) + 1;
    });
    return counts;
  }, [rankingItems]);

  const handleEvidenceClick = (fileUrl: string, fileName: string) => {
    if (previewFile) {
      previewFile(fileName || fileUrl);
    } else {
      viewFile(fileUrl);
    }
  };

  const handleTabChange = (slug: string) => {
    navigate(`/ranking-data/site/faq/${slug}`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitForm(prev => ({ ...prev, submitted: true }));
    setTimeout(() => {
      setShowSubmitModal(false);
      setSubmitForm({
        sdgNumber: '1',
        evidenceLink: '',
        description: '',
        contributorEmail: '',
        submitted: false
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-white to-orange-50/30 text-gray-900 pb-24">
      {/* Top Banner / Navigation */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => navigate('/ranking-data/site')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-emerald-700 bg-gray-100 hover:bg-emerald-50 px-4 py-2 rounded-xl transition-all border border-gray-200 hover:border-emerald-200"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back to Ranking Overview</span>
          </button>

          {/* Ranking Switcher Pills */}
          <div className="flex items-center gap-2 bg-gray-100/90 p-1 rounded-2xl border border-gray-200">
            {Object.values(RANKINGS_CONFIG).map(config => {
              const isActive = config.slug === activeSlug;
              return (
                <button
                  key={config.slug}
                  onClick={() => handleTabChange(config.slug)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white text-gray-900 shadow-xs border border-gray-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                  }`}
                >
                  <span>{config.icon}</span>
                  <span>{config.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
            style={{ backgroundColor: activeRanking.accentColor }}
          />

          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <span
              className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-xs"
              style={{ backgroundColor: activeRanking.headerBg }}
            >
              {activeRanking.eyebrow}
            </span>

            <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1">
                <Building2Icon className="w-3.5 h-3.5 text-gray-400" />
                Institutional Data Repository
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                Annual Survey Audited
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            SUSTAINABLE DEVELOPMENT GOALS
          </h1>

          <div className="prose prose-amber max-w-4xl text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
            <p>
              The United Nations' 17 <strong className="text-gray-900">Sustainable Development Goals (SDGs)</strong> are a call for action by all countries - developed and developing - in a global partnership. They are intended to provide a shared blueprint for peace and prosperity for people and the planet, now and into the future. Use the filter to see the evidence provided to <strong className="text-gray-900">{activeRanking.name}</strong> for the SDG's on their <strong className="text-gray-900">{activeRanking.surveyName}</strong> survey.
            </p>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              If you would like to submit a link containing evidence supporting an SDG please{' '}
              <button
                onClick={() => setShowSubmitModal(true)}
                className="font-bold underline hover:text-amber-700 cursor-pointer inline-flex items-center gap-1 text-amber-600 transition-colors"
              >
                click here
              </button>
              . Submitted data will be reviewed by the Sustainability & Rankings Office for next year's submission.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
            <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-100/60">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Total Questions
              </div>
              <div className="text-2xl sm:text-3xl font-black text-gray-900">
                {rankingItems.length}
              </div>
            </div>

            <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-100/60">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                SDGs Covered
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-800">
                {Object.keys(countPerSDG).length} / 17
              </div>
            </div>

            <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-100/60">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Verified Evidences
              </div>
              <div className="text-2xl sm:text-3xl font-black text-blue-900">
                {rankingItems.filter(i => i.fileName).length}
              </div>
            </div>

            <div className="bg-orange-50/60 rounded-2xl p-4 border border-orange-100/60">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Active Year(s)
              </div>
              <div className="text-xl sm:text-2xl font-black text-orange-900">
                {availableYears.join(', ') || '2026'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8 space-y-6">
          {/* Top Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
            {/* The Dropdown filter exactly matching reference website */}
            <div className="md:col-span-5 space-y-2">
              <label htmlFor="sdg-dropdown-filter" className="block text-sm font-bold text-gray-900">
                Sustainable Development Goals:
              </label>
              <div className="relative">
                <select
                  id="sdg-dropdown-filter"
                  value={selectedSDG}
                  onChange={e => {
                    const val = e.target.value;
                    setSelectedSDG(val === 'all' ? 'all' : Number(val));
                  }}
                  className="w-full appearance-none bg-white border-2 border-gray-300 hover:border-amber-500 focus:border-amber-600 focus:ring-4 focus:ring-amber-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 transition-all pr-10 cursor-pointer shadow-xs"
                >
                  <option value="all">All Sustainable Development Goals (SDGs 1-17)</option>
                  {SDG_INFO.map(sdg => {
                    const count = countPerSDG[sdg.number] || 0;
                    return (
                      <option key={sdg.number} value={sdg.number}>
                        {sdg.label} {count > 0 ? `(${count} records)` : ''}
                      </option>
                    );
                  })}
                </select>
                <ChevronDownIcon className="w-5 h-5 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Keyword Search */}
            <div className="md:col-span-4 space-y-2">
              <label className="block text-sm font-bold text-gray-900">
                Search Questions or Criteria:
              </label>
              <div className="relative">
                <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. anti-poverty, energy, waste, 1.3..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-white border-2 border-gray-300 hover:border-amber-500 focus:border-amber-600 focus:ring-4 focus:ring-amber-100 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-gray-900 transition-all shadow-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs bg-gray-100 hover:bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Year Selector */}
            <div className="md:col-span-3 space-y-2">
              <label className="block text-sm font-bold text-gray-900">
                Reporting Year:
              </label>
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
                className="w-full appearance-none bg-white border-2 border-gray-300 hover:border-amber-500 focus:border-amber-600 focus:ring-4 focus:ring-amber-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 transition-all cursor-pointer shadow-xs"
              >
                <option value="all">All Reporting Years</option>
                {availableYears.map(yr => (
                  <option key={yr} value={yr}>
                    Year {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick SDG Thumbnails / Pills strip */}
          <div className="pt-4 border-t border-gray-100">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Quick Select Goal:</span>
              {selectedSDG !== 'all' && (
                <button
                  onClick={() => setSelectedSDG('all')}
                  className="text-amber-600 hover:text-amber-800 text-xs font-semibold underline"
                >
                  Show All 17 Goals
                </button>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              <button
                onClick={() => setSelectedSDG('all')}
                className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  selectedSDG === 'all'
                    ? 'bg-gray-900 text-white border-gray-900 shadow-xs'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                }`}
              >
                All SDGs ({rankingItems.length})
              </button>
              {SDG_INFO.map(sdg => {
                const isSelected = selectedSDG === sdg.number;
                const count = countPerSDG[sdg.number] || 0;
                return (
                  <button
                    key={sdg.number}
                    onClick={() => setSelectedSDG(sdg.number)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'text-white shadow-md border-transparent scale-105'
                        : 'bg-white text-gray-800 hover:bg-gray-50 border-gray-200'
                    } ${count === 0 ? 'opacity-40' : ''}`}
                    style={{
                      backgroundColor: isSelected ? sdg.solidColor : undefined
                    }}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: sdg.solidColor }}
                    />
                    <span>SDG {sdg.number}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* The Evidence Table Section - Matches FIU UI theme */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Table Header Banner - Gold/Bronze like FIU or theme matching */}
          <div
            className="px-6 py-4.5 flex flex-wrap items-center justify-between gap-4 text-white shadow-xs"
            style={{ backgroundColor: activeRanking.headerBg }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{activeRanking.icon}</span>
              <div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                  {selectedSDG === 'all'
                    ? `All SDG Criteria & Survey Evidence`
                    : `SDG ${selectedSDG}: ${SDG_INFO.find(s => s.number === selectedSDG)?.title}`}
                </h2>
                <p className="text-xs text-white/85">
                  Showing {groupedQuestions.length} survey criteria question{groupedQuestions.length !== 1 ? 's' : ''} for {activeRanking.name}
                </p>
              </div>
            </div>

            {selectedSDG !== 'all' && (
              <span className="bg-white/20 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-bold text-white border border-white/30">
                SDG {selectedSDG} Selected
              </span>
            )}
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr
                  className="text-white text-xs sm:text-sm uppercase tracking-wider font-extrabold"
                  style={{ backgroundColor: activeRanking.headerBg }}
                >
                  <th className="py-3.5 px-6 border-r border-white/20 w-7/12">Question</th>
                  <th className="py-3.5 px-6 border-r border-white/20 text-center w-2/12">Answer</th>
                  <th className="py-3.5 px-6 text-center w-3/12">Evidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {groupedQuestions.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-16 px-6 text-center">
                      <div className="max-w-md mx-auto space-y-4">
                        <FileTextIcon className="w-16 h-16 text-gray-300 mx-auto" />
                        <h3 className="text-lg font-bold text-gray-800">
                          No criteria records found
                        </h3>
                        <p className="text-sm text-gray-500">
                          {selectedSDG !== 'all'
                            ? `No survey questions or evidence files are currently recorded for SDG ${selectedSDG} under ${activeRanking.name}.`
                            : 'No records matched your search filters.'}
                        </p>
                        <button
                          onClick={() => {
                            setSelectedSDG('all');
                            setSearchQuery('');
                            setSelectedYear('all');
                          }}
                          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold transition-all shadow-xs"
                        >
                          Clear Filters & View All
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  groupedQuestions.map((group, index) => {
                    const isEven = index % 2 === 0;
                    const sdgMeta = SDG_INFO.find(s => s.number === group.sdgNumber);

                    return (
                      <tr
                        key={group.key}
                        className={`transition-colors hover:bg-amber-50/50 ${
                          isEven ? 'bg-white' : 'bg-gray-50/70'
                        }`}
                      >
                        {/* Question Column */}
                        <td className="py-5 px-6 align-top">
                          <div className="space-y-2">
                            {/* Criteria tag + SDG pill */}
                            <div className="flex flex-wrap items-center gap-2">
                              {sdgMeta && (
                                <span
                                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold text-white shadow-2xs"
                                  style={{ backgroundColor: sdgMeta.solidColor }}
                                >
                                  SDG {group.sdgNumber}
                                </span>
                              )}
                              {group.criteriaName && (
                                <span className="px-2.5 py-0.5 bg-amber-100/80 text-amber-900 border border-amber-200/60 rounded-md text-[11px] font-bold tracking-tight">
                                  {group.criteriaName}
                                </span>
                              )}
                              {group.year && (
                                <span className="px-2 py-0.5 bg-gray-200/70 text-gray-700 rounded-md text-[11px] font-semibold">
                                  Year {group.year}
                                </span>
                              )}
                            </div>

                            {/* Question text */}
                            <p className="text-gray-900 font-medium leading-relaxed text-sm sm:text-base">
                              {group.question}
                            </p>
                          </div>
                        </td>

                        {/* Answer Column */}
                        <td className="py-5 px-6 align-middle text-center">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
                            <CheckCircle2Icon className="w-3.5 h-3.5 text-emerald-600" />
                            Yes
                          </span>
                        </td>

                        {/* Evidence Column */}
                        <td className="py-5 px-6 align-middle text-center">
                          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2">
                            {group.items.map((item, linkIdx) => {
                              const label =
                                group.items.length > 1
                                  ? `[Link ${linkIdx + 1}]`
                                  : `[Link 1]`;

                              return (
                                <button
                                  key={item.id}
                                  onClick={() => handleEvidenceClick(item.fileUrl, item.fileName)}
                                  title={`${item.fileName} (${item.fileSize || 'PDF'})`}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-amber-700 hover:text-white bg-amber-50 hover:bg-amber-600 border border-amber-300 hover:border-amber-600 transition-all shadow-2xs group"
                                >
                                  <span>{label}</span>
                                  <ExternalLinkIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-wrap items-center justify-between text-xs text-gray-500 gap-3">
            <div>
              Showing {groupedQuestions.length} criteria questions across {activeRanking.name}
            </div>
            <div className="flex items-center gap-4">
              <span>Verified Institutional Submission</span>
              <span>•</span>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-amber-700 hover:underline font-semibold"
              >
                Back to Top ↑
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Evidence Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative"
            >
              <button
                onClick={() => setShowSubmitModal(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              >
                <XIcon className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl">
                  <SendIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Submit Evidence for SDGs
                  </h3>
                  <p className="text-xs text-gray-500">
                    Contribute institutional documentation for ranking review
                  </p>
                </div>
              </div>

              {submitForm.submitted ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2Icon className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-bold text-gray-900">
                    Thank You for Your Submission!
                  </h4>
                  <p className="text-sm text-gray-600">
                    Your evidence link has been submitted to the Sustainability & Ranking Office. It will be verified for next year's institutional submission.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Target SDG Goal:
                    </label>
                    <select
                      value={submitForm.sdgNumber}
                      onChange={e =>
                        setSubmitForm(prev => ({ ...prev, sdgNumber: e.target.value }))
                      }
                      className="w-full border-2 border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                    >
                      {SDG_INFO.map(s => (
                        <option key={s.number} value={s.number}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Evidence Link or Document URL:
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://your-university.edu/evidence.pdf"
                      value={submitForm.evidenceLink}
                      onChange={e =>
                        setSubmitForm(prev => ({ ...prev, evidenceLink: e.target.value }))
                      }
                      className="w-full border-2 border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Description / Relevance:
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Explain how this document supports the selected SDG criteria..."
                      value={submitForm.description}
                      onChange={e =>
                        setSubmitForm(prev => ({ ...prev, description: e.target.value }))
                      }
                      className="w-full border-2 border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Your Email (Optional):
                    </label>
                    <input
                      type="email"
                      placeholder="staff@university.edu"
                      value={submitForm.contributorEmail}
                      onChange={e =>
                        setSubmitForm(prev => ({
                          ...prev,
                          contributorEmail: e.target.value
                        }))
                      }
                      className="w-full border-2 border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowSubmitModal(false)}
                      className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl transition-all shadow-md"
                    >
                      Submit Evidence
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default RankingFAQReference;
