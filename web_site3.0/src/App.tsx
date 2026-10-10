import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadButton } from './components/UploadButton';
import { FileTextIcon, LeafIcon, FlaskConicalIcon, BuildingIcon, TrophyIcon, FileBarChartIcon, TargetIcon, AwardIcon } from 'lucide-react';
export function App() {
  const navigate = useNavigate();
  const uploadCategories = [{
    id: 1,
    title: 'Governance Data',
    icon: FileTextIcon,
    color: 'from-blue-400 to-blue-600',
    path: '/governance'
  }, {
    id: 2,
    title: 'Environment Data',
    icon: LeafIcon,
    color: 'from-green-400 to-green-600',
    path: '/environment'
  }, {
    id: 3,
    title: 'Research Data',
    icon: FlaskConicalIcon,
    color: 'from-purple-400 to-purple-600',
    path: '/research'
  }, {
    id: 4,
    title: 'Infrastructure Data',
    icon: BuildingIcon,
    color: 'from-orange-400 to-orange-600',
    path: '/infrastructure'
  }, {
    id: 5,
    title: 'Achievement Information',
    icon: TrophyIcon,
    color: 'from-yellow-400 to-yellow-600',
    path: '/achievements'
  }, {
    id: 6,
    title: 'Reports',
    icon: FileBarChartIcon,
    color: 'from-red-400 to-red-600',
    path: '/reports'
  }, {
    id: 7,
    title: 'Ranking Data',
    icon: AwardIcon,
    color: 'from-pink-400 to-purple-600',
    path: '/ranking-data'
  }];
  return <div className="min-h-screen w-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200" style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4d4d4' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v6h6V4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
  }}>
      <div className="bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 shadow-lg border-b-2 border-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-white" style={{
          textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.1)'
        }}>
            Data Collection Dashboard
          </h1>
          <p className="text-center text-gray-300 mt-1 text-xs sm:text-sm">
            Select a category to upload data
          </p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {uploadCategories.map(category => <UploadButton key={category.id} title={category.title} icon={category.icon} colorGradient={category.color} onClick={() => navigate(category.path)} />)}
        </div>
      </div>
    </div>;
}