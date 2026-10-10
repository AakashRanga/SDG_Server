import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ExternalLinkIcon } from 'lucide-react';
import { useEnvironment } from '../contexts/EnvironmentContext';
import { EnvironmentDataForm } from '../components/EnvironmentDataForm';
import { EnvironmentDataCard } from '../components/EnvironmentDataCard';
export function Transportation() {
  const navigate = useNavigate();
  const {
    transportation,
    addItem,
    deleteItem
  } = useEnvironment();
  const categories = [{
    key: 'shuttleServices',
    label: 'Shuttle Services',
    showValue: true
  }, {
    key: 'pedestrianPaths',
    label: 'Pedestrian & Bicycle Pathways',
    showValue: true
  }, {
    key: 'zeroEmission',
    label: 'Zero Emission Vehicles',
    showValue: true
  }, {
    key: 'parkingReduction',
    label: 'Parking Reduction',
    showValue: true
  }];
  const [activeCategory, setActiveCategory] = useState(categories[0].key);
  const currentCategory = categories.find(c => c.key === activeCategory)!;
  const currentData = transportation[activeCategory as keyof typeof transportation];
  return <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50">
      <div className="bg-gradient-to-b from-purple-600 via-indigo-700 to-purple-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate('/environment')} className="flex items-center gap-2 text-purple-100 hover:text-white transition-colors">
              <ArrowLeftIcon className="w-5 h-5" />
              Back
            </button>
            <button onClick={() => navigate('/environment/site')} className="flex items-center gap-2 bg-white text-purple-700 px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
              <ExternalLinkIcon className="w-4 h-4" />
              View Site
            </button>
          </div>
          <h1 className="text-3xl font-bold text-center text-white mb-2">
            Transportation
          </h1>
          <p className="text-center text-purple-100 text-sm">
            Manage sustainable transportation initiatives
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => <button key={category.key} onClick={() => setActiveCategory(category.key)} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeCategory === category.key ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-purple-100'}`}>
              {category.label}
            </button>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <EnvironmentDataForm onSubmit={item => addItem('transportation', activeCategory, item)} showValue={currentCategory.showValue} />
          </div>
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {currentCategory.label}
            </h2>
            {currentData.length === 0 ? <div className="bg-white rounded-xl p-12 text-center shadow-lg">
                <p className="text-gray-500">
                  No entries yet. Add your first entry using the form.
                </p>
              </div> : <div className="space-y-4">
                {currentData.map(item => <EnvironmentDataCard key={item.id} item={item} onDelete={id => deleteItem('transportation', activeCategory, id)} color="purple" />)}
              </div>}
          </div>
        </div>
      </div>
    </div>;
}