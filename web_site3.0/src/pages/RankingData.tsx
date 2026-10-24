import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRankingData, RankingDataItem } from '../contexts/RankingDataContext';
import {
  ArrowLeftIcon,
  UploadIcon,
  FileTextIcon,
  TrophyIcon,
  TargetIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  EyeIcon,
  PencilIcon,
  XIcon,
  EyeOffIcon,
  DownloadIcon,
  ExternalLinkIcon
} from 'lucide-react';

const RANKING_QUESTIONS = {
  'THE Impact Rankings': ["What is your institution's total Scope 1 and 2 CO2-equivalent emissions?", "What is your institution's total energy consumption?", 'What percentage of your energy comes from renewable sources?', 'Does your institution have a climate action plan?', 'What waste management policies does your institution have?', 'What water conservation measures are in place?', 'Does your institution have policies on sustainable procurement?', 'What biodiversity conservation measures are implemented?'],
  'QS Sustainability': ['Environmental impact reduction initiatives', 'Sustainability research output and citations', 'Proportion of sustainability-focused courses', 'Student and staff engagement in sustainability', 'Sustainable campus operations and infrastructure', 'Community outreach and partnerships for sustainability', 'Governance and reporting on sustainability', 'Carbon neutrality and emissions reduction targets'],
  'Green Metrics': ['Setting and Infrastructure (SI)', 'Energy and Climate Change (EC)', 'Waste Management (WS)', 'Water Usage (WR)', 'Transportation (TR)', 'Education and Research (ED)', 'Green Campus Policy and Management', 'Community Engagement and Social Responsibility']
};

const SDG_OPTIONS = Array.from({ length: 17 }, (_, i) => i + 1);

