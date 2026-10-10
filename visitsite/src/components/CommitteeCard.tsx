// CommitteeCard.tsx - Updated with safe function handling
import React, { useState } from 'react';
import { TrashIcon, ChevronDownIcon, ChevronUpIcon, UsersIcon, EditIcon, SaveIcon, XIcon } from 'lucide-react';
import { MemberForm } from './MemberForm';
import { CommitteeMemberCard } from './CommitteeMemberCard';
import { MeetingMinutesForm } from './MeetingMinutesForm';
import { CommitteeMinutesCard } from './CommitteeMinutesCard';
import { Committee, Member, MeetingMinutes } from '../types';

interface CommitteeCardProps {
  committee: Committee;
  onDelete: (id: string) => void;
  onUpdate?: (id: string, committee: Partial<Committee>) => void; // Make optional
  onAddMember: (committeeId: string, memberData: Omit<Member, 'id'>, imageFile?: File) => Promise<void>;
  onUpdateMember: (committeeId: string, memberId: string, memberData: Partial<Member>, imageFile?: File) => void;
  onDeleteMember: (committeeId: string, memberId: string) => void;
  onAddMinutes: (committeeId: string, minutes: Omit<MeetingMinutes, 'id'>) => void;
  onUpdateMinutes: (committeeId: string, minutesId: string, minutes: Partial<MeetingMinutes>) => void;
  onDeleteMinutes: (committeeId: string, minutesId: string) => void;
}

export function CommitteeCard({
  committee,
  onDelete,
  onUpdate,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onAddMinutes,
  onUpdateMinutes,
  onDeleteMinutes
}: CommitteeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCommittee, setEditedCommittee] = useState({
    name: committee.name,
    description: committee.description
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the committee "${committee.name}"?`)) {
      try {
        await onDelete(committee.id);
      } catch (error) {
        console.error('Error deleting committee:', error);
      }
    }
  };

  const handleEditClick = () => {
    // Check if update function is available
    if (!onUpdate) {
      alert('Committee editing is not available at the moment.');
      return;
    }
    setEditedCommittee({
      name: committee.name,
      description: committee.description
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedCommittee({
      name: committee.name,
      description: committee.description
    });
  };

  const handleSaveEdit = async () => {
    // Check if update function is available
    if (!onUpdate) {
      alert('Committee editing is not available at the moment.');
      setIsEditing(false);
      return;
    }

    if (!editedCommittee.name.trim() || !editedCommittee.description.trim()) {
      alert('Committee name and description are required');
      return;
    }

    setIsLoading(true);
    try {
      await onUpdate(committee.id, {
        name: editedCommittee.name.trim(),
        description: editedCommittee.description.trim()
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating committee:', error);
      alert('Failed to update committee. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Hide edit button if update function is not available
  const showEditButton = !!onUpdate;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Committee Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="bg-white/20 p-3 rounded-lg">
              <UsersIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editedCommittee.name}
                    onChange={(e) => setEditedCommittee(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full text-2xl font-bold text-white bg-white/20 rounded-lg px-3 py-2 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Committee Name"
                  />
                  <textarea
                    value={editedCommittee.description}
                    onChange={(e) => setEditedCommittee(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    className="w-full text-blue-100 bg-white/20 rounded-lg px-3 py-2 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                    placeholder="Committee Description"
                  />
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {committee.name}
                  </h3>
                  <p className="text-blue-100">{committee.description}</p>
                </>
              )}
              <div className="mt-3 flex items-center gap-4 text-sm text-blue-100">
                <span>{committee.members.length} members</span>
                <span>•</span>
                <span>{committee.meetingMinutes.length} meeting records</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button 
                  onClick={handleSaveEdit}
                  disabled={isLoading || !editedCommittee.name.trim() || !editedCommittee.description.trim()}
                  className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Save changes"
                >
                  <SaveIcon className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                  className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors"
                  title="Cancel editing"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsExpanded(!isExpanded)} 
                  className="bg-white/20 text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                  title={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                </button>
                {showEditButton && (
                  <button 
                    onClick={handleEditClick}
                    className="bg-blue-400 text-white p-2 rounded-lg hover:bg-blue-500 transition-colors"
                    title="Edit committee"
                  >
                    <EditIcon className="w-5 h-5" />
                  </button>
                )}
                <button 
                  onClick={handleDelete}
                  className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                  title="Delete committee"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-6 space-y-8">
          {/* Members Section */}
          <div>
            <h4 className="text-xl font-bold text-gray-800 mb-4">
              Committee Members
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <MemberForm onSubmit={(member, imageFile) => onAddMember(committee.id, member, imageFile)} />
              </div>
              <div className="lg:col-span-2">
                {committee.members.length === 0 ? (
                  <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500">
                    No members added yet. Use the form to add members.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {committee.members.map(member => (
                      <CommitteeMemberCard 
                        key={member.id} 
                        committeeId={committee.id}
                        member={member} 
                        onDelete={onDeleteMember}
                        onUpdate={onUpdateMember}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-gray-200"></div>

          {/* Meeting Minutes Section */}
          <div>
            <h4 className="text-xl font-bold text-gray-800 mb-4">
              Meeting Minutes
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <MeetingMinutesForm onSubmit={minutes => onAddMinutes(committee.id, minutes)} />
              </div>
              <div className="lg:col-span-2">
                {committee.meetingMinutes.length === 0 ? (
                  <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500">
                    No meeting minutes uploaded yet. Use the form to upload minutes.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {committee.meetingMinutes.map(minutes => (
                      <CommitteeMinutesCard 
                        key={minutes.id} 
                        committeeId={committee.id}
                        minutes={minutes} 
                        onUpdate={onUpdateMinutes}
                        onDelete={onDeleteMinutes}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}