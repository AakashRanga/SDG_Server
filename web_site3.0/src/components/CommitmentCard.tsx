import React, { useState } from 'react';
import { TrashIcon, FlagIcon, CalendarIcon, EditIcon, SaveIcon, XIcon } from 'lucide-react';
import { Commitment } from '../pages/GreenOffice';

interface CommitmentCardProps {
  commitment: Commitment;
  onDelete: (id: string) => void;
  onUpdate: (id: string, commitment: Partial<Commitment>) => void;
}

export function CommitmentCard({
  commitment,
  onDelete,
  onUpdate
}: CommitmentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCommitment, setEditedCommitment] = useState<Commitment>(commitment);
  const [isLoading, setIsLoading] = useState(false);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formatting date for input:', error);
      return dateString;
    }
  };

  // Get status color for display
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditClick = () => {
    console.log('🔄 Entering edit mode with commitment:', commitment);
    
    setEditedCommitment({
      ...commitment,
      targetDate: formatDateForInput(commitment.targetDate)
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedCommitment(commitment);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editedCommitment.title.trim() || !editedCommitment.description.trim() || !editedCommitment.targetDate || !editedCommitment.status) {
      alert('Title, description, target date, and status are required');
      return;
    }

    setIsLoading(true);
    try {
      const updateData = {
        title: editedCommitment.title,
        description: editedCommitment.description,
        targetDate: editedCommitment.targetDate,
        status: editedCommitment.status
      };

      console.log('📦 Sending payload to API:', updateData);

      await onUpdate(commitment.id, updateData);
      setIsEditing(false);
      console.log('✅ Commitment updated successfully');
    } catch (error) {
      console.error('❌ Error updating commitment:', error);
      alert(`Error updating commitment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof Commitment, value: string) => {
    setEditedCommitment(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-2 border-blue-500">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4 flex-1">
            <div className="bg-blue-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
              <FlagIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={editedCommitment.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full text-lg sm:text-xl font-bold text-gray-800 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Commitment title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={editedCommitment.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full text-sm sm:text-base text-gray-600 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Commitment description"
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Date *</label>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                    <input
                      type="date"
                      value={editedCommitment.targetDate}
                      onChange={(e) => handleInputChange('targetDate', e.target.value)}
                      className="w-full text-xs sm:text-sm text-gray-700 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <select
                    value={editedCommitment.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full text-xs sm:text-sm text-gray-700 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 flex-shrink-0">
            <button 
              onClick={handleSave}
              disabled={isLoading}
              className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed"
              title="Save changes"
            >
              <SaveIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={handleCancel}
              disabled={isLoading}
              className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              title="Cancel editing"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || !editedCommitment.title.trim() || !editedCommitment.description.trim() || !editedCommitment.targetDate || !editedCommitment.status}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 sm:gap-4 flex-1">
          <div className="bg-blue-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
            <FlagIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              {commitment.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-3 leading-relaxed">
              {commitment.description}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                <CalendarIcon className="w-4 h-4" />
                <span>Target: {formatDate(commitment.targetDate)}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(commitment.status)}`}>
                {commitment.status.charAt(0).toUpperCase() + commitment.status.slice(1).replace('-', ' ')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button 
            onClick={handleEditClick}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
            title="Edit commitment"
          >
            <EditIcon className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(commitment.id)} 
            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
            title="Delete commitment"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}