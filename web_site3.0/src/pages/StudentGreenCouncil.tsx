import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import { MemberForm } from '../components/MemberForm';
import { StudentCouncilMemberCard } from '../components/StudentCouncilMemberCard';
import { MeetingMinutesForm } from '../components/MeetingMinutesForm';
import { MeetingMinutesCard } from '../components/MeetingMinutesCard';
import { useGovernance } from '../contexts/GovernanceContext';

export function StudentGreenCouncil() {
  const navigate = useNavigate();
  const {
    studentCouncil,
    addStudentCouncilMember,
    updateStudentCouncilMember,
    deleteStudentCouncilMember,
    addStudentCouncilMinutes,
    updateStudentCouncilMinutes,
    deleteStudentCouncilMinutes
  } = useGovernance();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4d4d4' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v6h6V4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }}>
      <div className="bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 shadow-lg border-b-2 border-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <button onClick={() => navigate('/governance')} className="mb-4 flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Governance Data
          </button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-white" style={{
          textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.1)'
        }}>
            Student Green Council
          </h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 space-y-12 sm:space-y-16">
        {/* Members Section */}
        <section>
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Council Members
            </h2>
            <p className="text-gray-600">Add and manage council members</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-1">
              <MemberForm onSubmit={addStudentCouncilMember} />
            </div>
            <div className="lg:col-span-2">
              {studentCouncil.members.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center text-gray-500">
                  No members added yet. Use the form to add members.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {studentCouncil.members.map(member => (
                    <StudentCouncilMemberCard 
                      key={member.id} 
                      member={member} 
                      onDelete={deleteStudentCouncilMember}
                      onUpdate={updateStudentCouncilMember}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
        <div className="border-t-2 border-gray-300"></div>
        {/* Meeting Minutes Section */}
        <section>
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Meeting Minutes
            </h2>
            <p className="text-gray-600">
              Upload and manage council meeting minutes
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-1">
              <MeetingMinutesForm onSubmit={addStudentCouncilMinutes} />
            </div>
            <div className="lg:col-span-2">
              {studentCouncil.meetingMinutes.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center text-gray-500">
                  No meeting minutes uploaded yet. Use the form to upload minutes.
                </div>
              ) : (
                <div className="space-y-6">
                  {studentCouncil.meetingMinutes.map(minutes => (
                    <MeetingMinutesCard 
                      key={minutes.id} 
                      minutes={minutes} 
                      onDelete={deleteStudentCouncilMinutes}
                      onUpdate={updateStudentCouncilMinutes}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}