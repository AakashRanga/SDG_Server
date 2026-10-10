import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ExternalLinkIcon } from 'lucide-react';
import { useEnvironment } from '../contexts/EnvironmentContext';
import { EnvironmentDataForm } from '../components/EnvironmentDataForm';
import { EnvironmentDataCard } from '../components/EnvironmentDataCard';
export function WasteManagement() {
  const navigate = useNavigate();
  const {
    wasteManagement,
    addItem,
    deleteItem
  } = useEnvironment();
  const categories = [{
    key: 'eWaste',
    label: 'E-Waste Management',
    showValue: true
  }, {
    key: 'biomedicalWaste',
    label: 'Biomedical Waste',
    showValue: true
  }, {
    key: 'medicalWaste',
    label: 'Medical Waste',
    showValue: false
  }, {
    key: 'dentalWaste',
    label: 'Dental Waste',
    showValue: false
  }, {
    key: 'generalWaste',
    label: 'General Waste & Recycling',
    showValue: true
  }, {
    key: 'foodWaste',
    label: 'Food Waste & Composting',
    showValue: true
  }, {
    key: 'renewalProjects',
    label: 'Waste Renewal Projects',
    showValue: true
  }, {
    key: 'artFromWaste',
    label: 'Art from Waste',
    showValue: false
  }];
  const [activeCategory, setActiveCategory] = useState(categories[0].key);
  const currentCategory = categories.find(c => c.key === activeCategory)!;
  const currentData = wasteManagement[activeCategory as keyof typeof wasteManagement];
  return <div className="min-h-screen w-full bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <div className="bg-gradient-to-b from-teal-600 via-cyan-700 to-teal-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate('/environment')} className="flex items-center gap-2 text-teal-100 hover:text-white transition-colors">
              <ArrowLeftIcon className="w-5 h-5" />
              Back
            </button>
            <button onClick={() => navigate('/environment/site')} className="flex items-center gap-2 bg-white text-teal-700 px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
              <ExternalLinkIcon className="w-4 h-4" />
              View Site
            </button>
          </div>
          <h1 className="text-3xl font-bold text-center text-white mb-2">
            Waste Management & Sustainability
          </h1>
          <p className="text-center text-teal-100 text-sm">
            Comprehensive waste management and circular economy initiatives
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => <button key={category.key} onClick={() => setActiveCategory(category.key)} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeCategory === category.key ? 'bg-teal-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-teal-100'}`}>
              {category.label}
            </button>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <EnvironmentDataForm onSubmit={item => addItem('wasteManagement', activeCategory, item)} showValue={currentCategory.showValue} />
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
                {currentData.map(item => <EnvironmentDataCard key={item.id} item={item} onDelete={id => deleteItem('wasteManagement', activeCategory, id)} color="teal" />)}
              </div>}
          </div>
        </div>
      </div>
    </div>;
}