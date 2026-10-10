// CommitteeMemberCard.tsx
import React, { useState } from 'react';
import { TrashIcon, EditIcon, MailIcon, PhoneIcon } from 'lucide-react';
import { Member } from '../types';
import { useGovernance } from '../contexts/GovernanceContext';

interface CommitteeMemberCardProps {
  committeeId: string;
  member: Member;
  onDelete: (committeeId: string, memberId: string) => void;
  onUpdate: (committeeId: string, memberId: string, memberData: Partial<Member>, imageFile?: File) => void;
}

export function CommitteeMemberCard({
  committeeId,
  member,
  onDelete,
  onUpdate,
}: CommitteeMemberCardProps) {
  const { getImageUrl } = useGovernance();
  const [isEditing, setIsEditing] = useState(false);
  const [editedMember, setEditedMember] = useState<Member>({ ...member });
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(getImageUrl(member.image));

  const handleEditClick = () => {
    setEditedMember({ ...member });
    setImagePreview(getImageUrl(member.image));
    setImageFile(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!editedMember.name?.trim() || !editedMember.position?.trim()) {
      alert('Name and position are required');
      return;
    }

    setIsLoading(true);
    try {
      await onUpdate(
        committeeId,
        member.id,
        {
          name: editedMember.name.trim(),
          position: editedMember.position.trim(),
          email: editedMember.email?.trim() || '',
          phone: editedMember.phone?.trim() || '',
        },
        imageFile || undefined
      );
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating member:', error);
      alert('Failed to update member. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${member.name}?`)) {
      onDelete(committeeId, member.id);
    }
  };

  // Safely get image URL for display
  const getSafeImageUrl = (imagePath: string | undefined): string => {
    try {
      return getImageUrl(imagePath || '');
    } catch (error) {
      console.error('Error getting image URL:', error);
      return '/default-avatar.png';
    }
  };

  // Editing Mode
  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md border-2 border-green-500 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Edit Member
        </h3>
        <div className="space-y-4">
          {/* Image Upload in Edit Mode - Centered */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-green-300 mb-3">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/default-avatar.png';
                }}
              />
            </div>
            <label className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm">
              Change Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {imageFile && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Selected: {imageFile.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={editedMember.name || ''}
              onChange={(e) => setEditedMember({ ...editedMember, name: e.target.value })}
              placeholder="Enter full name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position *
            </label>
            <input
              type="text"
              value={editedMember.position || ''}
              onChange={(e) => setEditedMember({ ...editedMember, position: e.target.value })}
              placeholder="Enter position"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={editedMember.email || ''}
              onChange={(e) => setEditedMember({ ...editedMember, email: e.target.value })}
              placeholder="Enter email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={editedMember.phone || ''}
              onChange={(e) => setEditedMember({ ...editedMember, phone: e.target.value })}
              placeholder="Enter phone number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={isLoading || !editedMember.name?.trim() || !editedMember.position?.trim()}
              className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 disabled:opacity-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Display Mode - New Layout
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6">
      {/* Action Buttons - Top Right */}
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={handleEditClick}
          className="text-blue-500 hover:text-blue-600 transition-colors p-1"
          title="Edit member"
        >
          <EditIcon className="w-5 h-5" />
        </button>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-600 transition-colors p-1"
          title="Delete member"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Photo - Centered */}
      <div className="flex justify-center mb-4">
        <img
          src={getSafeImageUrl(member.image)}
          alt={member.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-green-200"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/default-avatar.png';
          }}
        />
      </div>

      {/* Member Information - Centered */}
      <div className="text-center space-y-3">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
          <p className="text-lg text-gray-600 font-medium">{member.position}</p>
        </div>

        {/* Contact Information */}
        <div className="space-y-2">
          {member.email && (
            <div className="flex items-center justify-center text-gray-500">
              <MailIcon className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">{member.email}</span>
            </div>
          )}
          {member.phone && (
            <div className="flex items-center justify-center text-gray-500">
              <PhoneIcon className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">{member.phone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}