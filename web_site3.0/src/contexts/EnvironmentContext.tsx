// EnvironmentContext.tsx
import React, { useState, createContext, useContext, useEffect } from 'react';

export interface EnvironmentDataItem {
  id: string;
  title: string;
  description: string;
  value?: string;
  unit?: string;
  year?: string;
  status?: 'active' | 'planned' | 'completed';
  images?: string[];
  files?: Array<{
    name: string;
    url: string;
    size: string;
  }>;
}

interface EnvironmentContextType {
  energyClimate: {
    climateChange: EnvironmentDataItem[];
    renewableEnergy: EnvironmentDataItem[];
    energyPrograms: EnvironmentDataItem[];
    greenBuilding: EnvironmentDataItem[];
    carbonFootprint: EnvironmentDataItem[];
    ghgReduction: EnvironmentDataItem[];
  };
  waterConservation: {
    conservation: EnvironmentDataItem[];
    recycling: EnvironmentDataItem[];
    efficientAppliances: EnvironmentDataItem[];
    wastewaterTreatment: EnvironmentDataItem[];
  };
  transportation: {
    shuttleServices: EnvironmentDataItem[];
    pedestrianPaths: EnvironmentDataItem[];
    zeroEmission: EnvironmentDataItem[];
    parkingReduction: EnvironmentDataItem[];
  };
  biodiversity: {
    floraFauna: EnvironmentDataItem[];
    biodiversityMapping: EnvironmentDataItem[];
    greenCorridors: EnvironmentDataItem[];
  };
  wasteManagement: {
    eWaste: EnvironmentDataItem[];
    biomedicalWaste: EnvironmentDataItem[];
    medicalWaste: EnvironmentDataItem[];
    dentalWaste: EnvironmentDataItem[];
    generalWaste: EnvironmentDataItem[];
    foodWaste: EnvironmentDataItem[];
    renewalProjects: EnvironmentDataItem[];
    artFromWaste: EnvironmentDataItem[];
  };
  loading: boolean;
  error: string | null;
  addItem: (category: string, subcategory: string, item: Omit<EnvironmentDataItem, 'id'>) => Promise<void>;
  updateItem: (category: string, subcategory: string, id: string, item: Partial<EnvironmentDataItem>) => Promise<void>;
  deleteItem: (category: string, subcategory: string, id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(undefined);

const API_BASE_URL = 'http://180.235.121.250:8006/api/environment';

export function EnvironmentProvider({ children }: { children: React.ReactNode }) {
  const [energyClimate, setEnergyClimate] = useState({
    climateChange: [],
    renewableEnergy: [],
    energyPrograms: [],
    greenBuilding: [],
    carbonFootprint: [],
    ghgReduction: []
  });
  const [waterConservation, setWaterConservation] = useState({
    conservation: [],
    recycling: [],
    efficientAppliances: [],
    wastewaterTreatment: []
  });
  const [transportation, setTransportation] = useState({
    shuttleServices: [],
    pedestrianPaths: [],
    zeroEmission: [],
    parkingReduction: []
  });
  const [biodiversity, setBiodiversity] = useState({
    floraFauna: [],
    biodiversityMapping: [],
    greenCorridors: []
  });
  const [wasteManagement, setWasteManagement] = useState({
    eWaste: [],
    biomedicalWaste: [],
    medicalWaste: [],
    dentalWaste: [],
    generalWaste: [],
    foodWaste: [],
    renewalProjects: [],
    artFromWaste: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to convert camelCase to kebab-case
  const toKebabCase = (str: string) => {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  };

  // Helper function to parse JSON fields safely
  const parseItemFields = (item: any): EnvironmentDataItem => {
    try {
      return {
        ...item,
        images: item.images 
          ? (typeof item.images === 'string' ? JSON.parse(item.images) : item.images)
          : [],
        files: item.files 
          ? (typeof item.files === 'string' ? JSON.parse(item.files) : item.files)
          : []
      };
    } catch (error) {
      console.warn('Error parsing item fields:', error);
      return {
        ...item,
        images: [],
        files: []
      };
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Define all endpoints to fetch
      const endpoints = [
        // Energy Climate
        { url: `${API_BASE_URL}/energy-climate/climate-change`, key: 'climateChange' },
        { url: `${API_BASE_URL}/energy-climate/renewable-energy`, key: 'renewableEnergy' },
        { url: `${API_BASE_URL}/energy-climate/energy-programs`, key: 'energyPrograms' },
        { url: `${API_BASE_URL}/energy-climate/green-building`, key: 'greenBuilding' },
        { url: `${API_BASE_URL}/energy-climate/carbon-footprint`, key: 'carbonFootprint' },
        { url: `${API_BASE_URL}/energy-climate/ghg-reduction`, key: 'ghgReduction' },
        
        // Water Conservation
        { url: `${API_BASE_URL}/water-conservation/conservation`, key: 'conservation' },
        { url: `${API_BASE_URL}/water-conservation/recycling`, key: 'recycling' },
        { url: `${API_BASE_URL}/water-conservation/efficient-appliances`, key: 'efficientAppliances' },
        { url: `${API_BASE_URL}/water-conservation/wastewater-treatment`, key: 'wastewaterTreatment' },
        
        // Transportation
        { url: `${API_BASE_URL}/transportation/shuttle-services`, key: 'shuttleServices' },
        { url: `${API_BASE_URL}/transportation/pedestrian-paths`, key: 'pedestrianPaths' },
        { url: `${API_BASE_URL}/transportation/zero-emission`, key: 'zeroEmission' },
        { url: `${API_BASE_URL}/transportation/parking-reduction`, key: 'parkingReduction' },
        
        // Biodiversity
        { url: `${API_BASE_URL}/biodiversity/flora-fauna`, key: 'floraFauna' },
        { url: `${API_BASE_URL}/biodiversity/biodiversity-mapping`, key: 'biodiversityMapping' },
        { url: `${API_BASE_URL}/biodiversity/green-corridors`, key: 'greenCorridors' },
        
        // Waste Management
        { url: `${API_BASE_URL}/waste-management/e-waste`, key: 'eWaste' },
        { url: `${API_BASE_URL}/waste-management/biomedical-waste`, key: 'biomedicalWaste' },
        { url: `${API_BASE_URL}/waste-management/medical-waste`, key: 'medicalWaste' },
        { url: `${API_BASE_URL}/waste-management/dental-waste`, key: 'dentalWaste' },
        { url: `${API_BASE_URL}/waste-management/general-waste`, key: 'generalWaste' },
        { url: `${API_BASE_URL}/waste-management/food-waste`, key: 'foodWaste' },
        { url: `${API_BASE_URL}/waste-management/renewal-projects`, key: 'renewalProjects' },
        { url: `${API_BASE_URL}/waste-management/art-from-waste`, key: 'artFromWaste' }
      ];

      // Fetch all data
      const fetchPromises = endpoints.map(async (endpoint) => {
        try {
          console.log(`🔄 Fetching: ${endpoint.url}`);
          const response = await fetch(endpoint.url);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status} for ${endpoint.url}`);
          }
          const data = await response.json();
          return { key: endpoint.key, data };
        } catch (error) {
          console.error(`❌ Error fetching ${endpoint.url}:`, error);
          return { key: endpoint.key, data: { success: false, error: error.message } };
        }
      });

      const results = await Promise.all(fetchPromises);

      // Process results
      const extractData = (response: any) => {
        if (!response.success) {
          console.warn('API response not successful:', response);
          return [];
        }
        
        if (!Array.isArray(response.data)) {
          console.warn('Expected array but got:', typeof response.data, response.data);
          return [];
        }
        
        return response.data.map(parseItemFields);
      };

      // Initialize data objects
      const energyClimateData: any = {};
      const waterConservationData: any = {};
      const transportationData: any = {};
      const biodiversityData: any = {};
      const wasteManagementData: any = {};

      // Define category mappings
      const wasteManagementKeys = {
        eWaste: true,
        biomedicalWaste: true,
        medicalWaste: true,
        dentalWaste: true,
        generalWaste: true,
        foodWaste: true,
        renewalProjects: true,
        artFromWaste: true
      };

      const energyClimateKeys = {
        climateChange: true,
        renewableEnergy: true,
        energyPrograms: true,
        greenBuilding: true,
        carbonFootprint: true,
        ghgReduction: true
      };

      const waterConservationKeys = {
        conservation: true,
        recycling: true,
        efficientAppliances: true,
        wastewaterTreatment: true
      };

      const transportationKeys = {
        shuttleServices: true,
        pedestrianPaths: true,
        zeroEmission: true,
        parkingReduction: true
      };

      const biodiversityKeys = {
        floraFauna: true,
        biodiversityMapping: true,
        greenCorridors: true
      };

      // Group results by category
      results.forEach(({ key, data }) => {
        const parsedData = extractData(data);
        
        if (key in wasteManagementKeys) {
          wasteManagementData[key] = parsedData;
        } else if (key in energyClimateKeys) {
          energyClimateData[key] = parsedData;
        } else if (key in waterConservationKeys) {
          waterConservationData[key] = parsedData;
        } else if (key in transportationKeys) {
          transportationData[key] = parsedData;
        } else if (key in biodiversityKeys) {
          biodiversityData[key] = parsedData;
        } else {
          console.warn(`Unknown key: ${key}`);
        }
      });

      // Update state
      setEnergyClimate(prev => ({ ...prev, ...energyClimateData }));
      setWaterConservation(prev => ({ ...prev, ...waterConservationData }));
      setTransportation(prev => ({ ...prev, ...transportationData }));
      setBiodiversity(prev => ({ ...prev, ...biodiversityData }));
      setWasteManagement(prev => ({ ...prev, ...wasteManagementData }));

      console.log('✅ All data fetched successfully');
      console.log('📊 Waste Management data:', wasteManagementData);
      console.log('🔄 Renewal Projects data:', wasteManagementData.renewalProjects);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('❌ Error fetching environment data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchAllData();
  };

  const addItem = async (category: string, subcategory: string, item: Omit<EnvironmentDataItem, 'id'>) => {
    try {
      const kebabCategory = toKebabCase(category);
      const kebabSubcategory = toKebabCase(subcategory);
      
      const url = `${API_BASE_URL}/${kebabCategory}/${kebabSubcategory}`;
      console.log('🚀 ADD ITEM - Making POST request to:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      const result = await response.json();
      console.log('✅ ADD ITEM - Response:', result);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${result.error || 'Failed to add item'}`);
      }

      if (!result.success) {
        throw new Error(result.error || 'Failed to add item');
      }

      await refreshData();

    } catch (error) {
      console.error('❌ ADD ITEM - Error:', error);
      throw error;
    }
  };

  const deleteItem = async (category: string, subcategory: string, id: string) => {
    try {
      const kebabCategory = toKebabCase(category);
      const kebabSubcategory = toKebabCase(subcategory);
      
      const url = `${API_BASE_URL}/${kebabCategory}/${kebabSubcategory}/${id}`;
      console.log('🗑️ DELETE ITEM - Making DELETE request to:', url);

      const response = await fetch(url, {
        method: 'DELETE',
      });

      const result = await response.json();
      console.log('✅ DELETE ITEM - Response:', result);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${result.error || 'Failed to delete item'}`);
      }

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete item');
      }

      await refreshData();

    } catch (error) {
      console.error('❌ DELETE ITEM - Error:', error);
      throw error;
    }
  };
  const updateItem = async (
  category: string,
  subcategory: string,
  id: string,
  item: Partial<EnvironmentDataItem>
) => {
  try {
    const kebabCategory = toKebabCase(category);
    const kebabSubcategory = toKebabCase(subcategory);

    const url = `${API_BASE_URL}/${kebabCategory}/${kebabSubcategory}/${id}`;
    console.log('✏️ UPDATE ITEM - PUT request:', url);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });

    const result = await response.json();
    console.log('✅ UPDATE ITEM Response:', result);

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to update item');
    }

    await refreshData();

  } catch (error) {
    console.error('❌ UPDATE ITEM - Error:', error);
    throw error;
  }
};


  const value: EnvironmentContextType = {
    energyClimate,
    waterConservation,
    transportation,
    biodiversity,
    wasteManagement,
    loading,
    error,
    addItem,
    deleteItem,
    updateItem,
    refreshData,
  };

  return (
    <EnvironmentContext.Provider value={value}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export function useEnvironment() {
  const context = useContext(EnvironmentContext);
  if (context === undefined) {
    throw new Error('useEnvironment must be used within an EnvironmentProvider');
  }
  return context;
}