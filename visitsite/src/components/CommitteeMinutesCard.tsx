// CommitteeMinutesCard.tsx
import React, { useState } from 'react';
import { TrashIcon, EditIcon, SaveIcon, XIcon, FileTextIcon } from 'lucide-react';
import { MeetingMinutes } from '../types';

interface CommitteeMinutesCardProps {
  committeeId: string;
  minutes: MeetingMinutes;
  onUpdate: (committeeId: string, minutesId: string, minutesData: Partial<MeetingMinutes>) => void;
  onDelete: (committeeId: string, minutesId: string) => void;
}

export function CommitteeMinutesCard({
  committeeId,
  minutes,
  onUpdate,
  onDelete
}: CommitteeMinutesCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMinutes, setEditedMinutes] = useState<MeetingMinutes>({...minutes});
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!editedMinutes.title.trim() || !editedMinutes.date.trim() || !editedMinutes.content.trim()) {
      alert('Title, date, and content are required');
      return;
    }

    setIsLoading(true);
    try {
      await onUpdate(committeeId, minutes.id, {
        title: editedMinutes.title,
        date: editedMinutes.date,
        content: editedMinutes.content
      });
      setIsEditing(false);
    } catch (error) {
      // Error handling is done in the context
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedMinutes({...minutes});
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the meeting minutes "${minutes.title}"?`)) {
      onDelete(committeeId, minutes.id);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 border-2 border-green-500">
        <div className="space-y-3">
          <input
            type="text"
            value={editedMinutes.title}
            onChange={(e) => setEditedMinutes(prev => ({ ...prev, title: e.target.value }))}
            className="w-full font-bold text-gray-800 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Meeting title"
          />
          <input
            type="date"
            value={editedMinutes.date}
            onChange={(e) => setEditedMinutes(prev => ({ ...prev, date: e.target.value }))}
            className="w-full text-gray-600 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <textarea
            value={editedMinutes.content}
            onChange={(e) => setEditedMinutes(prev => ({ ...prev, content: e.target.value }))}
            rows={4}
            className="w-full text-gray-600 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            placeholder="Meeting content"
          />
        </div>
        <div className="flex justify-end gap-2 mt-3">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || !editedMinutes.title.trim() || !editedMinutes.date.trim() || !editedMinutes.content.trim()}
            className="px-3 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <FileTextIcon className="w-5 h-5 text-green-600" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-800 text-sm mb-1">
              {minutes.title}
            </h4>
            <p className="text-green-600 text-xs font-medium mb-1">
              {new Date(minutes.date).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-600 line-clamp-2">
              {minutes.content}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 flex-shrink-0">
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
            title="Edit minutes"
          >
            <EditIcon className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDelete}
            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
            title="Delete minutes"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}