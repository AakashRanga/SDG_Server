// Committees.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import { CommitteeForm } from '../components/CommitteeForm';
import { CommitteeCard } from '../components/CommitteeCard';
import { useGovernance } from '../contexts/GovernanceContext';

export function Committees() {
  const navigate = useNavigate();
  const {
    committees,
    loading,
    error,
    addCommittee,
    updateCommittee, // Make sure this is included
    deleteCommittee,
    addCommitteeMember,
    updateCommitteeMember,
    deleteCommitteeMember,
    addCommitteeMinutes,
    updateCommitteeMinutes,
    deleteCommitteeMinutes,
    clearError
  } = useGovernance();

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading committees...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4d4d4' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v6h6V4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}
    >
      <div className="bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 shadow-lg border-b-2 border-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <button 
            onClick={() => navigate('/governance')} 
            className="mb-4 flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Governance Data
          </button>
          <h1 
            className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-white"
            style={{
              textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.1)'
            }}
          >
            Committee Management
          </h1>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
            <button
              onClick={clearError}
              className="absolute top-0 right-0 px-4 py-3"
            >
              <span className="text-red-700">×</span>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 space-y-8">
        {/* Add Committee Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Create New Committee
            </h2>
            <p className="text-gray-600">
              Add a new committee to manage members and meeting minutes
            </p>
          </div>
          <div className="max-w-2xl">
            <CommitteeForm onSubmit={addCommittee} />
          </div>
        </section>

        {/* Committees List */}
        {committees.length > 0 ? (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                Active Committees
              </h2>
              <p className="text-gray-600">
                Manage your committees, members, and meeting records
              </p>
            </div>
            <div className="space-y-6">
              {committees.map(committee => (
                <CommitteeCard 
                  key={committee.id} 
                  committee={committee}
                  onDelete={deleteCommittee}
                  onUpdate={updateCommittee} 
                  onAddMember={addCommitteeMember}
                  onUpdateMember={updateCommitteeMember}
                  onDeleteMember={deleteCommitteeMember}
                  onAddMinutes={addCommitteeMinutes}
                  onUpdateMinutes={updateCommitteeMinutes}
                  onDeleteMinutes={deleteCommitteeMinutes}
                />
              ))}
            </div>
          </section>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">
              No committees created yet. Use the form above to create your first committee.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}