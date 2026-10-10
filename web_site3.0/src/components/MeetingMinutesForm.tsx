import React, { useState } from 'react';
import { PlusIcon } from 'lucide-react';
interface MeetingMinutesFormProps {
  onSubmit: (minutes: {
    title: string;
    date: string;
    content: string;
  }) => void;
}
export function MeetingMinutesForm({
  onSubmit
}: MeetingMinutesFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    content: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.date && formData.content) {
      onSubmit(formData);
      setFormData({
        title: '',
        date: '',
        content: ''
      });
    }
  };
  return <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
        Upload Meeting Minutes
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meeting Title *
          </label>
          <input type="text" value={formData.title} onChange={e => setFormData({
          ...formData,
          title: e.target.value
        })} placeholder="e.g., Monthly Committee Meeting - January 2024" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meeting Date *
          </label>
          <input type="date" value={formData.date} onChange={e => setFormData({
          ...formData,
          date: e.target.value
        })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meeting Minutes *
          </label>
          <textarea value={formData.content} onChange={e => setFormData({
          ...formData,
          content: e.target.value
        })} rows={10} placeholder="Enter the meeting minutes, agenda items, decisions made, and action items..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" required />
        </div>
        <button type="submit" className="w-full bg-gradient-to-b from-blue-400 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Upload Minutes
        </button>
      </form>
    </div>;
}