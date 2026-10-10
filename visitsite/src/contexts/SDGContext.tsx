import React, { useState, createContext, useContext } from 'react';
export interface SDGDataItem {
  id: string;
  title: string;
  description: string;
  year: string;
  category: string;
  images?: string[];
  videos?: string[];
  files?: {
    name: string;
    url: string;
    size: string;
  }[];
  impact?: string;
  beneficiaries?: string;
  metrics?: {
    label: string;
    value: string | number;
    unit?: string;
  }[];
}
export interface ResearchActivity {
  id: string;
  title: string;
  description: string;
  year: string;
  researchType: string;
  leadResearcher: string;
  department: string;
  fundingAmount?: string;
  publications?: string;
  images?: string[];
  files?: {
    name: string;
    url: string;
    size: string;
  }[];
  collaborators?: string[];
  outcomes?: string;
}
export interface SDGReport {
  id: string;
  title: string;
  description: string;
  year: string;
  reportType: string;
  coverImage?: string;
  executiveSummary: string;
  keyFindings: string[];
  dataPoints: {
    label: string;
    value: number;
    target?: number;
    unit?: string;
    trend?: 'up' | 'down' | 'stable';
  }[];
  images?: string[];
  files?: {
    name: string;
    url: string;
    size: string;
  }[];
  recommendations?: string[];
}
interface SDGContextType {
  sdgData: Record<number, SDGDataItem[]>;
  researchActivities: Record<number, ResearchActivity[]>;
  reports: Record<number, SDGReport[]>;
  addSDGData: (goalNumber: number, data: Omit<SDGDataItem, 'id'>) => void;
  deleteSDGData: (goalNumber: number, id: string) => void;
  addResearchActivity: (goalNumber: number, data: Omit<ResearchActivity, 'id'>) => void;
  deleteResearchActivity: (goalNumber: number, id: string) => void;
  addReport: (goalNumber: number, data: Omit<SDGReport, 'id'>) => void;
  deleteReport: (goalNumber: number, id: string) => void;
}
const SDGContext = createContext<SDGContextType | undefined>(undefined);
export function SDGProvider({
  children
}: {
  children: ReactNode;
}) {
  const [sdgData, setSDGData] = useState<Record<number, SDGDataItem[]>>({
    13: [{
      id: '1',
      title: 'Campus Carbon Neutrality Initiative',
      description: 'Comprehensive program to achieve carbon neutrality by 2030 through renewable energy adoption, energy efficiency improvements, and carbon offset projects.',
      year: '2024',
      category: 'Climate Mitigation',
      impact: 'High',
      beneficiaries: '15,000 students',
      images: ['http://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop', 'http://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&h=600&fit=crop'],
      metrics: [{
        label: 'CO2 Reduction',
        value: '45',
        unit: '%'
      }, {
        label: 'Renewable Energy',
        value: '78',
        unit: '%'
      }, {
        label: 'Trees Planted',
        value: '5000',
        unit: 'trees'
      }]
    }]
  });
  const [researchActivities, setResearchActivities] = useState<Record<number, ResearchActivity[]>>({
    13: [{
      id: '1',
      title: 'Climate Change Adaptation Strategies for Urban Areas',
      description: 'Multi-year research project investigating innovative adaptation strategies for cities facing climate change impacts, including heat islands, flooding, and extreme weather events.',
      year: '2024',
      researchType: 'Applied Research',
      leadResearcher: 'Dr. Sarah Johnson',
      department: 'Environmental Science',
      fundingAmount: '$500,000',
      publications: '12 peer-reviewed papers',
      outcomes: 'Policy recommendations adopted by 3 major cities',
      collaborators: ['MIT', 'Stanford', 'Local Government'],
      images: ['http://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop'],
      files: [{
        name: 'Climate_Adaptation_Research_Paper.pdf',
        url: 'http://example.com/research1.pdf',
        size: '2.4 MB'
      }, {
        name: 'Urban_Heat_Island_Study.pdf',
        url: 'http://example.com/research2.pdf',
        size: '1.8 MB'
      }, {
        name: 'Policy_Recommendations.docx',
        url: 'http://example.com/policy.docx',
        size: '856 KB'
      }]
    }, {
      id: '2',
      title: 'Renewable Energy Integration in Developing Nations',
      description: 'Research focused on cost-effective renewable energy solutions for developing countries, with emphasis on solar and wind power infrastructure.',
      year: '2023',
      researchType: 'Field Research',
      leadResearcher: 'Prof. Michael Chen',
      department: 'Engineering',
      fundingAmount: '$750,000',
      publications: '8 conference papers',
      outcomes: 'Solar installations in 15 villages',
      collaborators: ['UN Development Programme', 'World Bank'],
      images: ['http://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop'],
      files: [{
        name: 'Renewable_Energy_Field_Study.pdf',
        url: 'http://example.com/renewable.pdf',
        size: '3.2 MB'
      }, {
        name: 'Solar_Implementation_Guide.pdf',
        url: 'http://example.com/solar.pdf',
        size: '2.1 MB'
      }]
    }, {
      id: '3',
      title: 'Carbon Sequestration Through Biochar Technology',
      description: 'Innovative research on using biochar for long-term carbon storage and soil enhancement in agricultural systems.',
      year: '2024',
      researchType: 'Laboratory Research',
      leadResearcher: 'Dr. Emily Rodriguez',
      department: 'Agricultural Science',
      fundingAmount: '$350,000',
      publications: '5 journal articles',
      outcomes: 'Patent pending for biochar production method',
      collaborators: ['USDA', 'Local Farms'],
      images: ['http://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=600&fit=crop'],
      files: [{
        name: 'Biochar_Research_Findings.pdf',
        url: 'http://example.com/biochar.pdf',
        size: '1.5 MB'
      }]
    }]
  });
  const [reports, setReports] = useState<Record<number, SDGReport[]>>({
    13: [{
      id: '1',
      title: 'Annual Climate Action Progress Report 2024',
      description: 'Comprehensive assessment of our climate action initiatives, carbon footprint reduction, and progress toward sustainability goals.',
      year: '2024',
      reportType: 'Annual Report',
      coverImage: 'http://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800&h=600&fit=crop',
      executiveSummary: 'In 2024, we achieved a 45% reduction in carbon emissions through strategic initiatives in renewable energy, energy efficiency, and sustainable transportation. Our comprehensive approach has positioned us as a leader in climate action among educational institutions.',
      keyFindings: ['Achieved 78% renewable energy usage across campus', 'Reduced carbon emissions by 12,500 tons CO2 equivalent', 'Diverted 85% of waste from landfills through recycling programs', 'Planted 5,000 trees creating 45 acres of new green space', 'Reduced water consumption by 2.5 million gallons'],
      dataPoints: [{
        label: 'Carbon Emissions',
        value: 45,
        target: 50,
        unit: '% reduction',
        trend: 'down'
      }, {
        label: 'Renewable Energy',
        value: 78,
        target: 80,
        unit: '%',
        trend: 'up'
      }, {
        label: 'Waste Diversion',
        value: 85,
        target: 90,
        unit: '%',
        trend: 'up'
      }, {
        label: 'Green Space',
        value: 45,
        target: 50,
        unit: 'acres',
        trend: 'up'
      }, {
        label: 'Water Saved',
        value: 2.5,
        target: 3,
        unit: 'M gallons',
        trend: 'up'
      }, {
        label: 'Trees Planted',
        value: 5000,
        target: 6000,
        unit: 'trees',
        trend: 'up'
      }],
      recommendations: ['Accelerate transition to 100% renewable energy by 2025', 'Expand electric vehicle charging infrastructure', 'Implement circular economy principles in procurement', 'Increase investment in climate research partnerships', 'Develop climate literacy programs for all students'],
      images: ['http://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&h=600&fit=crop', 'http://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=600&fit=crop'],
      files: [{
        name: 'Climate_Action_Report_2024_Full.pdf',
        url: 'http://example.com/climate-report-2024.pdf',
        size: '8.5 MB'
      }, {
        name: 'Executive_Summary_2024.pdf',
        url: 'http://example.com/exec-summary-2024.pdf',
        size: '1.2 MB'
      }, {
        name: 'Data_Appendix_2024.xlsx',
        url: 'http://example.com/data-2024.xlsx',
        size: '3.4 MB'
      }]
    }, {
      id: '2',
      title: 'Climate Resilience Strategy 2024-2030',
      description: 'Strategic framework for building institutional resilience to climate change impacts and achieving long-term sustainability goals.',
      year: '2024',
      reportType: 'Strategic Plan',
      coverImage: 'http://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
      executiveSummary: 'This strategic plan outlines our roadmap to climate resilience through 2030, incorporating adaptation measures, mitigation strategies, and community engagement initiatives.',
      keyFindings: ['Climate risk assessment completed for all facilities', 'Emergency preparedness plans updated for extreme weather', 'Green infrastructure investments totaling $12M approved', 'Partnership established with 5 climate research institutions'],
      dataPoints: [{
        label: 'Risk Mitigation',
        value: 82,
        target: 95,
        unit: '%',
        trend: 'up'
      }, {
        label: 'Adaptation Budget',
        value: 12,
        target: 15,
        unit: 'M USD',
        trend: 'up'
      }],
      recommendations: ['Implement nature-based solutions across campus', 'Establish climate emergency response protocols', 'Create climate adaptation fund'],
      images: ['http://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=600&fit=crop'],
      files: [{
        name: 'Climate_Resilience_Strategy_2024-2030.pdf',
        url: 'http://example.com/resilience-strategy.pdf',
        size: '5.8 MB'
      }, {
        name: 'Risk_Assessment_Report.pdf',
        url: 'http://example.com/risk-assessment.pdf',
        size: '2.9 MB'
      }]
    }]
  });
  const addSDGData = (goalNumber: number, data: Omit<SDGDataItem, 'id'>) => {
    const newItem: SDGDataItem = {
      ...data,
      id: Date.now().toString()
    };
    setSDGData(prev => ({
      ...prev,
      [goalNumber]: [...(prev[goalNumber] || []), newItem]
    }));
  };
  const deleteSDGData = (goalNumber: number, id: string) => {
    setSDGData(prev => ({
      ...prev,
      [goalNumber]: (prev[goalNumber] || []).filter(item => item.id !== id)
    }));
  };
  const addResearchActivity = (goalNumber: number, data: Omit<ResearchActivity, 'id'>) => {
    const newItem: ResearchActivity = {
      ...data,
      id: Date.now().toString()
    };
    setResearchActivities(prev => ({
      ...prev,
      [goalNumber]: [...(prev[goalNumber] || []), newItem]
    }));
  };
  const deleteResearchActivity = (goalNumber: number, id: string) => {
    setResearchActivities(prev => ({
      ...prev,
      [goalNumber]: (prev[goalNumber] || []).filter(item => item.id !== id)
    }));
  };
  const addReport = (goalNumber: number, data: Omit<SDGReport, 'id'>) => {
    const newItem: SDGReport = {
      ...data,
      id: Date.now().toString()
    };
    setReports(prev => ({
      ...prev,
      [goalNumber]: [...(prev[goalNumber] || []), newItem]
    }));
  };
  const deleteReport = (goalNumber: number, id: string) => {
    setReports(prev => ({
      ...prev,
      [goalNumber]: (prev[goalNumber] || []).filter(item => item.id !== id)
    }));
  };
  return <SDGContext.Provider value={{
    sdgData,
    researchActivities,
    reports,
    addSDGData,
    deleteSDGData,
    addResearchActivity,
    deleteResearchActivity,
    addReport,
    deleteReport
  }}>
      {children}
    </SDGContext.Provider>;
}
export function useSDG() {
  const context = useContext(SDGContext);
  if (!context) {
    throw new Error('useSDG must be used within SDGProvider');
  }
  return context;
}