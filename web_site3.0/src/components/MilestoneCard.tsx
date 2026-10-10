// components/MilestoneCard.tsx
import React, { useState } from 'react';
import { TrashIcon, CalendarIcon, EditIcon, SaveIcon, XIcon } from 'lucide-react';
import { Milestone } from '../pages/GreenOffice';

interface MilestoneCardProps {
  milestone: Milestone;
  onDelete: (id: string) => void;
  onUpdate: (id: string, milestone: Partial<Milestone>) => void;
}

export function MilestoneCard({
  milestone,
  onDelete,
  onUpdate
}: MilestoneCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMilestone, setEditedMilestone] = useState<Milestone>(milestone);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditClick = () => {
    setEditedMilestone(milestone);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedMilestone(milestone);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editedMilestone.title.trim() || !editedMilestone.description.trim() || !editedMilestone.date) {
      alert('Title, description, and date are required');
      return;
    }

    setIsLoading(true);
    try {
      await onUpdate(milestone.id, {
        title: editedMilestone.title,
        description: editedMilestone.description,
        date: editedMilestone.date,
        status: editedMilestone.status
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating milestone:', error);
      alert('Error updating milestone. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof Milestone, value: string) => {
    setEditedMilestone(prev => ({
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
              <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0 space-y-3">
              <input
                type="text"
                value={editedMilestone.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full text-lg sm:text-xl font-bold text-gray-800 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Milestone title"
              />
              <textarea
                value={editedMilestone.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full text-sm sm:text-base text-gray-600 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Milestone description"
                rows={3}
              />
              <div className="flex gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <CalendarIcon className="w-4 h-4 text-gray-500" />
                  <input
                    type="date"
                    value={editedMilestone.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="text-xs sm:text-sm text-gray-700 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={editedMilestone.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="text-xs sm:text-sm text-gray-700 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 flex-shrink-0">
            <button 
              onClick={handleSave}
              disabled={isLoading}
              className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed"
            >
              <SaveIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={handleCancel}
              disabled={isLoading}
              className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
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
            disabled={isLoading || !editedMilestone.title.trim() || !editedMilestone.description.trim() || !editedMilestone.date}
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
            <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              {milestone.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-3 leading-relaxed">
              {milestone.description}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                <CalendarIcon className="w-4 h-4" />
                <span>{formatDate(milestone.date)}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1).replace('-', ' ')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button 
            onClick={handleEditClick}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <EditIcon className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(milestone.id)} 
            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}