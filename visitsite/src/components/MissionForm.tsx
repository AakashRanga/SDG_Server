import React, { useState } from 'react';
import { PlusIcon } from 'lucide-react';
interface MissionFormProps {
  onSubmit: (mission: {
    title: string;
    description: string;
  }) => void;
}
export function MissionForm({
  onSubmit
}: MissionFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description) {
      onSubmit(formData);
      setFormData({
        title: '',
        description: ''
      });
    }
  };
  return <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
        Add Mission Statement
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input type="text" value={formData.title} onChange={e => setFormData({
          ...formData,
          title: e.target.value
        })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea value={formData.description} onChange={e => setFormData({
          ...formData,
          description: e.target.value
        })} rows={6} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none" required />
        </div>
        <button type="submit" className="w-full bg-gradient-to-b from-emerald-400 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Add Mission
        </button>
      </form>
    </div>;
}