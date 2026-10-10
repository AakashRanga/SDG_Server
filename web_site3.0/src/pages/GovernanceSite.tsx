import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LeafIcon, UsersIcon, TargetIcon, TrendingUpIcon, HeartIcon, GraduationCapIcon, BriefcaseIcon, ArrowLeftIcon, MailIcon, PhoneIcon, UserIcon, CalendarIcon, FlagIcon, CheckCircleIcon } from 'lucide-react';
import { useGovernance } from '../contexts/GovernanceContext';
export function GovernanceSite() {
  const navigate = useNavigate();
  const {
    greenOffice,
    committees,
    studentCouncil
  } = useGovernance();
  const totalMembers = greenOffice.members.length + committees.reduce((sum, c) => sum + c.members.length, 0) + studentCouncil.members.length;
  const totalInitiatives = greenOffice.commitments.length + greenOffice.milestones.length + committees.length;
  return <div className="min-h-screen w-full bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-700 to-teal-800 min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <img src="/IMG_0416.jpg" alt="SIMATS Campus Community" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="absolute top-0 left-6">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white hover:text-white/80 transition-colors bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Home
            </button>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Sustainability Governance
          </h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
            Leading the way towards a greener, more sustainable future through
            dedicated governance and collaborative action
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
              <p className="text-white font-semibold">
                <span className="text-2xl">3</span> Active Bodies
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
              <p className="text-white font-semibold">
                <span className="text-2xl">{totalMembers}</span> Members
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
              <p className="text-white font-semibold">
                <span className="text-2xl">{totalInitiatives}</span> Initiatives
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Mission Statement */}
      {greenOffice.missions.length > 0 && <div className="py-20 bg-gradient-to-b from-white to-green-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-block bg-green-100 p-4 rounded-full mb-4">
                <TargetIcon className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Our Mission
              </h2>
            </div>
            <div className="space-y-8">
              {greenOffice.missions.map(mission => <div key={mission.id} className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {mission.title}
                  </h3>
                  <p className="text-lg text-gray-600">{mission.description}</p>
                </div>)}
            </div>
          </div>
        </div>}
      {/* Commitments */}
      {greenOffice.commitments.length > 0 && <div className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-block bg-blue-100 p-4 rounded-full mb-4">
                <FlagIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Our Commitments
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {greenOffice.commitments.map(commitment => <div key={commitment.id} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {commitment.title}
                  </h3>
                  <p className="text-gray-700 mb-4">{commitment.description}</p>
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <CalendarIcon className="w-4 h-4" />
                    <span>
                      Target:{' '}
                      {new Date(commitment.targetDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                    </span>
                  </div>
                </div>)}
            </div>
          </div>
        </div>}
      {/* Milestones */}
      {greenOffice.milestones.length > 0 && <div className="py-20 bg-gradient-to-b from-white to-purple-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-block bg-purple-100 p-4 rounded-full mb-4">
                <TrendingUpIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Key Milestones
              </h2>
            </div>
            <div className="space-y-6">
              {greenOffice.milestones.map(milestone => <div key={milestone.id} className="bg-white rounded-2xl p-8 shadow-lg flex items-start gap-6">
                  <div className={`p-4 rounded-full ${milestone.status === 'completed' ? 'bg-green-100' : milestone.status === 'in-progress' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                    <CheckCircleIcon className={`w-8 h-8 ${milestone.status === 'completed' ? 'text-green-600' : milestone.status === 'in-progress' ? 'text-yellow-600' : 'text-blue-600'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-xl font-bold text-gray-800">
                        {milestone.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${milestone.status === 'completed' ? 'bg-green-100 text-green-700' : milestone.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                        {milestone.status.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">
                      {milestone.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CalendarIcon className="w-4 h-4" />
                      <span>
                        {new Date(milestone.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                      </span>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>}
      {/* Governance Bodies */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Our Governance Structure
            </h2>
            <p className="text-xl text-gray-600">
              Three dedicated bodies working together for a sustainable future
            </p>
          </div>
          <div className="space-y-8">
            {/* Green Office */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border-2 border-emerald-200">
              <div className="flex items-start gap-6 mb-8">
                <div className="bg-emerald-500 p-4 rounded-xl shrink-0">
                  <BriefcaseIcon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Green Office
                  </h3>
                  <p className="text-gray-700 mb-4">
                    The central coordinating body for all sustainability
                    initiatives on campus. Our team develops strategies,
                    oversees implementation, and ensures alignment with
                    institutional goals.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="bg-white px-4 py-2 rounded-full text-sm font-medium text-emerald-700">
                      {greenOffice.members.length} Team Members
                    </span>
                    <span className="bg-white px-4 py-2 rounded-full text-sm font-medium text-emerald-700">
                      {greenOffice.missions.length} Missions
                    </span>
                    <span className="bg-white px-4 py-2 rounded-full text-sm font-medium text-emerald-700">
                      {greenOffice.commitments.length} Commitments
                    </span>
                  </div>
                </div>
              </div>
              {greenOffice.members.length > 0 && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {greenOffice.members.map(member => <div key={member.id} className="bg-white rounded-xl p-6 shadow-md">
                      {member.image ? <img src={member.image} alt={member.name} className="w-20 h-20 rounded-full object-cover mb-4 mx-auto" /> : <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4 mx-auto">
                          <UserIcon className="w-10 h-10 text-emerald-600" />
                        </div>}
                      <h4 className="font-bold text-gray-800 text-center mb-1">
                        {member.name}
                      </h4>
                      <p className="text-sm text-emerald-600 text-center mb-3">
                        {member.position}
                      </p>
                      {member.email && <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                          <MailIcon className="w-3 h-3" />
                          <span className="truncate">{member.email}</span>
                        </div>}
                      {member.phone && <div className="flex items-center gap-2 text-xs text-gray-600">
                          <PhoneIcon className="w-3 h-3" />
                          <span>{member.phone}</span>
                        </div>}
                    </div>)}
                </div>}
            </div>
            {/* Committees */}
            {committees.length > 0 && <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8 border-2 border-cyan-200">
                <div className="flex items-start gap-6 mb-8">
                  <div className="bg-cyan-500 p-4 rounded-xl shrink-0">
                    <UsersIcon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      Sustainability Committees
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Specialized committees focused on specific areas of
                      sustainability, bringing together experts and stakeholders
                      to drive targeted initiatives and innovations.
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  {committees.map(committee => <div key={committee.id} className="bg-white rounded-xl p-6 shadow-md">
                      <h4 className="text-xl font-bold text-gray-800 mb-2">
                        {committee.name}
                      </h4>
                      <p className="text-gray-600 mb-4">
                        {committee.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-cyan-100 px-3 py-1 rounded-full text-xs font-medium text-cyan-700">
                          {committee.members.length} Members
                        </span>
                        <span className="bg-cyan-100 px-3 py-1 rounded-full text-xs font-medium text-cyan-700">
                          {committee.meetingMinutes.length} Meetings
                        </span>
                      </div>
                      {committee.members.length > 0 && <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {committee.members.map(member => <div key={member.id} className="text-center">
                              {member.image ? <img src={member.image} alt={member.name} className="w-16 h-16 rounded-full object-cover mb-2 mx-auto" /> : <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center mb-2 mx-auto">
                                  <UserIcon className="w-8 h-8 text-cyan-600" />
                                </div>}
                              <p className="text-sm font-medium text-gray-800">
                                {member.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {member.position}
                              </p>
                            </div>)}
                        </div>}
                    </div>)}
                </div>
              </div>}
            {/* Student Green Council */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-200">
              <div className="flex items-start gap-6 mb-8">
                <div className="bg-indigo-500 p-4 rounded-xl shrink-0">
                  <GraduationCapIcon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Student Green Council
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Student-led initiatives that bring fresh perspectives and
                    grassroots action to campus sustainability. Empowering the
                    next generation of environmental leaders.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="bg-white px-4 py-2 rounded-full text-sm font-medium text-indigo-700">
                      {studentCouncil.members.length} Student Leaders
                    </span>
                    <span className="bg-white px-4 py-2 rounded-full text-sm font-medium text-indigo-700">
                      {studentCouncil.meetingMinutes.length} Meetings
                    </span>
                  </div>
                </div>
              </div>
              {studentCouncil.members.length > 0 && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {studentCouncil.members.map(member => <div key={member.id} className="bg-white rounded-xl p-6 shadow-md">
                      {member.image ? <img src={member.image} alt={member.name} className="w-20 h-20 rounded-full object-cover mb-4 mx-auto" /> : <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-4 mx-auto">
                          <UserIcon className="w-10 h-10 text-indigo-600" />
                        </div>}
                      <h4 className="font-bold text-gray-800 text-center mb-1">
                        {member.name}
                      </h4>
                      <p className="text-sm text-indigo-600 text-center mb-3">
                        {member.position}
                      </p>
                      {member.email && <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                          <MailIcon className="w-3 h-3" />
                          <span className="truncate">{member.email}</span>
                        </div>}
                      {member.phone && <div className="flex items-center gap-2 text-xs text-gray-600">
                          <PhoneIcon className="w-3 h-3" />
                          <span>{member.phone}</span>
                        </div>}
                    </div>)}
                </div>}
            </div>
          </div>
        </div>
      </div>
      {/* Call to Action */}
      <div className="py-20 bg-gradient-to-br from-green-600 to-emerald-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block bg-white/20 backdrop-blur-sm p-4 rounded-full mb-6">
            <HeartIcon className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">
            Join Our Sustainability Journey
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Together, we can create lasting change and build a more sustainable
            future for our campus and beyond
          </p>
          <button onClick={() => navigate('/governance')} className="bg-white text-green-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-50 transition-all shadow-lg hover:shadow-xl">
            Learn More About Our Work
          </button>
        </div>
      </div>
    </div>;
}