import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ExternalLinkIcon } from 'lucide-react';
import { useEnvironment } from '../contexts/EnvironmentContext';
import { EnvironmentDataForm } from '../components/EnvironmentDataForm';
import { EnvironmentDataCard } from '../components/EnvironmentDataCard';

export function EnergyClimate() {
  const navigate = useNavigate();

  const {
    energyClimate,
    addItem,
    updateItem,
    deleteItem
  } = useEnvironment();

  const categories = [
    { key: 'climateChange', label: 'Climate Change Initiatives', showValue: false },
    { key: 'renewableEnergy', label: 'Renewable Energy', showValue: true },
    { key: 'energyPrograms', label: 'Energy Efficient Programs', showValue: true },
    { key: 'greenBuilding', label: 'Green Building', showValue: false },
    { key: 'carbonFootprint', label: 'Carbon Footprint', showValue: true },
    { key: 'ghgReduction', label: 'GHG Emissions Reduction', showValue: true }
  ];

  const [activeCategory, setActiveCategory] = useState(categories[0].key);

  const currentCategory = categories.find(c => c.key === activeCategory)!;
  const currentData = energyClimate[activeCategory as keyof typeof energyClimate];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      
      {/* Header */}
      <div className="bg-gradient-to-b from-orange-600 via-amber-700 to-orange-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/environment')}
              className="flex items-center gap-2 text-orange-100 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back
            </button>

            <button
              onClick={() => navigate('/environment/site')}
              className="flex items-center gap-2 bg-white text-orange-700 px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <ExternalLinkIcon className="w-4 h-4" />
              View Site
            </button>
          </div>

          <h1 className="text-3xl font-bold text-center text-white mb-2">
            Energy & Climate Change
          </h1>

          <p className="text-center text-orange-100 text-sm">
            Manage energy initiatives and climate action programs
          </p>
        </div>
      </div>

      {/* Page Body */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeCategory === category.key
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-orange-100'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column – Add Form */}
          <div className="lg:col-span-1">
            <EnvironmentDataForm
              onSubmit={item => addItem('energyClimate', activeCategory, item)}
              showValue={currentCategory.showValue}
            />
          </div>

          {/* Right Column – Data Cards */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {currentCategory.label}
            </h2>

            {currentData.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-lg">
                <p className="text-gray-500">No entries yet. Add your first entry using the form.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentData.map(item => (
                  <EnvironmentDataCard
                    key={item.id}
                    item={item}
                    category={activeCategory}
                    color="orange"
                    
                    onDelete={id =>
                      deleteItem('energyClimate', activeCategory, id)
                    }
                    
                    onUpdate={(id, updatedItem) =>
                      updateItem('energyClimate', activeCategory, id, updatedItem)
                    }
                  />
                ))}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
