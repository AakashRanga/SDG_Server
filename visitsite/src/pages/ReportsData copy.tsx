import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, FileBarChartIcon, FileTextIcon, TrendingUpIcon, BarChart3Icon, EyeIcon, PlusIcon, TrashIcon, UploadIcon, FileIcon, ImageIcon, VideoIcon, XIcon, Edit3 as EditIcon } from 'lucide-react';
import { useReports } from '../contexts/ReportsContext';
export function ReportsData() {
  const navigate = useNavigate();
  const {
    annualReports,
    impactReports,
    sustainabilityMetrics,
    addReport,
    updateReport,
    deleteReport
  } = useReports();
  const [activeTab, setActiveTab] = useState<'annualReports' | 'impactReports' | 'sustainabilityMetrics'>('annualReports');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    year: new Date().getFullYear().toString(),
    category: '',
    coverImage: '',
    images: [] as string[],
    videos: [] as string[],
    files: [] as any[],
    // removed metricsFile: upload option is no longer needed
    metrics: [] as Array<{
      label: string;
      value: string | number;
      change?: string;
      trend?: 'up' | 'down' | 'stable';
    }>
  });
  const tabs = [{
    id: 'annualReports' as const,
    label: 'Annual Reports',
    icon: FileTextIcon,
    count: annualReports.length
  }, {
    id: 'impactReports' as const,
    label: 'Impact Reports',
    icon: TrendingUpIcon,
    count: impactReports.length
  }, {
    id: 'sustainabilityMetrics' as const,
    label: 'Sustainability Metrics',
    icon: BarChart3Icon,
    count: sustainabilityMetrics.length
  }];
  const getCurrentData = () => {
    switch (activeTab) {
      case 'annualReports':
        return annualReports;
      case 'impactReports':
        return impactReports;
      case 'sustainabilityMetrics':
        return sustainabilityMetrics;
    }
  };
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    id: '',
    title: '',
    description: '',
    year: new Date().getFullYear().toString(),
    category: '',
    coverImage: '',
    images: [] as string[],
    videos: [] as string[],
    files: [] as any[],
    metrics: [] as Array<{
      label: string;
      value: string | number;
      change?: string;
      trend?: 'up' | 'down' | 'stable';
    }>
  });
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          coverImage: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, reader.result as string]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };
  const handleEditCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditFormData(prev => ({ ...prev, coverImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setEditFormData(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
        };
        reader.readAsDataURL(file);
      });
    }
  };
  const handleEditVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setEditFormData(prev => ({ ...prev, videos: [...prev.videos, reader.result as string] }));
        };
        reader.readAsDataURL(file);
      });
    }
  };
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            videos: [...prev.videos, reader.result as string]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };
  // PDF upload handlers (replace previous Excel import)
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // keep File object for FormData append in addReport
      setFormData(prev => ({ ...prev, files: [...prev.files, file] }));
    }
  };

  const handleEditPdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // store as object with url so updateReport can send a URL/string
        setEditFormData(prev => ({ ...prev, files: [...prev.files, { name: file.name, url: reader.result as string, size: file.size }] }));
      };
      reader.readAsDataURL(file);
    }
  };
  // Add N empty metric rows (default 4 to create a full card set)
  const addMetricManually = (count: number = 4) => {
    setFormData(prev => ({
      ...prev,
      metrics: [
        ...prev.metrics,
        ...Array.from({ length: count }).map((): { label: string; value: string | number; change?: string; trend?: 'up' | 'down' | 'stable' } => ({
          label: '',
          value: '',
          change: '',
          trend: 'stable'
        }))
      ]
    }));
  };
  const updateMetric = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      metrics: prev.metrics.map((metric, i) => i === index ? {
        ...metric,
        [field]: value
      } : metric)
    }));
  };
  const removeMetric = (index: number) => {
    setFormData(prev => ({
      ...prev,
      metrics: prev.metrics.filter((_, i) => i !== index)
    }));
  };
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  const removeVideo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }));
  };
  const removeEditImage = (index: number) => {
    setEditFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };
  const removeEditVideo = (index: number) => {
    setEditFormData(prev => ({ ...prev, videos: prev.videos.filter((_, i) => i !== index) }));
  };
  const removeFile = (index: number) => {
    setFormData(prev => ({ ...prev, files: prev.files.filter((_: any, i: number) => i !== index) }));
  };
  const removeEditFile = (index: number) => {
    setEditFormData(prev => ({ ...prev, files: prev.files.filter((_: any, i: number) => i !== index) }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (async () => {
      try {
        const payload: any = {
          title: formData.title,
          description: formData.description,
          year: formData.year,
          category: formData.category,
          coverImage: formData.coverImage,
          images: formData.images,
          videos: formData.videos,
          metrics: formData.metrics,
          files: formData.files,
        };


        await addReport(activeTab, payload);

        setFormData({
          title: '',
          description: '',
          year: new Date().getFullYear().toString(),
          category: '',
          coverImage: '',
          images: [],
          videos: [],
          files: [],
          metrics: []
        });
        setShowForm(false);
      } catch (err) {
        console.error('Failed to add report:', err);
        alert('Failed to add report — check console/server logs');
      }
    })();
  };

  // Edit flow
  const startEdit = (item: any) => {
    // metrics may be JSON string; normalize
    let metricsArr: any[] = [];
    if (Array.isArray(item.metrics)) metricsArr = item.metrics;
    else if (typeof item.metrics === 'string') {
      try { const parsed = JSON.parse(item.metrics); if (Array.isArray(parsed)) metricsArr = parsed; } catch (e) { metricsArr = []; }
    }
    // normalize images
    let imagesArr: string[] = [];
    try {
      if (Array.isArray(item.images)) imagesArr = item.images;
      else if (Array.isArray(item.additional_images)) imagesArr = item.additional_images;
      else if (typeof item.additional_images === 'string' && item.additional_images) imagesArr = JSON.parse(item.additional_images);
      else if (typeof item.images === 'string' && item.images) imagesArr = JSON.parse(item.images);
    } catch (e) { imagesArr = []; }

    // normalize videos
    let videosArr: string[] = [];
    try {
      if (Array.isArray(item.videos)) videosArr = item.videos;
      else if (typeof item.videos === 'string' && item.videos) videosArr = JSON.parse(item.videos);
    } catch (e) { videosArr = []; }

    // normalize files/metrics_data
    let filesArr: any[] = [];
    try {
      if (Array.isArray(item.files)) filesArr = item.files;
      else if (item.metrics_data && typeof item.metrics_data === 'string') {
        try {
          const parsed = JSON.parse(item.metrics_data);
          filesArr = Array.isArray(parsed) ? parsed : [{ name: item.metrics_data, url: item.metrics_data }];
        } catch (e) {
          filesArr = [{ name: item.metrics_data, url: item.metrics_data }];
        }
      }
    } catch (e) { filesArr = []; }

    setEditingReportId(item.id);
    setEditFormData({
      id: item.id,
      title: item.title || '',
      description: item.description || '',
      year: item.year || new Date().getFullYear().toString(),
      category: item.category || '',
      coverImage: item.coverImage || (item.cover_image || ''),
      images: imagesArr,
      videos: videosArr,
      files: filesArr,
      metrics: metricsArr
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingReportId(null);
    setEditFormData({ id: '', title: '', description: '', year: new Date().getFullYear().toString(), category: '', coverImage: '', images: [], videos: [], files: [], metrics: [] });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReportId) return;
    (async () => {
      try {
        const payload: any = {
          title: editFormData.title,
          description: editFormData.description,
          year: editFormData.year,
          category: editFormData.category,
          coverImage: editFormData.coverImage,
          images: editFormData.images,
          videos: editFormData.videos,
          files: editFormData.files,
          metrics: editFormData.metrics
        };
        await updateReport(activeTab, editingReportId, payload);
        cancelEdit();
      } catch (err) {
        console.error('Failed to update report:', err);
        alert('Failed to update report — check console/server logs');
      }
    })();
  };
  return <div className="min-h-screen w-full bg-gradient-to-br from-red-50 via-orange-50 to-pink-50">
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-pink-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white hover:text-red-100 transition-colors">
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Dashboard
            </button>
            <button onClick={() => navigate('/reports/site')} className="flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors shadow-lg">
              <EyeIcon className="w-5 h-5" />
              Visit Site
            </button>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
              <FileBarChartIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              Sustainability Reports
            </h1>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto">
          {tabs.map(tab => {
          const Icon = tab.icon;
          return <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600 hover:text-red-600'}`}>
                <Icon className="w-5 h-5" />
                {tab.label} ({tab.count})
              </button>;
        })}
        </div>
        <button onClick={() => setShowForm(!showForm)} className="mb-6 flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
          <PlusIcon className="w-5 h-5" />
          Add New {tabs.find(t => t.id === activeTab)?.label}
        </button>
        {showForm && <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Add New {tabs.find(t => t.id === activeTab)?.label}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input type="text" required value={formData.title} onChange={e => setFormData({
              ...formData,
              title: e.target.value
            })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea required value={formData.description} onChange={e => setFormData({
              ...formData,
              description: e.target.value
            })} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year *
                  </label>
                  <input type="text" required value={formData.year} onChange={e => setFormData({
                ...formData,
                year: e.target.value
              })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <input type="text" required value={formData.category} onChange={e => setFormData({
                ...formData,
                category: e.target.value
              })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                </div>
              </div>
              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image
                </label>
                <label className="cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
                  <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Click to upload cover image
                  </span>
                  <input type="file" accept="image/*" onChange={handleCoverImageUpload} className="hidden" />
                </label>
                {formData.coverImage && <img src={formData.coverImage} alt="Cover" className="mt-3 w-full h-48 object-cover rounded-lg" />}
              </div>
              {/* Additional Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Images
                </label>
                <label className="cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
                  <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Click to upload images
                  </span>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
                {formData.images.length > 0 && <div className="grid grid-cols-3 gap-2 mt-3">
                    {formData.images.map((image, index) => <div key={index} className="relative group">
                        <img src={image} alt={`Upload ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                        <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>)}
                  </div>}
              </div>
              {/* Videos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Videos
                </label>
                <label className="cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
                  <VideoIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Click to upload videos
                  </span>
                  <input type="file" accept="video/*" multiple onChange={handleVideoUpload} className="hidden" />
                </label>
                {formData.videos.length > 0 && <div className="grid grid-cols-2 gap-2 mt-3">
                    {formData.videos.map((video, index) => <div key={index} className="relative group">
                        <video src={video} className="w-full h-24 object-cover rounded-lg" controls />
                        <button type="button" onClick={() => removeVideo(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>)}
                  </div>}
              </div>
              {/* Metrics Section */}
              <div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Metrics & Data
                  </label>
                </div>
                <div className="flex gap-2 mb-3">
                  <label className="flex-1 cursor-pointer bg-blue-100 border-2 border-dashed border-blue-300 rounded-lg p-3 flex items-center justify-center hover:bg-blue-50 transition-colors">
                    <FileIcon className="w-6 h-6 text-blue-600 mr-2" />
                    <span className="text-sm text-blue-700 font-medium">
                      Upload PDF File
                    </span>
                    <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
                  </label>
                  {formData.files.length > 0 && <div className="w-full mt-2 space-y-2">
                    {formData.files.map((f: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <a className="text-sm text-blue-600 truncate" target="_blank" rel="noreferrer" href={typeof f === 'string' ? f : (f instanceof File ? URL.createObjectURL(f) : f.url)}>{typeof f === 'string' ? (f.name || f) : f.name}</a>
                        <button type="button" onClick={() => removeFile(idx)} className="text-red-500 px-2">Remove</button>
                      </div>
                    ))}
                  </div>}
                  <button type="button" onClick={() => addMetricManually()} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    Add Manually
                  </button>
                  {/* metrics file upload removed - we rely on manual/add and excel import only */}
                </div>
                {/* show toolbar when metrics are present in the form */}
                {formData.metrics.length > 0 && <>
                  <div className="flex items-center gap-2 mb-3">
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, metrics: [] }))} title="Clear metrics" className="px-3 py-1 bg-red-100 text-red-600 rounded">X</button>
                      <button type="button" onClick={() => addMetricManually(1)} title="Add one metric" className="px-3 py-1 bg-green-100 text-green-600 rounded">+</button>
                    </div>
                    <div className="space-y-3">
                      {formData.metrics.map((metric, index) => (
                        <div key={index} className="grid grid-cols-5 gap-2 p-3 bg-gray-50 rounded-lg">
                        <input type="text" placeholder="Label" value={metric.label} onChange={e => updateMetric(index, 'label', e.target.value)} className="px-3 py-2 border border-gray-300 rounded" />
                        <input type="text" placeholder="Value" value={metric.value} onChange={e => updateMetric(index, 'value', e.target.value)} className="px-3 py-2 border border-gray-300 rounded" />
                        <input type="text" placeholder="Change" value={metric.change || ''} onChange={e => updateMetric(index, 'change', e.target.value)} className="px-3 py-2 border border-gray-300 rounded" />
                        <select value={metric.trend || 'stable'} onChange={e => updateMetric(index, 'trend', e.target.value)} className="px-3 py-2 border border-gray-300 rounded">
                          <option value="up">Up</option>
                          <option value="down">Down</option>
                          <option value="stable">Stable</option>
                        </select>
                        <button type="button" onClick={() => removeMetric(index)} className="text-red-500 hover:text-red-700">
                          <XIcon className="w-5 h-5" />
                        </button>
                        </div>
                      ))}
                    </div>
                  </>}
              </div>
              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                  Add Report
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>}
          {/* Edit Form */}
          {editingReportId && <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Edit {tabs.find(t => t.id === activeTab)?.label}</h3>
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input type="text" required value={editFormData.title} onChange={e => setEditFormData({ ...editFormData, title: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea required value={editFormData.description} onChange={e => setEditFormData({ ...editFormData, description: e.target.value })} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                    <input type="text" required value={editFormData.year} onChange={e => setEditFormData({ ...editFormData, year: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <input type="text" required value={editFormData.category} onChange={e => setEditFormData({ ...editFormData, category: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                  </div>
                </div>
                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                  <label className="cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
                    <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Click to upload cover image</span>
                    <input type="file" accept="image/*" onChange={handleEditCoverImageUpload} className="hidden" />
                  </label>
                  {editFormData.coverImage && <img src={editFormData.coverImage} alt="Cover" className="mt-3 w-full h-48 object-cover rounded-lg" />}
                </div>
                {/* Additional Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
                  <label className="cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
                    <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Click to upload images</span>
                    <input type="file" accept="image/*" multiple onChange={handleEditImageUpload} className="hidden" />
                  </label>
                  {editFormData.images.length > 0 && <div className="grid grid-cols-3 gap-2 mt-3">{editFormData.images.map((image, index) => <div key={index} className="relative group"><img src={image} alt={`Upload ${index + 1}`} className="w-full h-24 object-cover rounded-lg" /><button type="button" onClick={() => removeEditImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><XIcon className="w-4 h-4" /></button></div>)}</div>}
                </div>
                {/* Videos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Videos</label>
                  <label className="cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
                    <VideoIcon className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Click to upload videos</span>
                    <input type="file" accept="video/*" multiple onChange={handleEditVideoUpload} className="hidden" />
                  </label>
                  {editFormData.videos.length > 0 && <div className="grid grid-cols-2 gap-2 mt-3">{editFormData.videos.map((video, index) => <div key={index} className="relative group"><video src={video} className="w-full h-24 object-cover rounded-lg" controls /><button type="button" onClick={() => removeEditVideo(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><XIcon className="w-4 h-4" /></button></div>)}</div>}
                </div>
                {/* Metrics Section */}
                <div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Metrics & Data</label>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <label className="flex-1 cursor-pointer bg-blue-100 border-2 border-dashed border-blue-300 rounded-lg p-3 flex items-center justify-center hover:bg-blue-50 transition-colors">
                      <FileIcon className="w-6 h-6 text-blue-600 mr-2" />
                      <span className="text-sm text-blue-700 font-medium">Upload PDF File</span>
                      <input type="file" accept="application/pdf" onChange={handleEditPdfUpload} className="hidden" />
                    </label>
                    {editFormData.files.length > 0 && <div className="w-full mt-2 space-y-2">
                      {editFormData.files.map((f: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <a className="text-sm text-blue-600 truncate" target="_blank" rel="noreferrer" href={typeof f === 'string' ? f : (f.url || f)}>{typeof f === 'string' ? (f.name || f) : f.name}</a>
                          <button type="button" onClick={() => removeEditFile(idx)} className="text-red-500 px-2">Remove</button>
                        </div>
                      ))}
                    </div>}
                    <button type="button" onClick={() => setEditFormData(prev => ({ ...prev, metrics: [...prev.metrics, ...Array.from({ length: 1 }).map(() => ({ label: '', value: '', change: '', trend: 'stable' }))] }))} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">Add Manually</button>
                  </div>
                  {editFormData.metrics.length > 0 && <>
                    <div className="flex items-center gap-2 mb-3">
                      <button type="button" onClick={() => setEditFormData(prev => ({ ...prev, metrics: [] }))} title="Clear metrics" className="px-3 py-1 bg-red-100 text-red-600 rounded">X</button>
                      <button type="button" onClick={() => setEditFormData(prev => ({ ...prev, metrics: [...prev.metrics, { label: '', value: '', change: '', trend: 'stable' }] }))} title="Add one metric" className="px-3 py-1 bg-green-100 text-green-600 rounded">+</button>
                    </div>
                    <div className="space-y-3">
                      {editFormData.metrics.map((metric, index) => (
                        <div key={index} className="grid grid-cols-5 gap-2 p-3 bg-gray-50 rounded-lg">
                          <input type="text" placeholder="Label" value={metric.label} onChange={e => setEditFormData(prev => ({ ...prev, metrics: prev.metrics.map((m, i) => i === index ? { ...m, label: e.target.value } : m) }))} className="px-3 py-2 border border-gray-300 rounded" />
                          <input type="text" placeholder="Value" value={metric.value as string} onChange={e => setEditFormData(prev => ({ ...prev, metrics: prev.metrics.map((m, i) => i === index ? { ...m, value: e.target.value } : m) }))} className="px-3 py-2 border border-gray-300 rounded" />
                          <input type="text" placeholder="Change" value={metric.change || ''} onChange={e => setEditFormData(prev => ({ ...prev, metrics: prev.metrics.map((m, i) => i === index ? { ...m, change: e.target.value } : m) }))} className="px-3 py-2 border border-gray-300 rounded" />
                          <select value={metric.trend || 'stable'} onChange={e => setEditFormData(prev => ({ ...prev, metrics: prev.metrics.map((m, i) => i === index ? { ...m, trend: e.target.value as any } : m) }))} className="px-3 py-2 border border-gray-300 rounded">
                            <option value="up">Up</option>
                            <option value="down">Down</option>
                            <option value="stable">Stable</option>
                          </select>
                          <button type="button" onClick={() => setEditFormData(prev => ({ ...prev, metrics: prev.metrics.filter((_, i) => i !== index) }))} className="text-red-500 hover:text-red-700"><XIcon className="w-5 h-5" /></button>
                        </div>
                      ))}
                    </div>
                  </>}
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">Save Changes</button>
                  <button type="button" onClick={cancelEdit} className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
                </div>
              </form>
            </div>}
        <div className="grid grid-cols-1 gap-6">
          {getCurrentData().map(item => {
            // Ensure metrics is an array before rendering (server may send JSON string or null)
            const metricsList = Array.isArray((item as any).metrics) ? (item as any).metrics : typeof (item as any).metrics === 'string' ? (() => {
              try {
                const parsed = JSON.parse((item as any).metrics);
                return Array.isArray(parsed) ? parsed : [];
              } catch (e) {
                return [];
              }
            })() : [];

            return (
            <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {item.coverImage && <div className="relative h-64">
                  <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(item)} className="text-blue-600 hover:text-blue-700 p-2" title="Edit">
                      <EditIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => deleteReport(activeTab, item.id)} className="text-red-600 hover:text-red-700 p-2">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {metricsList.length > 0 && <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {metricsList.map((metric: any, idx: number) => (
                      <div key={idx} className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">
                          {metric.label}
                        </p>
                        <p className="text-2xl font-bold text-red-600">
                          {metric.value}
                        </p>
                        {metric.change && <p className="text-sm text-green-600 mt-1">
                            {metric.change}
                          </p>}
                      </div>
                    ))}
                  </div>}
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                    {item.category}
                  </span>
                  <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                    {item.year}
                  </span>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>;
}