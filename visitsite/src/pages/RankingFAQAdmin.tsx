import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRankingData, RankingBoxItem, RankingDataItem, EvidenceLinkItem, SDGGoalItem, DEFAULT_SDG_GOALS } from '../contexts/RankingDataContext';
import {
  ArrowLeftIcon,
  PlusIcon,
  Edit2Icon,
  Trash2Icon,
  EyeIcon,
  EyeOffIcon,
  SearchIcon,
  ExternalLinkIcon,
  CheckCircle2Icon,
  LayersIcon,
  HelpCircleIcon,
  SparklesIcon,
  FileTextIcon,
  LinkIcon,
  XIcon,
  SaveIcon,
  UploadCloudIcon,
  Maximize2Icon,
  Minimize2Icon,
  LogOutIcon,
  UserIcon,
  KeyRoundIcon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ChangePasswordModal } from '../components/ChangePasswordModal';

export function RankingFAQAdmin() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const {
    rankingBoxes,
    addRankingBox,
    updateRankingBox,
    deleteRankingBox,
    sdgGoals,
    addSDGGoal,
    updateSDGGoal,
    deleteSDGGoal,
    rankingFAQs,
    addRankingFAQ,
    editRankingFAQ,
    deleteRankingFAQ,
    viewFile
  } = useRankingData();

  const [activeTab, setActiveTab] = useState<'boxes' | 'faqs' | 'goals'>('faqs');

  // Box Modal State (clean schema without dropped columns)
  const [showBoxModal, setShowBoxModal] = useState(false);
  const [editingBox, setEditingBox] = useState<RankingBoxItem | null>(null);
  const [boxForm, setBoxForm] = useState<Partial<RankingBoxItem>>({
    ranking_slug: '',
    ranking_name: '',
    tag_label: '',
    box_title: '',
    description: '',
    button_text: 'Explore',
    page_title: 'SUSTAINABLE DEVELOPMENT GOALS',
    page_eyebrow: 'WORLD UNIVERSITY RANKINGS',
    table_header_bg: '#b6862c',
    accent_color: '#f59e0b',
    icon: '🏆',
    display_order: 1,
    is_active: 1
  });

  // SDG Goal Modal State (Dynamic Sustainable Development Goals list)
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SDGGoalItem | null>(null);
  const [goalForm, setGoalForm] = useState<Partial<SDGGoalItem>>({
    sdg_number: 1,
    title: '',
    color: '#0f766e',
    display_order: 1,
    is_active: 1
  });

  // FAQ Modal State (Full Screen with Multiple Links support)
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [editingFaq, setEditingFaq] = useState<RankingDataItem | null>(null);
  const [faqForm, setFaqForm] = useState({
    rankingName: 'THE Impact Rankings',
    rankingSlug: 'the-impact-rankings',
    sdgNumber: 1,
    criteriaName: '',
    question: '',
    answer: 'Yes',
    year: '2026',
    links: [
      { type: 'url' as 'url' | 'file', url: '', label: '[Link 1]', fileName: '', file: null as File | null }
    ]
  });

  // Filter States for FAQ list
  const [filterSlug, setFilterSlug] = useState<string>('all');
  const [filterSDG, setFilterSDG] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // SDG Goal handlers
  const handleOpenGoalModal = (goal?: SDGGoalItem) => {
    if (goal) {
      setEditingGoal(goal);
      setGoalForm({ ...goal });
    } else {
      setEditingGoal(null);
      const nextNum = (sdgGoals.length > 0 ? Math.max(...sdgGoals.map(g => g.sdg_number)) + 1 : 1);
      setGoalForm({
        sdg_number: nextNum,
        title: '',
        color: '#0f766e',
        display_order: nextNum,
        is_active: 1
      });
    }
    setShowGoalModal(true);
  };

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalForm.title?.trim()) {
      alert('Goal title is required.');
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingGoal && editingGoal.id) {
        await updateSDGGoal(editingGoal.id, goalForm);
      } else {
        await addSDGGoal(goalForm);
      }
      setShowGoalModal(false);
    } catch (err: any) {
      alert('Error saving SDG Goal: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGoal = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this SDG Goal?')) return;
    try {
      await deleteSDGGoal(id);
    } catch (err: any) {
      alert('Error deleting SDG Goal: ' + err.message);
    }
  };

  // Box handlers
  const handleOpenBoxModal = (box?: RankingBoxItem) => {
    if (box) {
      setEditingBox(box);
      setBoxForm({ ...box });
    } else {
      setEditingBox(null);
      setBoxForm({
        ranking_slug: '',
        ranking_name: '',
        tag_label: '',
        box_title: '',
        description: '',
        button_text: 'Explore',
        page_title: 'SUSTAINABLE DEVELOPMENT GOALS',
        page_eyebrow: 'WORLD UNIVERSITY RANKINGS',
        table_header_bg: '#b6862c',
        accent_color: '#f59e0b',
        icon: '🏆',
        display_order: (rankingBoxes.length || 0) + 1,
        is_active: 1
      });
    }
    setShowBoxModal(true);
  };

  const handleSaveBox = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingBox && editingBox.id) {
        await updateRankingBox(editingBox.id, boxForm);
      } else {
        await addRankingBox(boxForm);
      }
      setShowBoxModal(false);
    } catch (err: any) {
      alert('Error saving ranking box: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBox = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this ranking box?')) return;
    try {
      await deleteRankingBox(id);
    } catch (err: any) {
      alert('Error deleting box: ' + err.message);
    }
  };

  // FAQ handlers
  const handleOpenFaqModal = (item?: RankingDataItem) => {
    if (item) {
      setEditingFaq(item);
      const existingLinks = (item.evidenceLinks && item.evidenceLinks.length > 0)
        ? item.evidenceLinks.map((l, i) => ({
            type: l.type || 'url',
            url: l.url || '',
            label: l.label || `[Link ${i + 1}]`,
            fileName: l.fileName || '',
            file: null
          }))
        : [
            item.externalUrl
              ? { type: 'url' as const, url: item.externalUrl, label: item.evidenceLabel || '[Link 1]', fileName: '', file: null }
              : (item.fileUrl
                  ? { type: 'file' as const, url: item.fileUrl, label: item.evidenceLabel || '[Link 1]', fileName: item.fileName, file: null }
                  : { type: 'url' as const, url: '', label: '[Link 1]', fileName: '', file: null }
                )
          ];

      setFaqForm({
        rankingName: item.rankingName,
        rankingSlug: item.rankingSlug || 'the-impact-rankings',
        sdgNumber: item.sdgNumber,
        criteriaName: item.criteriaName,
        question: item.question,
        answer: item.answer || 'Yes',
        year: item.year || '2026',
        links: existingLinks
      });
    } else {
      setEditingFaq(null);
      setFaqForm({
        rankingName: rankingBoxes[0]?.ranking_name || 'THE Impact Rankings',
        rankingSlug: rankingBoxes[0]?.ranking_slug || 'the-impact-rankings',
        sdgNumber: 1,
        criteriaName: '',
        question: '',
        answer: 'Yes',
        year: '2026',
        links: [
          { type: 'url', url: '', label: '[Link 1]', fileName: '', file: null }
        ]
      });
    }
    setShowFaqModal(true);
  };

  // Multiple links state handlers
  const handleAddLink = () => {
    setFaqForm(prev => ({
      ...prev,
      links: [
        ...prev.links,
        {
          type: 'url',
          url: '',
          label: `[Link ${prev.links.length + 1}]`,
          fileName: '',
          file: null
        }
      ]
    }));
  };

  const handleRemoveLink = (index: number) => {
    if (faqForm.links.length <= 1) {
      alert('You must have at least one evidence link slot.');
      return;
    }
    setFaqForm(prev => ({
      ...prev,
      links: prev.links.filter((_, idx) => idx !== index)
    }));
  };

  const handleLinkChange = (index: number, field: string, value: any) => {
    setFaqForm(prev => {
      const updated = [...prev.links];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, links: updated };
    });
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that each link has either a url or file
    const validLinks = faqForm.links.filter(l => (l.type === 'url' && l.url?.trim()) || (l.type === 'file' && (l.file || l.url)));
    if (validLinks.length === 0) {
      alert('Please provide at least one evidence link URL or upload a file.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        rankingName: faqForm.rankingName,
        rankingSlug: faqForm.rankingSlug,
        sdgNumber: faqForm.sdgNumber,
        criteriaName: faqForm.criteriaName,
        question: faqForm.question,
        answer: faqForm.answer,
        year: faqForm.year,
        evidenceLinks: faqForm.links
      };

      if (editingFaq) {
        await editRankingFAQ(editingFaq.id, payload);
      } else {
        await addRankingFAQ(payload);
      }
      setShowFaqModal(false);
    } catch (err: any) {
      alert('Error saving FAQ item: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this FAQ criteria item?')) return;
    try {
      await deleteRankingFAQ(id);
    } catch (err: any) {
      alert('Error deleting FAQ item: ' + err.message);
    }
  };

  const handleToggleFaqVisibility = async (item: RankingDataItem) => {
    try {
      await editRankingFAQ(item.id, { isVisible: !item.isVisible });
    } catch (err: any) {
      alert('Error toggling visibility: ' + err.message);
    }
  };

  // Safe array references
  const safeRankingBoxes = Array.isArray(rankingBoxes) ? rankingBoxes : [];
  const safeSdgGoals = Array.isArray(sdgGoals) && sdgGoals.length > 0 ? sdgGoals : DEFAULT_SDG_GOALS;
  const safeRankingFAQs = Array.isArray(rankingFAQs) ? rankingFAQs : [];

  // Filtered FAQs
  const filteredFaqs = safeRankingFAQs.filter(item => {
    if (!item) return false;
    if (filterSlug !== 'all') {
      const rName = (item.rankingName || '').toLowerCase();
      const match = (item.rankingSlug === filterSlug) ||
        (filterSlug === 'green-metrics' && rName.includes('green')) ||
        (filterSlug === 'qs-sustainability' && rName.includes('qs')) ||
        (filterSlug === 'the-impact-rankings' && (rName.includes('the') || rName.includes('impact')));
      if (!match) return false;
    }
    if (filterSDG !== 'all' && item.sdgNumber !== filterSDG) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = (item.question || '').toLowerCase().includes(q) ||
        (item.criteriaName || '').toLowerCase().includes(q) ||
        (item.evidenceLabel || '').toLowerCase().includes(q) ||
        `sdg ${item.sdgNumber}`.includes(q);
      if (!matchText) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Banner Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-all"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </button>
            <div className="h-5 w-px bg-slate-200" />
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <span className="p-1 rounded-lg bg-teal-50 text-teal-600 border border-teal-200">
                  <HelpCircleIcon className="w-4 h-4" />
                </span>
                FAQ Management Portal
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <UserIcon className="w-3 h-3 text-slate-400" />
              <span>{user?.username || 'Admin'}</span>
            </div>
            <button
              onClick={() => setShowChangePassword(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-all cursor-pointer"
              title="Change Password"
            >
              <KeyRoundIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Change Password</span>
            </button>
            <button
              onClick={async () => {
                if (window.confirm('Are you sure you want to log out?')) {
                  await logout();
                  navigate('/login');
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all cursor-pointer"
              title="Logout"
            >
              <LogOutIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            <a
              href="http://localhost:8081/ranking-data/site"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-all"
            >
              <span>View Live Site</span>
              <ExternalLinkIcon className="w-3.5 h-3.5" />
            </a>

            {/* Tab Switcher */}
            <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setActiveTab('faqs')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'faqs'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <HelpCircleIcon className="w-3.5 h-3.5" />
                <span>Criteria FAQs ({safeRankingFAQs.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('boxes')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'boxes'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayersIcon className="w-3.5 h-3.5" />
                <span>Framework Boxes ({safeRankingBoxes.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('goals')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'goals'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <SparklesIcon className="w-3.5 h-3.5" />
                <span>SDG Goals ({safeSdgGoals.length})</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ======================================================== */}
        {/* TAB 1: CRITERIA FAQS & EVIDENCE LIST */}
        {/* ======================================================== */}
        {activeTab === 'faqs' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Survey Criteria, Questions & Multiple Evidence Links
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage individual questions, answers (Yes/No), and multiple online links or PDF documents per question.
                </p>
              </div>
              <button
                onClick={() => handleOpenFaqModal()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-all"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add FAQ Criterion (Full Screen)</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-3 text-xs shadow-xs">
              <div className="md:col-span-4 relative">
                <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search questions or criteria..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white text-xs font-medium"
                />
              </div>

              <div className="md:col-span-4">
                <select
                  value={filterSlug}
                  onChange={e => setFilterSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white font-medium"
                >
                  <option value="all">All Ranking Programs</option>
                  {safeRankingBoxes.map(b => (
                    <option key={b.id} value={b.ranking_slug}>
                      {b.ranking_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-4">
                <select
                  value={filterSDG}
                  onChange={e => setFilterSDG(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white font-medium"
                >
                  <option value="all">All SDG Goals ({safeSdgGoals.length})</option>
                  {safeSdgGoals.map(s => (
                    <option key={s.id || s.sdg_number} value={s.sdg_number}>
                      SDG {s.sdg_number} - {s.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* FAQ Table */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase border-b border-slate-200 tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4 w-1/12 text-center">SDG</th>
                      <th className="py-3.5 px-4 w-2/12">Ranking / Criteria</th>
                      <th className="py-3.5 px-4 w-4/12">Question</th>
                      <th className="py-3.5 px-4 w-1/12 text-center">Answer</th>
                      <th className="py-3.5 px-4 w-3/12 text-center">Evidence Links</th>
                      <th className="py-3.5 px-4 w-1/12 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredFaqs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500">
                          No FAQ criteria records found matching filters.
                        </td>
                      </tr>
                    ) : (
                      filteredFaqs.map(item => {
                        const sdgMeta = safeSdgGoals.find(s => s.sdg_number === item.sdgNumber) || DEFAULT_SDG_GOALS.find(s => s.sdg_number === item.sdgNumber);
                        const isNo = (item.answer || '').trim().toLowerCase() === 'no';
                        const links = (item.evidenceLinks && item.evidenceLinks.length > 0)
                          ? item.evidenceLinks
                          : (item.externalUrl
                              ? [{ type: 'url' as const, url: item.externalUrl, label: item.evidenceLabel || '[Link 1]' }]
                              : (item.fileUrl
                                  ? [{ type: 'file' as const, url: item.fileUrl, label: item.evidenceLabel || '[Link 1]', fileName: item.fileName }]
                                  : []
                                )
                            );

                        return (
                          <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                            {/* SDG Pill */}
                            <td className="py-3.5 px-4 text-center align-top">
                              <span
                                className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-extrabold text-white"
                                style={{ backgroundColor: sdgMeta?.color || '#334155' }}
                              >
                                SDG {item.sdgNumber}
                              </span>
                            </td>

                            {/* Ranking / Criteria */}
                            <td className="py-3.5 px-4 align-top">
                              <div className="font-bold text-slate-800">{item.rankingName}</div>
                              <div className="text-[11px] text-teal-700 font-medium">{item.criteriaName}</div>
                            </td>

                            {/* Question */}
                            <td className="py-3.5 px-4 align-top">
                              <p className="text-slate-800 font-medium leading-relaxed">
                                {item.question}
                              </p>
                            </td>

                            {/* Answer */}
                            <td className="py-3.5 px-4 text-center align-middle">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold ${
                                isNo ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                <CheckCircle2Icon className="w-3 h-3" />
                                {item.answer || 'Yes'}
                              </span>
                            </td>

                            {/* Multiple Evidence Links */}
                            <td className="py-3.5 px-4 text-center align-middle">
                              <div className="flex flex-wrap items-center justify-center gap-1.5">
                                {links.length === 0 ? (
                                  <span className="text-slate-400 italic">No links</span>
                                ) : (
                                  links.map((lnk, lIdx) => (
                                    lnk.type === 'url' ? (
                                      <a
                                        key={lIdx}
                                        href={lnk.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold border border-teal-200 transition-all text-[11px]"
                                        title={lnk.url}
                                      >
                                        <span>{lnk.label || `[Link ${lIdx + 1}]`}</span>
                                        <ExternalLinkIcon className="w-3 h-3" />
                                      </a>
                                    ) : (
                                      <button
                                        key={lIdx}
                                        onClick={() => viewFile(lnk.url)}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold border border-amber-200 transition-all text-[11px]"
                                        title={lnk.fileName || lnk.url}
                                      >
                                        <span>{lnk.label || `[Link ${lIdx + 1}]`}</span>
                                        <FileTextIcon className="w-3 h-3" />
                                      </button>
                                    )
                                  ))
                                )}
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right align-middle">
                              <div className="inline-flex items-center gap-1">
                                <button
                                  onClick={() => handleToggleFaqVisibility(item)}
                                  className={`p-1.5 rounded-lg transition-all ${
                                    item.isVisible ? 'text-teal-600 hover:bg-teal-50' : 'text-slate-400 hover:bg-slate-100'
                                  }`}
                                  title={item.isVisible ? 'Visible on site' : 'Hidden from site'}
                                >
                                  {item.isVisible ? <EyeIcon className="w-3.5 h-3.5" /> : <EyeOffIcon className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  onClick={() => handleOpenFaqModal(item)}
                                  className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                  title="Edit in Full Screen"
                                >
                                  <Edit2Icon className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteFaq(item.id)}
                                  className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                                  title="Delete"
                                >
                                  <Trash2Icon className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: FRAMEWORK BOXES & TEMPLATES */}
        {/* ======================================================== */}
        {activeTab === 'boxes' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Ranking Framework Section Boxes
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage the 3 visual interactive boxes rendered on the overview page and configure their interior reference detail templates.
                </p>
              </div>
              <button
                onClick={() => handleOpenBoxModal()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-all"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Framework Box</span>
              </button>
            </div>

            {/* Boxes Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {safeRankingBoxes.map((box) => (
                <div
                  key={box.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5"
                    style={{ backgroundColor: box.accent_color || '#10b981' }}
                  />

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase text-white"
                        style={{ backgroundColor: box.table_header_bg || '#0f766e' }}
                      >
                        {box.tag_label || 'RANKING'}
                      </span>
                      <span className="text-2xl">{box.icon || '🏆'}</span>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 whitespace-pre-line">
                      {box.box_title || box.ranking_name}
                    </h3>
                    <p className="text-xs text-slate-600 mb-4 line-clamp-3">
                      {box.description || 'No description set'}
                    </p>

                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-[11px] space-y-1.5 mb-4 text-slate-600">
                      <div><strong className="text-slate-800">Slug:</strong> <code className="text-teal-600 font-mono">/faq/{box.ranking_slug}</code></div>
                      <div><strong className="text-slate-800">Button:</strong> {box.button_text || 'Explore'}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-2">
                    <button
                      onClick={() => handleOpenBoxModal(box)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 transition-all"
                    >
                      <Edit2Icon className="w-3.5 h-3.5" />
                      <span>Edit Template</span>
                    </button>
                    <button
                      onClick={() => handleDeleteBox(box.id)}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-all"
                      title="Delete Box"
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: DYNAMIC SDG GOALS LIST */}
        {/* ======================================================== */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Dynamic Sustainable Development Goals List
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customize and manage the SDG numbers, titles, and theme colors used dynamically in dropdowns across public and admin pages.
                </p>
              </div>
              <button
                onClick={() => handleOpenGoalModal()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-all"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add New SDG Goal</span>
              </button>
            </div>

            {/* Goals Table */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase border-b border-slate-200 tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4 w-16 text-center">SDG #</th>
                      <th className="py-3.5 px-4">Goal Title</th>
                      <th className="py-3.5 px-4 w-36">Theme Color</th>
                      <th className="py-3.5 px-4 w-28 text-center">Display Order</th>
                      <th className="py-3.5 px-4 w-28 text-center">Status</th>
                      <th className="py-3.5 px-4 w-28 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {safeSdgGoals.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                          No SDG Goals recorded yet. Click &quot;Add New SDG Goal&quot; to create one.
                        </td>
                      </tr>
                    ) : (
                      safeSdgGoals.map(goal => (
                        <tr key={goal.id} className="hover:bg-slate-50 transition-colors">
                          {/* Goal Number Badge */}
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className="w-8 h-8 rounded-xl text-white font-black text-xs inline-flex items-center justify-center shadow-xs"
                              style={{ backgroundColor: goal.color || '#0f766e' }}
                            >
                              {goal.sdg_number}
                            </span>
                          </td>

                          {/* Goal Title */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 text-sm">
                              SDG {goal.sdg_number} - {goal.title}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              Dropdown label: &quot;{goal.title} (SDG {goal.sdg_number})&quot;
                            </div>
                          </td>

                          {/* Theme Color */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-5 h-5 rounded-lg border border-slate-200 shadow-2xs flex-shrink-0"
                                style={{ backgroundColor: goal.color || '#0f766e' }}
                              />
                              <span className="font-mono text-slate-600 text-[11px] font-semibold">
                                {goal.color}
                              </span>
                            </div>
                          </td>

                          {/* Display Order */}
                          <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                            {goal.display_order ?? goal.sdg_number}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                goal.is_active !== 0 && goal.is_active !== false
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {goal.is_active !== 0 && goal.is_active !== false ? 'Active' : 'Disabled'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenGoalModal(goal)}
                                className="p-1.5 text-teal-600 hover:text-teal-800 hover:bg-teal-50 rounded-lg transition-all"
                                title="Edit Goal"
                              >
                                <Edit2Icon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteGoal(goal.id)}
                                className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-all"
                                title="Delete Goal"
                              >
                                <Trash2Icon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* BOX EDIT MODAL */}
      {/* ======================================================== */}
      {showBoxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">
                {editingBox ? 'Edit Ranking Framework Box' : 'Create New Ranking Box'}
              </h3>
              <button onClick={() => setShowBoxModal(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-600">
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBox} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Ranking Name</label>
                  <input
                    type="text"
                    required
                    value={boxForm.ranking_name || ''}
                    onChange={e => setBoxForm({ ...boxForm, ranking_name: e.target.value })}
                    placeholder="e.g. THE Impact Rankings"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Slug Identifier</label>
                  <input
                    type="text"
                    required
                    value={boxForm.ranking_slug || ''}
                    onChange={e => setBoxForm({ ...boxForm, ranking_slug: e.target.value })}
                    placeholder="e.g. the-impact-rankings"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Top Badge Label</label>
                  <input
                    type="text"
                    value={boxForm.tag_label || ''}
                    onChange={e => setBoxForm({ ...boxForm, tag_label: e.target.value })}
                    placeholder="e.g. TIMES HIGHER EDUCATION"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Box Title (can use newlines)</label>
                  <input
                    type="text"
                    value={boxForm.box_title || ''}
                    onChange={e => setBoxForm({ ...boxForm, box_title: e.target.value })}
                    placeholder="e.g. THE IMPACT RANKINGS"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Card Summary Description</label>
                <textarea
                  rows={2}
                  value={boxForm.description || ''}
                  onChange={e => setBoxForm({ ...boxForm, description: e.target.value })}
                  placeholder="Summary text on 3-box overview card..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Table Header BG</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={boxForm.table_header_bg || '#0f766e'}
                      onChange={e => setBoxForm({ ...boxForm, table_header_bg: e.target.value })}
                      className="w-10 h-9 p-0.5 rounded-lg border border-slate-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={boxForm.table_header_bg || '#0f766e'}
                      onChange={e => setBoxForm({ ...boxForm, table_header_bg: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Accent Glow Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={boxForm.accent_color || '#10b981'}
                      onChange={e => setBoxForm({ ...boxForm, accent_color: e.target.value })}
                      className="w-10 h-9 p-0.5 rounded-lg border border-slate-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={boxForm.accent_color || '#10b981'}
                      onChange={e => setBoxForm({ ...boxForm, accent_color: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Icon / Emoji</label>
                  <input
                    type="text"
                    value={boxForm.icon || '🏆'}
                    onChange={e => setBoxForm({ ...boxForm, icon: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-center"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBoxModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  {isSubmitting ? 'Saving...' : 'Save Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FAQ FULL-SCREEN EDIT MODAL (Multiple Links Option) */}
      {/* ======================================================== */}
      {showFaqModal && (
        <div
          className={`fixed inset-0 z-50 flex transition-all duration-150 ${
            isFullScreen
              ? 'p-0 bg-white'
              : 'items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-sm'
          }`}
        >
          <div
            className={`bg-white w-full flex flex-col shadow-2xl overflow-hidden border border-slate-200 transition-all ${
              isFullScreen
                ? 'h-full rounded-none'
                : 'max-w-6xl h-[92vh] rounded-3xl'
            }`}
          >
            {/* Full Screen Header */}
            <div className="px-6 sm:px-8 py-4 sm:py-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 via-teal-50/30 to-white">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-teal-600 text-white shadow-xs">
                  <HelpCircleIcon className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                    <span>{editingFaq ? 'Edit FAQ Criteria & Evidence' : 'Add FAQ Criteria & Evidence'}</span>
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 uppercase tracking-wider">
                      {isFullScreen ? 'Full-Screen View' : 'Windowed View'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage survey questions, institutional responses, and attach single or multiple evidence links.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="p-2.5 rounded-2xl text-slate-500 hover:text-teal-700 hover:bg-slate-100 transition-all"
                  title={isFullScreen ? 'Switch to Windowed' : 'Switch to Full Screen'}
                >
                  {isFullScreen ? <Minimize2Icon className="w-5 h-5" /> : <Maximize2Icon className="w-5 h-5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setShowFaqModal(false)}
                  className="p-2.5 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                  title="Close Full Screen Editor"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Scrollable Form Body */}
            <form id="fullscreen-faq-form" onSubmit={handleSaveFaq} className="flex-1 overflow-y-auto px-6 sm:px-10 py-6 sm:py-8 space-y-8 bg-slate-50/50">
              
              {/* SECTION 1: QUESTION CLASSIFICATION */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  <span>Criterion Classification & Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-bold">
                  <div>
                    <label className="block text-slate-700 mb-1.5">Ranking Program</label>
                    <select
                      value={faqForm.rankingSlug}
                      onChange={e => {
                        const selected = rankingBoxes.find(b => b.ranking_slug === e.target.value);
                        setFaqForm({
                          ...faqForm,
                          rankingSlug: e.target.value,
                          rankingName: selected?.ranking_name || e.target.value
                        });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:bg-white focus:border-teal-500 transition-all"
                    >
                      {rankingBoxes.map(b => (
                        <option key={b.id} value={b.ranking_slug}>
                          {b.ranking_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1.5">SDG Goal (1 to 17)</label>
                    <select
                      value={faqForm.sdgNumber}
                      onChange={e => setFaqForm({ ...faqForm, sdgNumber: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:bg-white focus:border-teal-500 transition-all"
                    >
                      {safeSdgGoals.map(s => {
                        const num = s.sdg_number;
                        const title = s.title;
                        return (
                          <option key={num} value={num}>
                            SDG {num} - {title}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1.5">Criteria Code / Topic</label>
                    <input
                      type="text"
                      required
                      value={faqForm.criteriaName}
                      onChange={e => setFaqForm({ ...faqForm, criteriaName: e.target.value })}
                      placeholder="e.g. 1.2.1 Financial Aid Policy"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:bg-white focus:border-teal-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1.5">Criterion Answer</label>
                    <select
                      value={faqForm.answer}
                      onChange={e => setFaqForm({ ...faqForm, answer: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:bg-white focus:border-teal-500 transition-all"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Verified">Verified</option>
                      <option value="Submitted">Submitted</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1.5 text-xs font-bold">Survey Question Text</label>
                  <textarea
                    rows={3}
                    required
                    value={faqForm.question}
                    onChange={e => setFaqForm({ ...faqForm, question: e.target.value })}
                    placeholder="Enter the full institutional question or criteria text..."
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium focus:bg-white focus:border-teal-500 transition-all"
                  />
                </div>
              </div>

              {/* SECTION 2: MULTIPLE EVIDENCE LINKS (Dynamic Link Adding Option) */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider text-teal-600 flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>Multiple Evidence Links & Documentation</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Add multiple evidence links for this criterion. Each link will appear as an interactive button on the public site (e.g. [Link 1], [Link 2], [Policy Doc]).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddLink}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-all"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Another Evidence Link</span>
                  </button>
                </div>

                {/* List of Evidence Links */}
                <div className="space-y-4">
                  {faqForm.links.map((link, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-all space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-[11px] font-black flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-extrabold text-slate-800">
                            Evidence Link #{idx + 1}
                          </span>
                        </div>

                        {faqForm.links.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLink(idx)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                            title="Remove this link"
                          >
                            <Trash2Icon className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs font-semibold">
                        {/* Link Button Label */}
                        <div className="md:col-span-4">
                          <label className="block text-slate-600 mb-1">Button Display Label</label>
                          <input
                            type="text"
                            value={link.label}
                            onChange={e => handleLinkChange(idx, 'label', e.target.value)}
                            placeholder={`[Link ${idx + 1}] or [Policy Report]`}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                          />
                        </div>

                        {/* Evidence Source Type */}
                        <div className="md:col-span-3">
                          <label className="block text-slate-600 mb-1">Source Type</label>
                          <div className="flex items-center gap-3 py-2">
                            <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-700">
                              <input
                                type="radio"
                                name={`evidenceType_${idx}`}
                                checked={link.type === 'url'}
                                onChange={() => handleLinkChange(idx, 'type', 'url')}
                              />
                              <span>Web URL</span>
                            </label>
                            <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-700">
                              <input
                                type="radio"
                                name={`evidenceType_${idx}`}
                                checked={link.type === 'file'}
                                onChange={() => handleLinkChange(idx, 'type', 'file')}
                              />
                              <span>PDF File</span>
                            </label>
                          </div>
                        </div>

                        {/* URL Input or File Picker */}
                        <div className="md:col-span-5">
                          {link.type === 'url' ? (
                            <div>
                              <label className="block text-slate-600 mb-1">Website URL Destination</label>
                              <div className="relative">
                                <input
                                  type="url"
                                  value={link.url}
                                  onChange={e => handleLinkChange(idx, 'url', e.target.value)}
                                  placeholder="https://aim.fiu.edu/... or institutional URL"
                                  className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-200 bg-white font-mono text-[11px]"
                                />
                                {link.url && (
                                  <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600"
                                    title="Open link test"
                                  >
                                    <ExternalLinkIcon className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <label className="block text-slate-600 mb-1">PDF File Document</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="file"
                                  accept=".pdf,.doc,.docx"
                                  onChange={e => {
                                    const f = e.target.files?.[0] || null;
                                    handleLinkChange(idx, 'file', f);
                                    if (f) handleLinkChange(idx, 'fileName', f.name);
                                  }}
                                  className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                                />
                                {link.url && !link.file && (
                                  <button
                                    type="button"
                                    onClick={() => viewFile(link.url)}
                                    className="p-1.5 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 flex-shrink-0"
                                    title="View current PDF"
                                  >
                                    <FileTextIcon className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live Preview of Multiple Evidence Links */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <SparklesIcon className="w-3.5 h-3.5 text-amber-600" />
                      Live Button Preview in Visitor Table:
                    </span>
                    <p className="text-xs text-amber-800/80 mt-0.5">
                      How evidence links appear to visitors on the ranking reference page:
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {faqForm.links.map((lnk, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-800 bg-white border border-amber-300 shadow-2xs"
                      >
                        <span>{lnk.label?.trim() ? lnk.label : `[Link ${i + 1}]`}</span>
                        <ExternalLinkIcon className="w-3 h-3 text-amber-600" />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </form>

            {/* Full Screen Sticky Footer */}
            <div className="px-6 sm:px-10 py-4 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-slate-500 font-semibold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>{faqForm.links.length} Evidence Link{faqForm.links.length !== 1 ? 's' : ''} configured</span>
                <span>•</span>
                <span>Target: {faqForm.rankingName} (SDG {faqForm.sdgNumber})</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowFaqModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="fullscreen-faq-form"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  <SaveIcon className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving FAQ...' : (editingFaq ? 'Save Changes' : 'Create FAQ Criterion')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SDG GOAL EDIT MODAL */}
      {/* ======================================================== */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-full shadow-2xs" style={{ backgroundColor: goalForm.color || '#0f766e' }} />
                <h3 className="font-bold text-slate-900 text-sm">
                  {editingGoal ? `Edit SDG Goal #${goalForm.sdg_number}` : 'Add New SDG Goal'}
                </h3>
              </div>
              <button
                onClick={() => setShowGoalModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="p-6 space-y-4 text-xs font-medium">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-1">SDG Number *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={goalForm.sdg_number}
                    onChange={e => setGoalForm({ ...goalForm, sdg_number: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:bg-white focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={goalForm.display_order}
                    onChange={e => setGoalForm({ ...goalForm, display_order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:bg-white focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Goal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. No Poverty, Climate Action..."
                  value={goalForm.title}
                  onChange={e => setGoalForm({ ...goalForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:bg-white focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-1">Theme Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={goalForm.color || '#0f766e'}
                      onChange={e => setGoalForm({ ...goalForm, color: e.target.value })}
                      className="w-10 h-9 p-0.5 rounded-lg border border-slate-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={goalForm.color || '#0f766e'}
                      onChange={e => setGoalForm({ ...goalForm, color: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Status</label>
                  <select
                    value={goalForm.is_active ? 1 : 0}
                    onChange={e => setGoalForm({ ...goalForm, is_active: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:bg-white focus:border-teal-500"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive / Hidden</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 mt-2">
                <span
                  className="px-2.5 py-1 rounded text-white font-black text-xs shadow-xs"
                  style={{ backgroundColor: goalForm.color || '#0f766e' }}
                >
                  SDG {goalForm.sdg_number}
                </span>
                <span className="font-bold text-slate-800 text-xs truncate">
                  {goalForm.title || 'Goal Title Preview'}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-colors shadow-xs"
                >
                  {isSubmitting ? 'Saving...' : 'Save SDG Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </div>
  );
}

export default RankingFAQAdmin;
