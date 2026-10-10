import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, TreesIcon, AccessibilityIcon, HeartPulseIcon, CpuIcon, DollarSignIcon, MapIcon, EyeIcon } from 'lucide-react';
export function InfrastructureData() {
  const navigate = useNavigate();
  const categories = [{
    id: 1,
    title: 'Green & Open Spaces',
    icon: TreesIcon,
    color: 'from-green-400 to-emerald-600',
    path: '/infrastructure/green-spaces'
  }, {
    id: 2,
    title: 'Accessibility & Safety',
    icon: AccessibilityIcon,
    color: 'from-blue-400 to-cyan-600',
    path: '/infrastructure/accessibility'
  }, {
    id: 3,
    title: 'Health & Wellness',
    icon: HeartPulseIcon,
    color: 'from-pink-400 to-rose-600',
    path: '/infrastructure/wellness'
  }, {
    id: 4,
    title: 'Smart Building Initiatives',
    icon: CpuIcon,
    color: 'from-purple-400 to-violet-600',
    path: '/infrastructure/smart-buildings'
  }, {
    id: 5,
    title: 'Sustainability Budget',
    icon: DollarSignIcon,
    color: 'from-yellow-400 to-amber-600',
    path: '/infrastructure/budget'
  }, {
    id: 6,
    title: 'Planning & Expansion',
    icon: MapIcon,
    color: 'from-indigo-400 to-blue-600',
    path: '/infrastructure/planning'
  }];
  return <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 via-slate-100 to-stone-100">
      <div className="bg-gradient-to-r from-slate-700 via-gray-800 to-stone-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors">
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Dashboard
            </button>
            <button onClick={() => navigate('/infrastructure/site')} className="flex items-center gap-2 bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
              <EyeIcon className="w-5 h-5" />
              Visit Site
            </button>
          </div>
          <h1 className="text-4xl font-bold text-white mt-6 text-center">
            Infrastructure Data Collection
          </h1>
          <p className="text-center text-gray-300 mt-2 text-lg">
            Manage sustainable infrastructure and campus development data
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => {
          const Icon = category.icon;
          return <button key={category.id} onClick={() => navigate(category.path)} className={`relative group bg-gradient-to-br ${category.color} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105`}>
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/20 pointer-events-none" />
                <div className="relative p-8 flex flex-col items-center justify-center space-y-4">
                  <div className="bg-white/20 rounded-full p-6 shadow-inner backdrop-blur-sm">
                    <Icon className="w-12 h-12 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-white text-center leading-tight">
                    {category.title}
                  </h3>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </button>;
        })}
        </div>
      </div>
    </div>;
}