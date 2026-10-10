import React, { useState } from 'react';
import { PlusIcon, UploadIcon, XIcon, FileIcon } from 'lucide-react';
import { EnvironmentDataItem } from '../contexts/EnvironmentContext';
interface EnvironmentDataFormProps {
  onSubmit: (item: Omit<EnvironmentDataItem, 'id'>) => void;
  showValue?: boolean;
  showYear?: boolean;
  showStatus?: boolean;
}
export function EnvironmentDataForm({
  onSubmit,
  showValue = false,
  showYear = true,
  showStatus = true
}: EnvironmentDataFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    value: '',
    unit: '',
    year: new Date().getFullYear().toString(),
    status: 'active' as 'active' | 'planned' | 'completed',
    images: [] as string[],
    files: [] as Array<{
      name: string;
      url: string;
      size: string;
    }>
  });
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
  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description) {
      onSubmit(formData);
      setFormData({
        title: '',
        description: '',
        value: '',
        unit: '',
        year: new Date().getFullYear().toString(),
        status: 'active',
        images: [],
        files: []
      });
    }
  };
  return <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Entry</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input type="text" value={formData.title} onChange={e => setFormData({
          ...formData,
          title: e.target.value
        })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea value={formData.description} onChange={e => setFormData({
          ...formData,
          description: e.target.value
        })} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images
          </label>
          <label className="cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
            <UploadIcon className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">
              Click to upload images
            </span>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
          </label>
          {formData.images.length > 0 && <div className="grid grid-cols-2 gap-2 mt-3">
              {formData.images.map((image, index) => <div key={index} className="relative group">
                  <img src={image} alt={`Upload ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>)}
            </div>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Files (PDFs, Documents)
          </label>
          <label className="cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
            <FileIcon className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">Click to upload files</span>
            <input type="file" multiple onChange={handleFileUpload} className="hidden" />
          </label>
          {formData.files.length > 0 && <div className="space-y-2 mt-3">
              {formData.files.map((file, index) => <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg group">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">{file.size}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>)}
            </div>}
        </div>
        {showValue && <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value
              </label>
              <input type="text" value={formData.value} onChange={e => setFormData({
            ...formData,
            value: e.target.value
          })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit
              </label>
              <input type="text" value={formData.unit} onChange={e => setFormData({
            ...formData,
            unit: e.target.value
          })} placeholder="e.g., MW, %, acres" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
            </div>
          </div>}
        {showYear && <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <input type="text" value={formData.year} onChange={e => setFormData({
          ...formData,
          year: e.target.value
        })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          </div>}
        {showStatus && <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select value={formData.status} onChange={e => setFormData({
          ...formData,
          status: e.target.value as 'active' | 'planned' | 'completed'
        })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="active">Active</option>
              <option value="planned">Planned</option>
              <option value="completed">Completed</option>
            </select>
          </div>}
        <button type="submit" className="w-full bg-gradient-to-b from-green-400 to-green-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Add Entry
        </button>
      </form>
    </div>;
}