export function RankingData() {
  const navigate = useNavigate();
  const {
    addRankingData,
    rankingData,
    deleteRankingData,
    editRankingData,
    toggleVisibility,
    downloadFile,
    viewFile
  } = useRankingData();

  const [formData, setFormData] = useState({
    rankingName: '' as 'THE Impact Rankings' | 'QS Sustainability' | 'Green Metrics' | '',
    sdgNumber: 0,
    criteriaName: '',
    question: '',
    year: new Date().getFullYear().toString()
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [editingItem, setEditingItem] = useState<RankingDataItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const editFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setUploadStatus('idle');
    } else {
      alert('Please select a PDF file only');
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.rankingName || !formData.sdgNumber || !formData.criteriaName || !formData.question || !selectedFile) {
      alert('Please fill in all fields and select a PDF file');
      return;
    }

    setUploadStatus('idle');
    try {
      await addRankingData({
        rankingName: formData.rankingName,
        sdgNumber: formData.sdgNumber,
        criteriaName: formData.criteriaName,
        question: formData.question,
        file: selectedFile,
        fileUrl: '',
        fileName: selectedFile.name,
        fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
        year: formData.year
      });

      setUploadStatus('success');

      // Clear form and file input
      if (fileInputRef.current) fileInputRef.current.value = '';
      setFormData({
        rankingName: '',
        sdgNumber: 0,
        criteriaName: '',
        question: '',
        year: new Date().getFullYear().toString()
      });
      setSelectedFile(null);
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadStatus('error');
      alert('Upload failed. Please try again.');
    } finally {
      setTimeout(() => setUploadStatus('idle'), 3000);
    }
  };

  const handleEditClick = (item: RankingDataItem) => {
    setEditingItem(item);
    setEditFile(null);
    setIsEditModalOpen(true);
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setEditFile(file);
    } else {
      alert('Please select a PDF file only');
      e.target.value = '';
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      if (editFile) {
        // Update with new file
        await editRankingData(editingItem.id, {
          rankingName: editingItem.rankingName,
          sdgNumber: editingItem.sdgNumber,
          criteriaName: editingItem.criteriaName,
          question: editingItem.question,
          file: editFile,
          year: editingItem.year,
          isVisible: editingItem.isVisible
        });
      } else {
        // Update without changing file
        await editRankingData(editingItem.id, {
          rankingName: editingItem.rankingName,
          sdgNumber: editingItem.sdgNumber,
          criteriaName: editingItem.criteriaName,
          question: editingItem.question,
          year: editingItem.year,
          isVisible: editingItem.isVisible
        });
      }

      if (editFileInputRef.current) editFileInputRef.current.value = '';
    } catch (err) {
      console.error('Edit failed:', err);
      alert('Edit failed. Please try again.');
    } finally {
      setIsEditModalOpen(false);
      setEditingItem(null);
      setEditFile(null);
    }
  };

  // Fixed: Single handleView function
  const handleView = (item: RankingDataItem) => {
    console.log('Item for viewing:', item);

    if (!item.fileUrl && !item.fileName) {
      console.error('No file URL or filename available');
      return;
    }

    // Use fileUrl if available, otherwise construct from fileName
    let viewUrl = item.fileUrl;

    if (!viewUrl && item.fileName) {
      // Construct the URL from fileName
      viewUrl = `/uploads/ranking-data/${item.fileName}`;
    }

    console.log('View URL:', viewUrl);

    if (viewUrl) {
      viewFile(viewUrl);
    } else {
      console.error('Could not construct view URL');
      alert('File URL not available');
    }
  };

  // Fixed: Single handleDownload function
  const handleDownload = async (item: RankingDataItem) => {
    if (!item.fileName) {
      alert('File not available for download');
      return;
    }

    setIsDownloading(item.id);
    try {
      // Extract just the filename for the API download endpoint
      const filename = extractFilename(item.fileName);
      console.log('🔍 Download details:', {
        itemFileName: item.fileName,
        extractedFilename: filename,
        originalFileName: item.originalFileName,
        fileUrl: item.fileUrl,
        downloadUrl: `http://180.235.121.250:8006/api/ranking-data/download/${filename}`, // Log the exact URL being used
        staticUrl: `http://180.235.121.250:8006/uploads/ranking-data/${filename}` // Log the static URL for comparison
      });

      await downloadFile(filename, item.originalFileName);
      console.log('✅ Download successful');
    } catch (err) {
      console.error('❌ Download failed:', err);

      // Try to open the file as fallback
      try {
        const filename = extractFilename(item.fileName);
        viewFile(`/uploads/ranking-data/${filename}`);
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
        alert('Download failed. The file may not exist on the server.');
      }
    } finally {
      setIsDownloading(null);
    }
  };

  // Helper function to extract filename from path
  const extractFilename = (filePath: string) => {
    if (!filePath) return '';
    const parts = filePath.split('/');
    return parts[parts.length - 1];
  };

  const getFileNameFromUrl = (url: string) => {
    if (!url) return 'No file';
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white hover:text-purple-100 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/ranking-data/site')}
              className="flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors shadow-lg"
            >
              <EyeIcon className="w-5 h-5" />
              Visit Site
            </button>
          </div>
          <div className="flex items-center gap-4 mt-6">
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
              <TrophyIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Ranking Data Collection
              </h1>
              <p className="text-purple-100">
                Upload sustainability ranking documentation by SDG
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <UploadIcon className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Upload Ranking Data
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Ranking Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Ranking
                </label>
                <select
                  value={formData.rankingName}
                  onChange={e => setFormData({
                    ...formData,
                    rankingName: e.target.value as any
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  required
                >
                  <option value="">Choose a ranking...</option>
                  <option value="THE Impact Rankings">THE Impact Rankings</option>
                  <option value="QS Sustainability">QS Sustainability</option>
                  <option value="Green Metrics">Green Metrics</option>
                </select>
              </div>

              {/* SDG Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select SDG Number
                </label>
                <select
                  value={formData.sdgNumber}
                  onChange={e => setFormData({
                    ...formData,
                    sdgNumber: parseInt(e.target.value)
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  required
                >
                  <option value={0}>Choose an SDG...</option>
                  {SDG_OPTIONS.map(sdg => (
                    <option key={sdg} value={sdg}>
                      SDG {sdg}
                    </option>
                  ))}
                </select>
              </div>

              {/* Criteria Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Criteria Name
                </label>
                <input
                  type="text"
                  value={formData.criteriaName}
                  onChange={e => setFormData({
                    ...formData,
                    criteriaName: e.target.value
                  })}
                  placeholder="e.g., Carbon Emissions Measurement"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  required
                />
              </div>

              {/* Question Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter Question
                </label>
                <textarea
                  value={formData.question}
                  onChange={e => setFormData({
                    ...formData,
                    question: e.target.value
                  })}
                  placeholder="Enter the ranking question or criteria..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
                  required
                />
              </div>

              {/* Year Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Year
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={e => setFormData({
                    ...formData,
                    year: e.target.value
                  })}
                  min="2020"
                  max="2030"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  required
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload PDF Document
                </label>
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-purple-50 file:text-purple-700 file:font-semibold hover:file:bg-purple-100"
                    required
                  />
                </div>
                {selectedFile && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <FileTextIcon className="w-4 h-4" />
                    <span>{selectedFile.name}</span>
                    <span className="text-gray-400">
                      ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={uploadStatus === 'success'}
              >
                {uploadStatus === 'success' ? 'Uploaded Successfully!' : 'Upload Document'}
              </button>

              {/* Status Messages */}
              {uploadStatus === 'success' && (
                <div className="flex items-center gap-2 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-semibold">
                    Document uploaded successfully!
                  </span>
                </div>
              )}

              {uploadStatus === 'error' && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                  <XCircleIcon className="w-5 h-5 text-red-600" />
                  <span className="text-red-700 font-semibold">
                    Upload failed. Please try again.
                  </span>
                </div>
              )}
            </form>
          </div>

          {/* Recent Uploads */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Uploads
              </h2>
              <button
                onClick={() => navigate('/ranking-data/site')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                View All Data
              </button>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {rankingData.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <FileTextIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No documents uploaded yet</p>
                </div>
              ) : (
                rankingData.slice().reverse().map(item => (
                  <div key={item.id} className="p-4 border-2 border-gray-100 rounded-xl hover:border-purple-200 transition-all">

                    {/* Row 1: Badges + Icons */}
                    <div className="flex items-center justify-between mb-2 gap-2">
                      {/* Badges */}
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                          {item.rankingName}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          SDG {item.sdgNumber}
                        </span>
                        {!item.isVisible && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold flex items-center gap-1">
                            <EyeOffIcon className="w-3 h-3" />
                            
                          </span>
                        )}
                      </div>

                      {/* Action Icons */}
                      <div className="flex gap-1">
                        {item.fileName && (
                          <button
                            onClick={() => handleView(item)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="View document"
                          >
                            <ExternalLinkIcon className="w-5 h-5" />
                          </button>
                        )}
                        {item.fileName && (
                          <button
                            onClick={() => handleDownload(item)}
                            disabled={isDownloading === item.id}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Download document"
                          >
                            {isDownloading === item.id ? (
                              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <DownloadIcon className="w-5 h-5" />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => toggleVisibility(item.id)}
                          className={`p-2 rounded-lg transition-colors ${item.isVisible ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'
                            }`}
                          title={item.isVisible ? 'Hide from site' : 'Show on site'}
                        >
                          {item.isVisible ? <EyeIcon className="w-5 h-5" /> : <EyeOffIcon className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => handleEditClick(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit document"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteRankingData(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete document"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Row 2: Criteria, Question, File info */}
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-gray-800">{item.criteriaName}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{item.question}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <span>{getFileNameFromUrl(item.fileName)}</span>
                        <span>{item.fileSize}</span>
                        <span>{item.uploadDate}</span>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">
                Edit Document
              </h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingItem(null);
                  setEditFile(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Ranking
                </label>
                <select
                  value={editingItem.rankingName}
                  onChange={e => setEditingItem({
                    ...editingItem,
                    rankingName: e.target.value as any
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  required
                >
                  <option value="THE Impact Rankings">THE Impact Rankings</option>
                  <option value="QS Sustainability">QS Sustainability</option>
                  <option value="Green Metrics">Green Metrics</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select SDG Number
                </label>
                <select
                  value={editingItem.sdgNumber}
                  onChange={e => setEditingItem({
                    ...editingItem,
                    sdgNumber: parseInt(e.target.value)
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  required
                >
                  {SDG_OPTIONS.map(sdg => (
                    <option key={sdg} value={sdg}>
                      SDG {sdg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Criteria Name
                </label>
                <input
                  type="text"
                  value={editingItem.criteriaName}
                  onChange={e => setEditingItem({
                    ...editingItem,
                    criteriaName: e.target.value
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Question
                </label>
                <textarea
                  value={editingItem.question}
                  onChange={e => setEditingItem({
                    ...editingItem,
                    question: e.target.value
                  })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Year
                </label>
                <input
                  type="number"
                  value={editingItem.year}
                  onChange={e => setEditingItem({
                    ...editingItem,
                    year: e.target.value
                  })}
                  min="2020"
                  max="2030"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  required
                />
              </div>

              {/* Replace Document Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Replace PDF Document (Optional)
                </label>

                {/* Current File Info */}
                <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 text-sm">
                    <FileTextIcon className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-700">
                      Current file:
                    </span>
                    <span className="text-gray-600">
                      {getFileNameFromUrl(editingItem.fileName)}
                    </span>
                    <span className="text-gray-400">
                      ({editingItem.fileSize})
                    </span>
                  </div>
                </div>

                {/* New File Upload */}
                <div className="relative">
                  <input
                    ref={editFileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleEditFileChange}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-purple-50 file:text-purple-700 file:font-semibold hover:file:bg-purple-100"
                  />
                </div>

                {editFile && (
                  <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-700">
                        New file selected:
                      </span>
                      <span className="text-green-600">{editFile.name}</span>
                      <span className="text-green-400">
                        ({(editFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingItem(null);
                    setEditFile(null);
                  }}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}