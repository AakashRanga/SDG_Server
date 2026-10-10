import React, { useState } from 'react';
import { TrashIcon, UserIcon, EditIcon, SaveIcon, XIcon, UploadIcon } from 'lucide-react';
import { Member } from '../pages/GreenOffice';

interface StudentCouncilMemberCardProps {
  member: Member;
  onDelete: (id: string) => void;
  onUpdate: (id: string, memberData: Partial<Member>, imageFile?: File) => void;
}

export function StudentCouncilMemberCard({
  member,
  onDelete,
  onUpdate
}: StudentCouncilMemberCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMember, setEditedMember] = useState<Member>(member);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(member.image || '');

  const handleEditClick = () => {
    setEditedMember(member);
    setImagePreview(member.image || '');
    setImageFile(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedMember(member);
    setImagePreview(member.image || '');
    setImageFile(null);
    setIsEditing(false);
  };

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

  const handleSave = async () => {
    if (!editedMember.name.trim() || !editedMember.position.trim()) {
      alert('Name and position are required');
      return;
    }

    setIsLoading(true);
    try {
      await onUpdate(member.id, {
        name: editedMember.name,
        position: editedMember.position,
        email: editedMember.email,
        phone: editedMember.phone
      }, imageFile || undefined);
      
      setIsEditing(false);
      setImageFile(null);
    } catch (error) {
      console.error('Error updating member:', error);
      alert('Error updating member. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof Member, value: string) => {
    setEditedMember(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-500">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-20 h-20 rounded-full object-cover border-4 border-blue-200" 
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <label className="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition-colors">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden" 
                />
                Change Photo
              </label>
            </div>
            
            <div className="flex-1 space-y-3">
              <input
                type="text"
                value={editedMember.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full text-lg font-bold text-gray-800 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Member name"
              />
              <input
                type="text"
                value={editedMember.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className="w-full text-gray-600 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Position"
              />
              <input
                type="email"
                value={editedMember.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full text-gray-600 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email"
              />
              <input
                type="tel"
                value={editedMember.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full text-gray-600 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Phone"
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
            disabled={isLoading || !editedMember.name.trim() || !editedMember.position.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="flex-shrink-0">
            {member.image ? (
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-200" 
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-blue-600" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              {member.name}
            </h3>
            <p className="text-blue-600 font-medium mb-2">
              {member.position}
            </p>
            {member.email && (
              <p className="text-sm text-gray-600 mb-1">
                📧 {member.email}
              </p>
            )}
            {member.phone && (
              <p className="text-sm text-gray-600">
                📞 {member.phone}
              </p>
            )}
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
            onClick={() => onDelete(member.id)} 
            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}