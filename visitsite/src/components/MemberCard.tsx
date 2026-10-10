import React, { useState } from 'react';
import { MailIcon, PhoneIcon, TrashIcon, UserIcon, EditIcon, SaveIcon, XIcon, CameraIcon } from 'lucide-react';
import { Member } from '../pages/GreenOffice';

interface MemberCardProps {
  member: Member;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedMember: Member) => void;
}

export function MemberCard({
  member,
  onDelete,
  onUpdate
}: MemberCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMember, setEditedMember] = useState<Member>({ ...member });
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedMember({ ...member });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedMember({ ...member });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append('name', editedMember.name);
      formData.append('position', editedMember.position);
      formData.append('email', editedMember.email || '');
      formData.append('phone', editedMember.phone || '');

      // Get the file input element
      const fileInput = document.getElementById(`image-upload-${member.id}`) as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formData.append('image', fileInput.files[0]);
      }

      console.log('🔄 Updating member:', member.id);
      console.log('📤 FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value);
      }

      // USE ABSOLUTE URL with port 8006
      const response = await fetch(`http://180.235.121.250:8006/api/green-office/members/${member.id}`, {
        method: 'PUT',
        body: formData,
      });

      console.log('📥 Response status:', response.status, response.statusText);

      // Check if response has content before trying to parse JSON
      const contentType = response.headers.get('content-type');
      let result;
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.log('📥 Non-JSON response:', text);
        throw new Error(`Server returned ${response.status}: ${text || 'No content'}`);
      }

      if (response.ok) {
        console.log('✅ Member updated successfully:', result);
        // The server returns { success: true, data: updatedMember }
        if (result.data) {
          onUpdate(member.id, result.data);
        } else {
          // Fallback: if server returns the member directly
          onUpdate(member.id, result);
        }
        setIsEditing(false);
      } else {
        throw new Error(result.error || result.message || `Failed to update member: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error updating member:', error);
      alert(error.message || 'Failed to update member. Please try again.');
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
      setEditedMember(prev => ({
        ...prev,
        image: previewUrl
      }));
    }
  };

  const handleRemoveImage = () => {
    setEditedMember(prev => ({
      ...prev,
      image: ''
    }));
    
    // Also clear the file input
    const fileInput = document.getElementById(`image-upload-${member.id}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-blue-500">
        <div className="relative">
          {editedMember.image ? (
            <div className="relative">
              <img 
                src={editedMember.image} 
                alt={editedMember.name} 
                className="w-full h-48 object-cover" 
              />
              <button 
                onClick={handleRemoveImage}
                className="absolute top-2 left-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                disabled={isLoading}
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <UserIcon className="w-20 h-20 text-white" />
            </div>
          )}
          
          <div className="absolute top-2 right-2 flex gap-2">
            <button 
              onClick={handleSave}
              disabled={isLoading}
              className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <SaveIcon className="w-4 h-4" />
              )}
            </button>
            <button 
              onClick={handleCancel}
              disabled={isLoading}
              className="bg-gray-500 text-white p-2 rounded-full hover:bg-gray-600 transition-colors shadow-lg disabled:opacity-50"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Image Upload Button */}
          <div className="absolute bottom-2 right-2">
            <label htmlFor={`image-upload-${member.id}`} className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors shadow-lg cursor-pointer inline-block disabled:opacity-50">
              <CameraIcon className="w-4 h-4" />
            </label>
            <input
              id={`image-upload-${member.id}`}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={editedMember.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="Enter name"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
            <input
              type="text"
              value={editedMember.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="Enter position"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={editedMember.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="Enter email"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={editedMember.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="Enter phone number"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative">
        {member.image ? (
          <img src={member.image} alt={member.name} className="w-full h-48 object-cover" />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <UserIcon className="w-20 h-20 text-white" />
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          <button 
            onClick={handleEdit}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors shadow-lg"
          >
            <EditIcon className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(member.id)}
            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
        <p className="text-blue-600 font-medium mb-3">{member.position}</p>
        {member.email && (
          <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
            <MailIcon className="w-4 h-4" />
            <span>{member.email}</span>
          </div>
        )}
        {member.phone && (
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <PhoneIcon className="w-4 h-4" />
            <span>{member.phone}</span>
          </div>
        )}
      </div>
    </div>
  );
}