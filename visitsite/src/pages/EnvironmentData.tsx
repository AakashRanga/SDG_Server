import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadButton } from '../components/UploadButton';
import { ZapIcon, DropletIcon, BusIcon, TreesIcon, Trash2Icon, ArrowLeftIcon, ExternalLinkIcon } from 'lucide-react';
export function EnvironmentData() {
  const navigate = useNavigate();
  const sections = [{
    id: 1,
    title: 'Energy & Climate',
    icon: ZapIcon,
    color: 'from-amber-400 to-orange-600',
    path: '/environment/energy-climate'
  }, {
    id: 2,
    title: 'Water Conservation',
    icon: DropletIcon,
    color: 'from-blue-400 to-cyan-600',
    path: '/environment/water'
  }, {
    id: 3,
    title: 'Transportation',
    icon: BusIcon,
    color: 'from-purple-400 to-indigo-600',
    path: '/environment/transportation'
  }, {
    id: 4,
    title: 'Biodiversity',
    icon: TreesIcon,
    color: 'from-green-400 to-emerald-600',
    path: '/environment/biodiversity'
  }, {
    id: 5,
    title: 'Waste Management',
    icon: Trash2Icon,
    color: 'from-teal-400 to-cyan-600',
    path: '/environment/waste-management'
  }];
  return <div className="min-h-screen w-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200" style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4d4d4' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v6h6V4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
  }}>
      <div className="bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 shadow-lg border-b-2 border-gray-600">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Dashboard
            </button>
            <button onClick={() => navigate('/environment/site')} className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
              <ExternalLinkIcon className="w-5 h-5" />
              Visit Site
            </button>
          </div>
          <h1 className="text-3xl font-bold text-center text-white" style={{
          textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.1)'
        }}>
            Environment Data
          </h1>
          <p className="text-center text-gray-300 mt-2 text-sm">
            Select a category to manage environmental initiatives
          </p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map(section => <UploadButton key={section.id} title={section.title} icon={section.icon} colorGradient={section.color} onClick={() => navigate(section.path)} />)}
        </div>
      </div>
    </div>;
}