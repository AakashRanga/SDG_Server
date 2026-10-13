import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRankingData } from '../contexts/RankingDataContext';
import {
  ArrowLeftIcon,
  ExternalLinkIcon,
  FileTextIcon,
  CheckCircle2Icon,
  SearchIcon,
  ChevronDownIcon
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
    shortName: 'GreenMetric',
    eyebrow: 'WORLD UNIVERSITY RANKINGS',
    badge: 'GREENMETRIC 2026',
    description: 'GreenMetric World University Rankings measures university commitment to environmental sustainability across Setting & Infrastructure, Energy & Climate, Waste, Water, Transportation, and Education.',
    surveyName: 'GreenMetric Sustainability',
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
  const { rankingFAQs, rankingBoxes, sdgGoals, viewFile, previewFile } = useRankingData();

  // Active dynamic SDG Goals from database (with fallback to SDG_INFO)
  const activeSDGGoals = useMemo(() => {
    if (sdgGoals && sdgGoals.length > 0) {
      const activeOnly = sdgGoals.filter(g => g.is_active !== 0 && g.is_active !== false);
      return activeOnly.map(g => {
        const fallback = SDG_INFO.find(info => info.number === g.sdg_number);
        return {
          number: g.sdg_number,
          title: g.title,
          label: `${g.title} (SDG ${g.sdg_number})`,
          color: fallback?.color || 'from-teal-600 to-teal-800',
          solidColor: g.color || fallback?.solidColor || '#0f766e',
          imageUrl: fallback?.imageUrl || ''
        };
      });
    }
    return SDG_INFO;
  }, [sdgGoals]);

  // Normalize selected ranking slug
  const activeSlug = useMemo(() => {
    if (rankingSlug) {
      if (rankingBoxes.some(b => b.ranking_slug === rankingSlug)) {
        return rankingSlug;
      }
      if (RANKINGS_CONFIG[rankingSlug]) {
        return rankingSlug;
      }
      if (rankingSlug.includes('green')) return 'green-metrics';
      if (rankingSlug.includes('qs')) return 'qs-sustainability';
      if (rankingSlug.includes('the') || rankingSlug.includes('impact')) return 'the-impact-rankings';
      return rankingSlug;
    }
    return 'the-impact-rankings';
  }, [rankingSlug, rankingBoxes]);

  // Lookup custom box from database
  const activeBox = useMemo(() => {
    return rankingBoxes.find(b => b.ranking_slug === activeSlug);
  }, [rankingBoxes, activeSlug]);

  const currentConfig = useMemo(() => {
    const fallback = RANKINGS_CONFIG[activeSlug] || RANKINGS_CONFIG['the-impact-rankings'];
    return {
      slug: activeSlug,
      name: activeBox?.ranking_name || fallback?.name || activeSlug,
      shortName: activeBox?.ranking_name || fallback?.shortName || activeSlug,
      eyebrow: activeBox?.page_eyebrow || fallback?.eyebrow || 'WORLD UNIVERSITY RANKINGS',
      badge: activeBox?.tag_label || fallback?.badge || 'RANKINGS',
      pageTitle: activeBox?.page_title || 'SUSTAINABLE DEVELOPMENT GOALS',
      description: activeBox?.intro_description || fallback?.description,
      submissionNote: activeBox?.submission_note,
      surveyName: activeBox?.survey_name || fallback?.surveyName || 'Sustainability',
      headerBg: activeBox?.table_header_bg || fallback?.headerBg || '#b6862c',
      accentColor: activeBox?.accent_color || fallback?.accentColor || '#f59e0b',
      icon: activeBox?.icon || fallback?.icon || '🏆'
    };
  }, [activeBox, activeSlug]);

  const switcherTabs = useMemo(() => {
    if (rankingBoxes && rankingBoxes.length > 0) {
      return rankingBoxes.filter(b => b.is_active !== false).map(b => ({
        slug: b.ranking_slug,
        name: b.ranking_name,
        icon: b.icon || '🏆'
      }));
    }
    return Object.values(RANKINGS_CONFIG).map(c => ({
      slug: c.slug,
      name: c.name,
      icon: c.icon
    }));
  }, [rankingBoxes]);

  // Filter state
  const [selectedSDG, setSelectedSDG] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Always reset scroll to top so the page loads starting from the search section onwards
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [activeSlug]);

  // Extract all data for active ranking from dedicated ranking_faqs table
  const rankingItems = useMemo(() => {
    const list = rankingFAQs || [];
    return list.filter(item => {
      if (!item.isVisible) return false;
      if (item.rankingSlug && item.rankingSlug === activeSlug) {
        return true;
      }
      const rName = (item.rankingName || '').toLowerCase();
      if (activeSlug === 'green-metrics') {
        return rName.includes('green') || rName.includes('ui');
      }
      if (activeSlug === 'qs-sustainability') {
        return rName.includes('qs');
      }
      if (activeSlug === 'the-impact-rankings') {
        return rName.includes('the') || rName.includes('impact');
      }
      if (activeBox) {
        return rName.includes(activeBox.ranking_name.toLowerCase()) || activeBox.ranking_name.toLowerCase().includes(rName);
      }
      return false;
    });
  }, [rankingFAQs, activeSlug, activeBox]);

  // Available years in dataset
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(rankingItems.map(item => item.year).filter(Boolean)));
    return years.sort().reverse();
  }, [rankingItems]);

  // Filtered rows for the FAQ table
  const displayedRows = useMemo(() => {
    return rankingItems.filter(item => {
      if (selectedSDG !== 'all' && item.sdgNumber !== selectedSDG) {
        return false;
      }
      if (selectedYear !== 'all' && item.year !== selectedYear) {
        return false;
      }
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
        answer: first.answer || 'Yes',
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
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
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
            {switcherTabs.map(config => {
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

      {/* Main Filter Section - Directly Dropdown, Search, and Reporting Year */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-3">
        {/* Title */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-2xs"
              style={{ backgroundColor: currentConfig.headerBg }}
            >
              {currentConfig.eyebrow || 'WORLD UNIVERSITY RANKINGS'}
            </span>
            <span className="text-xs font-bold text-gray-500">
              • {currentConfig.name}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight uppercase">
            {currentConfig.pageTitle || 'SUSTAINABLE DEVELOPMENT GOALS'}
          </h1>
        </div>

        {/* Filter Controls Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 mb-2">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* 1. Sustainable Development Goals: Dropdown */}
            <div className="md:col-span-5 space-y-1.5">
              <label htmlFor="sdg-dropdown-filter" className="block text-xs sm:text-sm font-bold text-gray-800">
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
                  className="w-full appearance-none bg-white border-2 border-gray-300 hover:border-amber-500 focus:border-amber-600 focus:ring-4 focus:ring-amber-100 rounded-xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-gray-900 transition-all pr-10 cursor-pointer shadow-xs"
                >
                  <option value="all">All Sustainable Development Goals</option>
                  {activeSDGGoals.map(sdg => {
                    const count = countPerSDG[sdg.number] || 0;
                    return (
                      <option key={sdg.number} value={sdg.number}>
                        {sdg.label || `${sdg.title} (SDG ${sdg.number})`} {count > 0 ? `(${count} records)` : ''}
                      </option>
                    );
                  })}
                </select>
                <ChevronDownIcon className="w-5 h-5 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 2. Search Questions or Criteria */}
            <div className="md:col-span-4 space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold text-gray-800">
                Search Questions or Criteria:
              </label>
              <div className="relative">
                <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. anti-poverty, energy, waste, 1.3..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-white border-2 border-gray-300 hover:border-amber-500 focus:border-amber-600 focus:ring-4 focus:ring-amber-100 rounded-xl pl-10 pr-8 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-gray-900 transition-all shadow-xs"
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

            {/* 3. Reporting Year */}
            <div className="md:col-span-3 space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold text-gray-800">
                Reporting Year:
              </label>
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={e => setSelectedYear(e.target.value)}
                  className="w-full appearance-none bg-white border-2 border-gray-300 hover:border-amber-500 focus:border-amber-600 focus:ring-4 focus:ring-amber-100 rounded-xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-gray-900 transition-all pr-10 cursor-pointer shadow-xs"
                >
                  <option value="all">All Reporting Years</option>
                  {availableYears.map(yr => (
                    <option key={yr} value={yr}>
                      Year {yr}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="w-5 h-5 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
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
            style={{ backgroundColor: currentConfig.headerBg }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentConfig.icon}</span>
              <div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                  {selectedSDG === 'all'
                    ? `All SDG Criteria & Survey Evidence`
                    : `SDG ${selectedSDG}: ${activeSDGGoals.find(s => s.number === selectedSDG)?.title || SDG_INFO.find(s => s.number === selectedSDG)?.title || ''}`}
                </h2>
                <p className="text-xs text-white/85">
                  Showing {groupedQuestions.length} survey criteria question{groupedQuestions.length !== 1 ? 's' : ''} for {currentConfig.name}
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
                  style={{ backgroundColor: currentConfig.headerBg }}
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
                            ? `No survey questions or evidence files are currently recorded for SDG ${selectedSDG} under ${currentConfig.name}.`
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
                    const sdgMeta = activeSDGGoals.find(s => s.number === group.sdgNumber) || SDG_INFO.find(s => s.number === group.sdgNumber);
                    const isNo = (group.answer || '').trim().toLowerCase() === 'no';

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
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold border shadow-2xs ${
                            isNo
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          }`}>
                            <CheckCircle2Icon className={`w-3.5 h-3.5 ${isNo ? 'text-rose-500' : 'text-emerald-600'}`} />
                            {group.answer || 'Yes'}
                          </span>
                        </td>

                        {/* Evidence Column */}
                        <td className="py-5 px-6 align-middle text-center">
                          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2">
                            {(() => {
                              // Collect all links across group items (both multi-link array and legacy single fields)
                              const links: Array<{
                                id: string;
                                label: string;
                                url: string;
                                isUrl: boolean;
                                fileName?: string;
                                fileSize?: string;
                              }> = [];

                              group.items.forEach((item, itemIdx) => {
                                if (item.evidenceLinks && Array.isArray(item.evidenceLinks) && item.evidenceLinks.length > 0) {
                                  item.evidenceLinks.forEach((lnk, linkIdx) => {
                                    if (lnk.url || lnk.fileName) {
                                      const fallbackLabel = item.evidenceLinks!.length > 1
                                        ? `[Link ${linkIdx + 1}]`
                                        : (item.evidenceLabel || `[Link ${linkIdx + 1}]`);
                                      const label = (lnk.label && lnk.label.trim()) ? lnk.label.trim() : fallbackLabel;
                                      const isUrl = lnk.type === 'url' || (Boolean(lnk.url) && !lnk.url.startsWith('/uploads') && !lnk.fileName);
                                      links.push({
                                        id: `${item.id}-link-${linkIdx}`,
                                        label,
                                        url: lnk.url,
                                        isUrl,
                                        fileName: lnk.fileName,
                                        fileSize: item.fileSize
                                      });
                                    }
                                  });
                                } else {
                                  // Legacy single field fallback
                                  const fallbackLabel = group.items.length > 1 ? `[Link ${itemIdx + 1}]` : `[Link 1]`;
                                  const label = item.evidenceLabel?.trim() ? item.evidenceLabel : fallbackLabel;
                                  const isUrl = Boolean(item.externalUrl && item.externalUrl.trim());
                                  const url = isUrl ? item.externalUrl : item.fileUrl;
                                  if (url || item.fileName) {
                                    links.push({
                                      id: `${item.id}-legacy`,
                                      label,
                                      url: url || '',
                                      isUrl,
                                      fileName: item.fileName,
                                      fileSize: item.fileSize
                                    });
                                  }
                                }
                              });

                              if (links.length === 0) {
                                return (
                                  <span className="text-xs text-gray-400 italic">No evidence link</span>
                                );
                              }

                              return links.map(link => (
                                <button
                                  key={link.id}
                                  onClick={() => {
                                    if (link.isUrl && link.url) {
                                      window.open(link.url, '_blank', 'noopener,noreferrer');
                                    } else {
                                      handleEvidenceClick(link.url, link.fileName);
                                    }
                                  }}
                                  title={link.isUrl ? link.url : `${link.fileName || 'Evidence document'} (${link.fileSize || 'PDF'})`}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-amber-700 hover:text-white bg-amber-50 hover:bg-amber-600 border border-amber-300 hover:border-amber-600 transition-all shadow-2xs group"
                                >
                                  <span>{link.label}</span>
                                  <ExternalLinkIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              ));
                            })()}
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
              Showing {groupedQuestions.length} criteria questions across {currentConfig.name}
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

    </div>
  );
}
export default RankingFAQReference;
