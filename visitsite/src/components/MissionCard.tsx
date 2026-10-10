// components/MissionCard.tsx
import React, { useState } from 'react';
import { TrashIcon, TargetIcon, EditIcon, SaveIcon, XIcon } from 'lucide-react';
import { Mission } from '../pages/GreenOffice';

interface MissionCardProps {
  mission: Mission;
  onDelete: (id: string) => void;
  onUpdate: (id: string, mission: Partial<Mission>) => void;
}

export function MissionCard({
  mission,
  onDelete,
  onUpdate
}: MissionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMission, setEditedMission] = useState<Mission>(mission);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditClick = () => {
    setEditedMission(mission);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedMission(mission);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editedMission.title.trim() || !editedMission.description.trim()) {
      alert('Title and description are required');
      return;
    }

    setIsLoading(true);
    try {
      // Call onUpdate with the correct signature: (id, partialMission)
      await onUpdate(mission.id, {
        title: editedMission.title,
        description: editedMission.description
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating mission:', error);
      alert('Error updating mission. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof Mission, value: string) => {
    setEditedMission(prev => ({
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
              <TargetIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0 space-y-3">
              <input
                type="text"
                value={editedMission.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full text-lg sm:text-xl font-bold text-gray-800 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mission title"
              />
              <textarea
                value={editedMission.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full text-sm sm:text-base text-gray-600 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Mission description"
                rows={3}
              />
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
            disabled={isLoading || !editedMission.title.trim() || !editedMission.description.trim()}
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
          <div className="bg-emerald-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
            <TargetIcon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              {mission.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {mission.description}
            </p>
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
            onClick={() => onDelete(mission.id)} 
            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}