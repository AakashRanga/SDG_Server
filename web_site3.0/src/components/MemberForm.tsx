import React, { useState } from 'react';
import { PlusIcon, UploadIcon } from 'lucide-react';

interface MemberFormProps {
  onSubmit: (member: {
    name: string;
    position: string;
    email: string;
    phone: string;
  }, imageFile?: File) => void;
}

export function MemberForm({ onSubmit }: MemberFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    phone: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview for display only
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.position) {
      // Pass the File object, not base64 string
      onSubmit(formData, imageFile || undefined);
      
      // Reset form
      setFormData({
        name: '',
        position: '',
        email: '',
        phone: ''
      });
      setImageFile(null);
      setImagePreview('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Member</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Image
          </label>
          <div className="flex flex-col items-center gap-4">
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200" 
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                <UploadIcon className="w-12 h-12 text-gray-400" />
              </div>
            )}
            <label className="cursor-pointer bg-gradient-to-b from-blue-400 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="hidden" 
              />
              Choose Image
            </label>
            {imageFile && (
              <div className="text-sm text-green-600">
                ✅ Selected: {imageFile.name}
              </div>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input 
            type="text" 
            value={formData.name} 
            onChange={e => setFormData({
              ...formData,
              name: e.target.value
            })} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Position *
          </label>
          <input 
            type="text" 
            value={formData.position} 
            onChange={e => setFormData({
              ...formData,
              position: e.target.value
            })} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input 
            type="email" 
            value={formData.email} 
            onChange={e => setFormData({
              ...formData,
              email: e.target.value
            })} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input 
            type="tel" 
            value={formData.phone} 
            onChange={e => setFormData({
              ...formData,
              phone: e.target.value
            })} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-gradient-to-b from-green-400 to-green-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Add Member
        </button>
      </form>
    </div>
  );
}