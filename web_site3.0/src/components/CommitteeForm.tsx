import React, { useState } from 'react';
import { PlusIcon } from 'lucide-react';
interface CommitteeFormProps {
  onSubmit: (committee: {
    name: string;
    description: string;
  }) => void;
}
export function CommitteeForm({
  onSubmit
}: CommitteeFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.description) {
      onSubmit(formData);
      setFormData({
        name: '',
        description: ''
      });
    }
  };
  return <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Add New Committee
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Committee Name *
          </label>
          <input type="text" value={formData.name} onChange={e => setFormData({
          ...formData,
          name: e.target.value
        })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., Sustainability Committee" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea value={formData.description} onChange={e => setFormData({
          ...formData,
          description: e.target.value
        })} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-500 focus:border-transparent resize-none" placeholder="Describe the committee's purpose and responsibilities" required />
        </div>
        <button type="submit" className="w-full bg-gradient-to-b from-green-400 to-green-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Add Committee
        </button>
      </form>
    </div>;
}