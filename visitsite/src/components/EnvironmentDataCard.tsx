import React, { createElement, useState } from 'react';
import { 
  Trash2Icon, 
  CalendarIcon, 
  TrendingUpIcon, 
  FileIcon, 
  DownloadIcon, 
  ImageIcon, 
  EditIcon,
  SaveIcon,
  XIcon 
} from 'lucide-react';
import { EnvironmentDataItem } from '../contexts/EnvironmentContext';

interface EnvironmentDataCardProps {
  item: EnvironmentDataItem;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedItem: EnvironmentDataItem) => void;
  color?: string;
  category: string;
}

export function EnvironmentDataCard({
  item,
  onDelete,
  onUpdate,
  color = 'green',
  category
}: EnvironmentDataCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<EnvironmentDataItem>(item);
  const [isLoading, setIsLoading] = useState(false);

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    planned: 'bg-blue-100 text-blue-700',
    completed: 'bg-gray-100 text-gray-700'
  };

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'planned', label: 'Planned' },
    { value: 'completed', label: 'Completed' }
  ];

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  };

  // API call to delete item
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8006/api/environment/energy-climate/${toKebabCase(category)}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseText = await response.text();
      let result;
      
      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      if (result.success) {
        onDelete(id);
      } else {
        throw new Error(result.error || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert(`Failed to delete item: ${error.message}`);
    }
  };

  // API call to update item
  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Prepare the data for API
      const updateData = {
        title: editedItem.title,
        description: editedItem.description,
        value: editedItem.value || null,
        unit: editedItem.unit || null,
        year: editedItem.year || null,
        status: editedItem.status || null,
        images: editedItem.images || [],
        files: editedItem.files || []
      };
      console.log("EnvironmentDataCard category:", category);
      console.log('Sending update data:', updateData);
      console.log('URL:', `/api/environment/energy-climate/${category}/${item.id}`);

    const response = await fetch(
              `http://180.235.121.250:8006/api/environment/energy-climate/${toKebabCase(category)}/${item.id}`,
              {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData),
              }
            );

      // First, get the response as text to handle empty responses
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      console.log('Response status:', response.status);

      let result;
      
      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        console.error('Raw response was:', responseText);
        throw new Error('Server returned invalid JSON response');
      }

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      if (result.success) {
        onUpdate(item.id, result.data);
        setIsEditing(false);
        console.log('Item updated successfully');
      } else {
        throw new Error(result.error || 'Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      alert(`Failed to update item: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedItem(item);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof EnvironmentDataItem, value: any) => {
    setEditedItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
        {/* Edit Form Header */}
        <div className="flex items-start justify-between mb-4">
          <input
            type="text"
            value={editedItem.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="text-lg font-bold text-gray-800 flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter title"
          />
          <div className="flex items-center gap-2 ml-4">
            <button 
              onClick={handleSave}
              disabled={isLoading}
              className="text-green-600 hover:text-green-700 transition-colors p-1 disabled:opacity-50"
              title="Save changes"
            >
              <SaveIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={handleCancel}
              disabled={isLoading}
              className="text-gray-600 hover:text-gray-700 transition-colors p-1 disabled:opacity-50"
              title="Cancel editing"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Description Field */}
        <textarea
          value={editedItem.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full text-gray-600 mb-4 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
          placeholder="Enter description"
        />

        {/* Images Section (Read-only in edit mode) */}
        {item.images && item.images.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Images</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {item.images.map((image, index) => (
                <img 
                  key={index} 
                  src={image} 
                  alt={`${item.title} ${index + 1}`} 
                  className="w-full h-32 object-cover rounded-lg" 
                />
              ))}
            </div>
          </div>
        )}

        {/* Files Section (Read-only in edit mode) */}
        {item.files && item.files.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <FileIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Attached Files</span>
            </div>
            <div className="space-y-2">
              {item.files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{file.size}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDownload(file.url, file.name)} 
                    className="text-blue-600 hover:text-blue-700 p-1" 
                    title="Download file"
                  >
                    <DownloadIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Editable Fields */}
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Value and Unit */}
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={editedItem.value || ''}
              onChange={(e) => handleInputChange('value', e.target.value)}
              className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Value"
            />
            <input
              type="text"
              value={editedItem.unit || ''}
              onChange={(e) => handleInputChange('unit', e.target.value)}
              className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Unit"
            />
          </div>

          {/* Year */}
          <input
            type="number"
            value={editedItem.year || ''}
            onChange={(e) => handleInputChange('year', e.target.value ? parseInt(e.target.value) : '')}
            className="w-24 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Year"
            min="2000"
            max="2030"
          />

          {/* Status */}
          <select
            value={editedItem.status || ''}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Status</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || !editedItem.title || !editedItem.description}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    );
  }

  // Read-only view
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-800 flex-1">{item.title}</h3>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsEditing(true)}
            className="text-blue-500 hover:text-blue-700 transition-colors p-1"
            title="Edit item"
          >
            <EditIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleDelete(item.id)} 
            className="text-red-500 hover:text-red-700 transition-colors p-1"
            title="Delete item"
          >
            <Trash2Icon className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{item.description}</p>
      
      {/* Images */}
      {item.images && item.images.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Images</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {item.images.map((image, index) => (
              <img 
                key={index} 
                src={image} 
                alt={`${item.title} ${index + 1}`} 
                className="w-full h-32 object-cover rounded-lg" 
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Files */}
      {item.files && item.files.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <FileIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Attached Files
            </span>
          </div>
          <div className="space-y-2">
            {item.files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">{file.size}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDownload(file.url, file.name)} 
                  className="text-blue-600 hover:text-blue-700 p-1" 
                  title="Download file"
                >
                  <DownloadIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        {item.value && item.unit && (
          <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${color}-100 text-${color}-700 flex items-center gap-1`}>
            <TrendingUpIcon className="w-4 h-4" />
            {item.value} {item.unit}
          </span>
        )}
        
        {item.year && (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            {item.year}
          </span>
        )}
        
        {item.status && (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[item.status]}`}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </span>
        )}
      </div>
    </div>
  );
}
function toKebabCase(category: string) {
  return category
    .trim()
   
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
   
    .replace(/[\s_]+/g, '-')
  
    .replace(/[^a-zA-Z0-9-]/g, '')
   
    .replace(/-+/g, '-')
  
    .replace(/(^-|-$)/g, '')
    
    .toLowerCase();
}
