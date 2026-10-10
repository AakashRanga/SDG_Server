import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, TrashIcon, ImageIcon, VideoIcon, FileIcon, XIcon, FlaskConicalIcon, FileBarChartIcon, TargetIcon } from 'lucide-react';
import { useSDG } from '../contexts/SDGContext';
export function SDGDetailData() {
  const navigate = useNavigate();
  const {
    goalNumber
  } = useParams<{
    goalNumber: string;
  }>();
  const {
    sdgData,
    researchActivities,
    reports,
    addSDGData,
    deleteSDGData,
    addResearchActivity,
    deleteResearchActivity,
    addReport,
    deleteReport
  } = useSDG();
  const [activeTab, setActiveTab] = useState<'initiatives' | 'research' | 'reports'>('initiatives');
  const [showForm, setShowForm] = useState(false);
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
    title: 'Good Health and Well-being',
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
    title: 'Clean Water and Sanitation',
    color: 'from-cyan-500 to-cyan-700',
    icon: '💧'
  }, {
    number: 7,
    title: 'Affordable and Clean Energy',
    color: 'from-yellow-400 to-yellow-600',
    icon: '⚡'
  }, {
    number: 8,
    title: 'Decent Work and Economic Growth',
    color: 'from-red-700 to-red-900',
    icon: '💼'
  }, {
    number: 9,
    title: 'Industry, Innovation and Infrastructure',
    color: 'from-orange-600 to-orange-800',
    icon: '🏗️'
  }, {
    number: 10,
    title: 'Reduced Inequalities',
    color: 'from-pink-500 to-pink-700',
    icon: '🤝'
  }, {
    number: 11,
    title: 'Sustainable Cities and Communities',
    color: 'from-amber-500 to-amber-700',
    icon: '🏙️'
  }, {
    number: 12,
    title: 'Responsible Consumption and Production',
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
    title: 'Peace, Justice and Strong Institutions',
    color: 'from-blue-700 to-blue-900',
    icon: '⚖️'
  }, {
    number: 17,
    title: 'Partnerships for the Goals',
    color: 'from-indigo-600 to-indigo-800',
    icon: '🌐'
  }];
  const currentGoal = sdgGoals.find(g => g.number === parseInt(goalNumber || '1'));
  const currentData = sdgData[parseInt(goalNumber || '1')] || [];
  const currentResearch = researchActivities[parseInt(goalNumber || '1')] || [];
  const currentReports = reports[parseInt(goalNumber || '1')] || [];
  // Form states for initiatives
  const [initiativeForm, setInitiativeForm] = useState({
    title: '',
    description: '',
    year: new Date().getFullYear().toString(),
    category: '',
    impact: '',
    beneficiaries: '',
    images: [] as string[],
    videos: [] as string[],
    files: [] as Array<{
      name: string;
      url: string;
      size: string;
    }>,
    metrics: [] as Array<{
      label: string;
      value: string | number;
      unit?: string;
    }>
  });
  // Form states for research
  const [researchForm, setResearchForm] = useState({
    title: '',
    description: '',
    year: new Date().getFullYear().toString(),
    researchType: '',
    leadResearcher: '',
    department: '',
    fundingAmount: '',
    publications: '',
    outcomes: '',
    collaborators: [] as string[],
    images: [] as string[],
    files: [] as Array<{
      name: string;
      url: string;
      size: string;
    }>
  });
  // Form states for reports
  const [reportForm, setReportForm] = useState({
    title: '',
    description: '',
    year: new Date().getFullYear().toString(),
    coverImage: '',
    executiveSummary: '',
    keyFindings: [] as string[],
    dataPoints: [] as Array<{
      label: string;
      value: number;
      target?: number;
      unit?: string;
      trend?: 'up' | 'down' | 'stable';
    }>,
    recommendations: [] as string[],
    images: [] as string[],
    files: [] as Array<{
      name: string;
      url: string;
      size: string;
    }>
  });
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, formType: 'initiative' | 'research' | 'report') => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (formType === 'initiative') {
            setInitiativeForm(prev => ({
              ...prev,
              images: [...prev.images, reader.result as string]
            }));
          } else if (formType === 'research') {
            setResearchForm(prev => ({
              ...prev,
              images: [...prev.images, reader.result as string]
            }));
          } else {
            setReportForm(prev => ({
              ...prev,
              images: [...prev.images, reader.result as string]
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, formType: 'research' | 'report') => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newFile = {
            name: file.name,
            url: reader.result as string,
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
          };
          if (formType === 'research') {
            setResearchForm(prev => ({
              ...prev,
              files: [...prev.files, newFile]
            }));
          } else {
            setReportForm(prev => ({
              ...prev,
              files: [...prev.files, newFile]
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  const removeFile = (index: number, formType: 'research' | 'report') => {
    if (formType === 'research') {
      setResearchForm(prev => ({
        ...prev,
        files: prev.files.filter((_, i) => i !== index)
      }));
    } else {
      setReportForm(prev => ({
        ...prev,
        files: prev.files.filter((_, i) => i !== index)
      }));
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const goalNum = parseInt(goalNumber || '1');
    if (activeTab === 'initiatives') {
      addSDGData(goalNum, initiativeForm);
      setInitiativeForm({
        title: '',
        description: '',
        year: new Date().getFullYear().toString(),
        category: '',
        impact: '',
        beneficiaries: '',
        images: [],
        videos: [],
        files: [],
        metrics: []
      });
    } else if (activeTab === 'research') {
      addResearchActivity(goalNum, researchForm);
      setResearchForm({
        title: '',
        description: '',
        year: new Date().getFullYear().toString(),
        researchType: '',
        leadResearcher: '',
        department: '',
        fundingAmount: '',
        publications: '',
        outcomes: '',
        collaborators: [],
        images: [],
        files: []
      });
    } else {
      addReport(goalNum, reportForm);
      setReportForm({
        title: '',
        description: '',
        year: new Date().getFullYear().toString(),
        reportType: '',
        coverImage: '',
        executiveSummary: '',
        keyFindings: [],
        dataPoints: [],
        recommendations: [],
        images: [],
        files: []
      });
    }
    setShowForm(false);
  };
  return <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className={`bg-gradient-to-r ${currentGoal?.color} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/sdg')} className="flex items-center gap-2 text-white hover:text-white/80 transition-colors">
              <ArrowLeftIcon className="w-5 h-5" />
              Back to SDG Goals
            </button>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="text-6xl">{currentGoal?.icon}</div>
            <div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mb-2">
                <span className="text-3xl font-bold text-white">
                  {currentGoal?.number}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-white">
                {currentGoal?.title}
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button onClick={() => setActiveTab('initiatives')} className={`px-6 py-3 font-semibold transition-colors flex items-center gap-2 ${activeTab === 'initiatives' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>
            <TargetIcon className="w-5 h-5" />
            Activities ({currentData.length})
          </button>
          <button onClick={() => setActiveTab('research')} className={`px-6 py-3 font-semibold transition-colors flex items-center gap-2 ${activeTab === 'research' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>
            <FlaskConicalIcon className="w-5 h-5" />
            Research Grant ({currentResearch.length})
          </button>
          <button onClick={() => setActiveTab('reports')} className={`px-6 py-3 font-semibold transition-colors flex items-center gap-2 ${activeTab === 'reports' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>
            <FileBarChartIcon className="w-5 h-5" />
            SDG Reports ({currentReports.length})
          </button>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={`mb-6 flex items-center gap-2 bg-gradient-to-r ${currentGoal?.color} text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all`}>
          <PlusIcon className="w-5 h-5" />
          Add New{' '}
          {activeTab === 'initiatives' ? 'Activity' : activeTab === 'research' ? 'Research Grant' : 'Report'}
        </button>
        {showForm && activeTab === 'initiatives' && <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Add New Activity
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Title *" required value={initiativeForm.title} onChange={e => setInitiativeForm({
            ...initiativeForm,
            title: e.target.value
          })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              <textarea placeholder="Description *" required value={initiativeForm.description} onChange={e => setInitiativeForm({
            ...initiativeForm,
            description: e.target.value
          })} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Year *" required value={initiativeForm.year} onChange={e => setInitiativeForm({
              ...initiativeForm,
              year: e.target.value
            })} className="px-4 py-2 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Category" value={initiativeForm.category} onChange={e => setInitiativeForm({
              ...initiativeForm,
              category: e.target.value
            })} className="px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <label className="cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Upload Images</span>
                <input type="file" accept="image/*" multiple onChange={e => handleImageUpload(e, 'initiative')} className="hidden" />
              </label>
              <button type="submit" className={`w-full bg-gradient-to-r ${currentGoal?.color} text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all`}>
                Add Activity
              </button>
            </form>
          </div>}
        {showForm && activeTab === 'research' && <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Add Research Grant
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Research Title *" required value={researchForm.title} onChange={e => setResearchForm({
            ...researchForm,
            title: e.target.value
          })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              <textarea placeholder="Description *" required value={researchForm.description} onChange={e => setResearchForm({
            ...researchForm,
            description: e.target.value
          })} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Lead Researcher *" required value={researchForm.leadResearcher} onChange={e => setResearchForm({
              ...researchForm,
              leadResearcher: e.target.value
            })} className="px-4 py-2 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Department *" required value={researchForm.department} onChange={e => setResearchForm({
              ...researchForm,
              department: e.target.value
            })} className="px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Research Type" value={researchForm.researchType} onChange={e => setResearchForm({
              ...researchForm,
              researchType: e.target.value
            })} className="px-4 py-2 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Funding Amount" value={researchForm.fundingAmount} onChange={e => setResearchForm({
              ...researchForm,
              fundingAmount: e.target.value
            })} className="px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              {/* File Upload for Research */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Publications / Project Files
                </label>
                <label className="cursor-pointer bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-blue-100 transition-colors">
                  <FileIcon className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="text-sm text-blue-700 font-medium">
                    Click to upload files (PDF, DOC, XLSX)
                  </span>
                  <input type="file" accept=".pdf,.doc,.docx,.xlsx,.xls" multiple onChange={e => handleFileUpload(e, 'research')} className="hidden" />
                </label>
                {researchForm.files.length > 0 && <div className="mt-3 space-y-2">
                    {researchForm.files.map((file, index) => <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileIcon className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">{file.size}</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => removeFile(index, 'research')} className="text-red-500 hover:text-red-700">
                          <XIcon className="w-5 h-5" />
                        </button>
                      </div>)}
                  </div>}
              </div>
              <button type="submit" className={`w-full bg-gradient-to-r ${currentGoal?.color} text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all`}>
                Add Research Grant
              </button>
            </form>
          </div>}
        {showForm && activeTab === 'reports' && <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Add SDG Report
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Report Title *" required value={reportForm.title} onChange={e => setReportForm({
            ...reportForm,
            title: e.target.value
          })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              <textarea placeholder="Executive Summary *" required value={reportForm.executiveSummary} onChange={e => setReportForm({
            ...reportForm,
            executiveSummary: e.target.value
          })} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="text" placeholder="Year *" required value={reportForm.year} onChange={e => setReportForm({
            ...reportForm,
            year: e.target.value
          })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              {/* File Upload for Reports */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Report Files
                </label>
                <label className="cursor-pointer bg-green-50 border-2 border-dashed border-green-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-green-100 transition-colors">
                  <FileIcon className="w-8 h-8 text-green-600 mb-2" />
                  <span className="text-sm text-green-700 font-medium">
                    Click to upload report files (PDF, DOC, XLSX)
                  </span>
                  <input type="file" accept=".pdf,.doc,.docx,.xlsx,.xls" multiple onChange={e => handleFileUpload(e, 'report')} className="hidden" />
                </label>
                {reportForm.files.length > 0 && <div className="mt-3 space-y-2">
                    {reportForm.files.map((file, index) => <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileIcon className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">{file.size}</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => removeFile(index, 'report')} className="text-red-500 hover:text-red-700">
                          <XIcon className="w-5 h-5" />
                        </button>
                      </div>)}
                  </div>}
              </div>
              <button type="submit" className={`w-full bg-gradient-to-r ${currentGoal?.color} text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all`}>
                Add Report
              </button>
            </form>
          </div>}
        {/* Display Data */}
        {activeTab === 'initiatives' && <div className="grid grid-cols-1 gap-6">
            {currentData.map(item => <div key={item.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {item.title}
                  </h3>
                  <button onClick={() => deleteSDGData(parseInt(goalNumber || '1'), item.id)} className="text-red-600 hover:text-red-700">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-600 mb-4">{item.description}</p>
                {item.images && item.images.length > 0 && <div className="grid grid-cols-3 gap-2">
                    {item.images.map((img, idx) => <img key={idx} src={img} alt="" className="w-full h-32 object-cover rounded-lg" />)}
                  </div>}
              </div>)}
          </div>}
        {activeTab === 'research' && <div className="grid grid-cols-1 gap-6">
            {currentResearch.map(item => <div key={item.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {item.title}
                  </h3>
                  <button onClick={() => deleteResearchActivity(parseInt(goalNumber || '1'), item.id)} className="text-red-600 hover:text-red-700">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-indigo-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Lead Researcher</p>
                    <p className="font-semibold text-indigo-700">
                      {item.leadResearcher}
                    </p>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-semibold text-indigo-700">
                      {item.department}
                    </p>
                  </div>
                </div>
                {item.files && item.files.length > 0 && <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Publications & Project Files:
                    </p>
                    <div className="space-y-2">
                      {item.files.map((file, idx) => <div key={idx} className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg">
                          <FileIcon className="w-5 h-5 text-blue-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">{file.size}</p>
                          </div>
                        </div>)}
                    </div>
                  </div>}
              </div>)}
          </div>}
        {activeTab === 'reports' && <div className="grid grid-cols-1 gap-6">
            {currentReports.map(item => <div key={item.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {item.title}
                  </h3>
                  <button onClick={() => deleteReport(parseInt(goalNumber || '1'), item.id)} className="text-red-600 hover:text-red-700">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-600 mb-4">{item.executiveSummary}</p>
                {item.coverImage && <img src={item.coverImage} alt="" className="w-full h-64 object-cover rounded-lg mb-4" />}
                {item.files && item.files.length > 0 && <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Report Files:
                    </p>
                    <div className="space-y-2">
                      {item.files.map((file, idx) => <div key={idx} className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                          <FileIcon className="w-5 h-5 text-green-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">{file.size}</p>
                          </div>
                        </div>)}
                    </div>
                  </div>}
              </div>)}
          </div>}
      </div>
    </div>;
}