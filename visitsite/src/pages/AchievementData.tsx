import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, TrophyIcon, AwardIcon, BarChart3Icon, StarIcon, 
  EyeIcon, PlusIcon, TrashIcon, FileIcon, ImageIcon, 
  VideoIcon, XIcon, Edit3 as EditIcon 
} from 'lucide-react';
import { useAchievement } from '../contexts/AchievementContext';

// ✅ Image base URL - matches your server
const IMAGE_BASE_URL = "http://180.235.121.250:8006";

export function AchievementData() {
  const navigate = useNavigate();
  const {
    awards,
    certifications,
    rankings,
    recognition,
    addAchievement,
    updateAchievement,
    deleteAchievement
  } = useAchievement();
  
  const [activeTab, setActiveTab] = useState<'awards' | 'certifications' | 'rankings' | 'recognition'>('awards');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    year: new Date().getFullYear().toString(),
    organization: '',
    rank: '',
    score: '',
    images: [] as string[],
    videos: [] as string[],
    files: [] as Array<{
      name: string;
      url: string;
      size: string;
    }>
  });
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    id: '',
    title: '',
    description: '',
    category: '',
    year: new Date().getFullYear().toString(),
    organization: '',
    rank: '',
    score: '',
    images: [] as string[],
    videos: [] as string[],
    files: [] as Array<{
      name: string;
      url: string;
      size: string;
    }>
  });

  const tabs = [{
    id: 'awards' as const,
    label: 'Awards',
    icon: TrophyIcon,
    count: awards.length
  }, {
    id: 'certifications' as const,
    label: 'Certifications',
    icon: AwardIcon,
    count: certifications.length
  }, {
    id: 'rankings' as const,
    label: 'Rankings',
    icon: BarChart3Icon,
    count: rankings.length
  }, {
    id: 'recognition' as const,
    label: 'Recognition',
    icon: StarIcon,
    count: recognition.length
  }];

  const getCurrentData = () => {
    switch (activeTab) {
      case 'awards': return awards;
      case 'certifications': return certifications;
      case 'rankings': return rankings;
      case 'recognition': return recognition;
    }
  };

  // ✅ Helper to get full URL for any file (images, videos, documents)
  const getFullFileUrl = (filePath: string) => {
    if (!filePath) return '';
    
    // If it's a base64 string, return as is
    if (filePath.startsWith('data:')) {
      return filePath;
    }
    
    // If it's already a full URL
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }
    
    // If it's a relative path starting with /uploads/
    if (filePath.startsWith('/uploads/')) {
      return `${IMAGE_BASE_URL}${filePath}`;
    }
    
    // Default: treat as path
    return `${IMAGE_BASE_URL}/uploads/awards/${filePath}`;
  };

  // ✅ Get document download URL
  const getDocumentUrl = (docPath: string) => {
    if (!docPath) return '';
    if (docPath.startsWith('/uploads/')) {
      return `${IMAGE_BASE_URL}${docPath}`;
    }
    return docPath;
  };

  // ✅ Image component with error handling
  const renderImage = (image: string, index: number, title: string) => {
    const imageUrl = getFullFileUrl(image);
    
    if (!imageUrl) {
      return (
        <div key={index} className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-500 text-sm">No image</span>
        </div>
      );
    }

    return (
      <div key={index} className="relative group">
        <img
          src={imageUrl}
          alt={`${title} ${index + 1}`}
          className="w-full h-32 object-cover rounded-lg border border-gray-200"
          onError={(e) => {
            console.error(`❌ Failed to load image: ${imageUrl}`);
            (e.target as HTMLImageElement).style.display = 'none';
            const parent = (e.target as HTMLImageElement).parentElement;
            if (parent) {
              const fallback = document.createElement('div');
              fallback.className = 'w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center';
              fallback.innerHTML = '<span class="text-gray-500 text-sm">Image not available</span>';
              parent.appendChild(fallback);
            }
          }}
          loading="lazy"
        />
      </div>
    );
  };

  // ✅ Render document link
  const renderDocument = (doc: string, index: number) => {
    const docUrl = getDocumentUrl(doc);
    const fileName = doc.split('/').pop() || `Document ${index + 1}`;
    
    return (
      <a
        key={index}
        href={docUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
      >
        <FileIcon className="w-4 h-4" />
        <span className="text-sm font-medium">{fileName}</span>
      </a>
    );
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const sizeInKB = (file.size / 1024).toFixed(2);
          const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
          const displaySize = file.size > 1024 * 1024 ? `${sizeInMB} MB` : `${sizeInKB} KB`;
          setFormData(prev => ({
            ...prev,
            files: [...prev.files, {
              name: file.name,
              url: reader.result as string,
              size: displaySize
            }]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
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

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  // Edit handlers
  const startEdit = (item: any) => {
    setEditingItemId(item.id);
    setEditFormData({
      id: item.id,
      title: item.title || '',
      description: item.description || '',
      category: item.category || '',
      year: item.year || new Date().getFullYear().toString(),
      organization: item.organization || '',
      rank: item.rank || '',
      score: item.score || '',
      images: item.images || [],
      videos: item.videos || [],
      files: (item.documents || item.files) ? (item.documents || item.files).map((f: any) => 
        typeof f === 'string' ? { name: f.split('/').pop() || f, url: f, size: '' } : f
      ) : []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingItemId(null);
    setEditFormData(prev => ({ ...prev, id: '' }));
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

  const handleEditFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const sizeInKB = (file.size / 1024).toFixed(2);
          const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
          const displaySize = file.size > 1024 * 1024 ? `${sizeInMB} MB` : `${sizeInKB} KB`;
          setEditFormData(prev => ({
            ...prev,
            files: [...prev.files, { name: file.name, url: reader.result as string, size: displaySize }]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeEditImage = (index: number) => {
    setEditFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const removeEditVideo = (index: number) => {
    setEditFormData(prev => ({ ...prev, videos: prev.videos.filter((_, i) => i !== index) }));
  };

  const removeEditFile = (index: number) => {
    setEditFormData(prev => ({ ...prev, files: prev.files.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (async () => {
      try {
        await addAchievement(activeTab, formData as any);
        setFormData({
          title: '',
          description: '',
          category: '',
          year: new Date().getFullYear().toString(),
          organization: '',
          rank: '',
          score: '',
          images: [],
          videos: [],
          files: []
        });
        setShowForm(false);
      } catch (err) {
        console.error('Failed to add achievement from UI:', err);
        alert('Failed to add achievement. Check console/server logs for details.');
      }
    })();
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItemId) return;
    (async () => {
      try {
        const payload: any = {
          title: editFormData.title,
          description: editFormData.description,
          category: editFormData.category,
          year: editFormData.year,
          organization: editFormData.organization,
          rank: editFormData.rank,
          score: editFormData.score,
          images: editFormData.images,
          videos: editFormData.videos,
          files: editFormData.files,
        };
        await updateAchievement(activeTab, editingItemId, payload as any);
        cancelEdit();
      } catch (err) {
        console.error('Failed to update achievement from UI:', err);
        alert('Failed to update achievement. Check console/server logs for details.');
      }
    })();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 via-orange-600 to-amber-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white hover:text-yellow-100 transition-colors">
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Dashboard
            </button>
            <button onClick={() => navigate('/achievements/site')} className="flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-50 transition-colors shadow-lg">
              <EyeIcon className="w-5 h-5" />
              Visit Site
            </button>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
              <TrophyIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Achievement Information</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label} ({tab.count})
              </button>
            );
          })}
        </div>

        {/* Add Button */}
        <button onClick={() => setShowForm(!showForm)} className="mb-6 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
          <PlusIcon className="w-5 h-5" />
          Add New {tabs.find(t => t.id === activeTab)?.label}
        </button>

        {/* Add Form - Keep your existing form code */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Add New {tabs.find(t => t.id === activeTab)?.label}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form fields... (keep your existing form fields) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input 
                  type="text" 
                  required 
                  value={formData.title} 
                  onChange={e => setFormData({ ...formData, title: e.target.value })} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea 
                  required 
                  value={formData.description} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })} 
                  rows={4} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.category} 
                    onChange={e => setFormData({ ...formData, category: e.target.value })} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.year} 
                    onChange={e => setFormData({ ...formData, year: e.target.value })} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                  <input 
                    type="text" 
                    value={formData.organization} 
                    onChange={e => setFormData({ ...formData, organization: e.target.value })} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeTab === 'rankings' ? 'Rank' : 'Score'}
                  </label>
                  <input 
                    type="text" 
                    value={activeTab === 'rankings' ? formData.rank : formData.score} 
                    onChange={e => setFormData({
                      ...formData,
                      [activeTab === 'rankings' ? 'rank' : 'score']: e.target.value
                    })} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
                <label className="cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
                  <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload images</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image} 
                          alt={`Upload ${index + 1}`} 
                          className="w-full h-24 object-cover rounded-lg" 
                        />
                        <button 
                          type="button" 
                          onClick={() => removeImage(index)} 
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Videos</label>
                <label className="cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
                  <VideoIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload videos</span>
                  <input type="file" accept="video/*" multiple onChange={handleVideoUpload} className="hidden" />
                </label>
                {formData.videos.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {formData.videos.map((video, index) => (
                      <div key={index} className="relative group">
                        <video src={video} className="w-full h-24 object-cover rounded-lg" controls />
                        <button 
                          type="button" 
                          onClick={() => removeVideo(index)} 
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Documents</label>
                <label className="cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
                  <FileIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload files</span>
                  <input type="file" multiple onChange={handleFileUpload} className="hidden" />
                </label>
                {formData.files.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {formData.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg group">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{file.size}</p>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeFile(index)} 
                          className="text-red-500 hover:text-red-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                  Add {tabs.find(t => t.id === activeTab)?.label}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Edit Form */}
        {editingItemId && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Edit {tabs.find(t => t.id === activeTab)?.label}</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input 
                  type="text" 
                  required 
                  value={editFormData.title} 
                  onChange={e => setEditFormData({ ...editFormData, title: e.target.value })} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea 
                  required 
                  value={editFormData.description} 
                  onChange={e => setEditFormData({ ...editFormData, description: e.target.value })} 
                  rows={4} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <input 
                    type="text" 
                    required 
                    value={editFormData.category} 
                    onChange={e => setEditFormData({ ...editFormData, category: e.target.value })} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                  <input 
                    type="text" 
                    required 
                    value={editFormData.year} 
                    onChange={e => setEditFormData({ ...editFormData, year: e.target.value })} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                  <input 
                    type="text" 
                    value={editFormData.organization} 
                    onChange={e => setEditFormData({ ...editFormData, organization: e.target.value })} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{activeTab === 'rankings' ? 'Rank' : 'Score'}</label>
                  <input 
                    type="text" 
                    value={activeTab === 'rankings' ? editFormData.rank : editFormData.score} 
                    onChange={e => setEditFormData({ ...editFormData, [activeTab === 'rankings' ? 'rank' : 'score']: e.target.value })} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
                <label className="cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
                  <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload images</span>
                  <input type="file" accept="image/*" multiple onChange={handleEditImageUpload} className="hidden" />
                </label>
                {editFormData.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {editFormData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image} 
                          alt={`Upload ${index + 1}`} 
                          className="w-full h-24 object-cover rounded-lg" 
                        />
                        <button 
                          type="button" 
                          onClick={() => removeEditImage(index)} 
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Videos</label>
                <label className="cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
                  <VideoIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload videos</span>
                  <input type="file" accept="video/*" multiple onChange={handleEditVideoUpload} className="hidden" />
                </label>
                {editFormData.videos.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {editFormData.videos.map((video, index) => (
                      <div key={index} className="relative group">
                        <video src={video} className="w-full h-24 object-cover rounded-lg" controls />
                        <button 
                          type="button" 
                          onClick={() => removeEditVideo(index)} 
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Documents</label>
                <label className="cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
                  <FileIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload files</span>
                  <input type="file" multiple onChange={handleEditFileUpload} className="hidden" />
                </label>
                {editFormData.files.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {editFormData.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg group">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{file.size}</p>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeEditFile(index)} 
                          className="text-red-500 hover:text-red-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                  Save Changes
                </button>
                <button type="button" onClick={cancelEdit} className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ✅ Display Items - FIXED with proper image URLs */}
        <div className="grid grid-cols-1 gap-6">
          {getCurrentData().map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(item)} className="text-blue-600 hover:text-blue-700 p-2" title="Edit">
                      <EditIcon className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this item?')) {
                          deleteAchievement(activeTab, item.id);
                        }
                      }} 
                      className="text-red-600 hover:text-red-700 p-2" 
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* ✅ Display Images - Using full URL */}
                {item.images && item.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {item.images.map((image, idx) => renderImage(image, idx, item.title))}
                  </div>
                )}

                {/* ✅ Display Videos - Using full URL */}
                {item.videos && item.videos.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {item.videos.map((video, idx) => (
                      <video 
                        key={idx} 
                        src={getFullFileUrl(video)} 
                        controls 
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          console.error(`Failed to load video: ${video}`);
                          (e.target as HTMLVideoElement).style.display = 'none';
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* ✅ Display Documents */}
                {item.documents && item.documents.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.documents.map((doc, idx) => renderDocument(doc, idx))}
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                    {item.category}
                  </span>
                  <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                    {item.year}
                  </span>
                  {item.organization && (
                    <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                      {item.organization}
                    </span>
                  )}
                  {item.rank && (
                    <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                      Rank: {item.rank}
                    </span>
                  )}
                  {item.score && (
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      Score: {item.score}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}