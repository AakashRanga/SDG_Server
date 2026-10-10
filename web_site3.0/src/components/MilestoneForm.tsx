import React, { useState } from 'react';
import { PlusIcon } from 'lucide-react';
interface MilestoneFormProps {
  onSubmit: (milestone: {
    title: string;
    description: string;
    date: string;
    status: 'completed' | 'in-progress' | 'upcoming';
  }) => void;
}
export function MilestoneForm({
  onSubmit
}: MilestoneFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    status: 'upcoming' as 'completed' | 'in-progress' | 'upcoming'
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description && formData.date) {
      onSubmit(formData);
      setFormData({
        title: '',
        description: '',
        date: '',
        status: 'upcoming'
      });
    }
  };
  return <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
        Add Milestone
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input type="text" value={formData.title} onChange={e => setFormData({
          ...formData,
          title: e.target.value
        })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea value={formData.description} onChange={e => setFormData({
          ...formData,
          description: e.target.value
        })} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date *
          </label>
          <input type="date" value={formData.date} onChange={e => setFormData({
          ...formData,
          date: e.target.value
        })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select value={formData.status} onChange={e => setFormData({
          ...formData,
          status: e.target.value as 'completed' | 'in-progress' | 'upcoming'
        })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" required>
            <option value="upcoming">Upcoming</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-gradient-to-b from-purple-400 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Add Milestone
        </button>
      </form>
    </div>;
}