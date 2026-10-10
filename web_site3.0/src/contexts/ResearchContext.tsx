import React, { useState, createContext, useContext } from 'react';
export interface ResearchItem {
  id: string;
  title: string;
  description: string;
  value?: string;
  unit?: string;
  year?: string;
  status?: 'active' | 'completed' | 'planned';
  images?: string[];
  files?: {
    name: string;
    url: string;
    size: string;
  }[];
  sdgGoals?: number[];
  link?: string;
}
interface ResearchContextType {
  funding: {
    grants: ResearchItem[];
    corporateSponsorship: ResearchItem[];
    governmentFunding: ResearchItem[];
  };
  publications: {
    journals: ResearchItem[];
    conferences: ResearchItem[];
    books: ResearchItem[];
  };
  patents: {
    patents: ResearchItem[];
    innovations: ResearchItem[];
  };
  courses: {
    undergraduate: ResearchItem[];
    graduate: ResearchItem[];
    certifications: ResearchItem[];
  };
  studentResearch: {
    thesis: ResearchItem[];
    projects: ResearchItem[];
  };
  collaborations: {
    industry: ResearchItem[];
    international: ResearchItem[];
  };
  outreach: {
    community: ResearchItem[];
    service: ResearchItem[];
  };
  startups: {
    incubated: ResearchItem[];
    launched: ResearchItem[];
  };
  graduates: {
    greenJobs: ResearchItem[];
    careers: ResearchItem[];
  };
  innovations: {
    climateAction: ResearchItem[];
    technologies: ResearchItem[];
  };
  addItem: (category: string, subcategory: string, item: ResearchItem) => void;
  updateItem: (category: string, subcategory: string, id: string, item: ResearchItem) => void;
  deleteItem: (category: string, subcategory: string, id: string) => void;
}
const ResearchContext = createContext<ResearchContextType | undefined>(undefined);
export function ResearchProvider({
  children
}: {
  children: ReactNode;
}) {
  const [funding, setFunding] = useState({
    grants: [{
      id: '1',
      title: 'Clean Energy Research Initiative',
      description: 'Multi-year grant for renewable energy research and development',
      value: '500000',
      unit: 'USD',
      year: '2024',
      sdgGoals: [7, 13]
    }, {
      id: '2',
      title: 'Sustainable Agriculture Project',
      description: 'Research on climate-resilient farming practices',
      value: '350000',
      unit: 'USD',
      year: '2024',
      sdgGoals: [2, 13, 15]
    }],
    corporateSponsorship: [{
      id: '3',
      title: 'Tech for Good Partnership',
      description: 'Corporate sponsorship for innovation in sustainable technology',
      value: '200000',
      unit: 'USD',
      year: '2024',
      sdgGoals: [9, 12]
    }],
    governmentFunding: [{
      id: '4',
      title: 'National Climate Action Fund',
      description: 'Government grant for climate research',
      value: '750000',
      unit: 'USD',
      year: '2024',
      sdgGoals: [13, 14, 15]
    }]
  });
  const [publications, setPublications] = useState({
    journals: [{
      id: '5',
      title: 'Impact of Renewable Energy on Rural Communities',
      description: 'Peer-reviewed study on socio-economic benefits of clean energy',
      year: '2024',
      status: 'completed',
      sdgGoals: [1, 7, 11]
    }, {
      id: '6',
      title: 'Ocean Acidification and Marine Biodiversity',
      description: 'Research on climate change effects on marine ecosystems',
      year: '2024',
      status: 'completed',
      sdgGoals: [13, 14]
    }],
    conferences: [{
      id: '7',
      title: 'Sustainable Cities Conference Proceedings',
      description: 'Presentation on urban sustainability innovations',
      year: '2024',
      status: 'completed',
      sdgGoals: [11, 12]
    }],
    books: [{
      id: '8',
      title: 'Handbook of Climate Action Strategies',
      description: 'Comprehensive guide to climate mitigation and adaptation',
      year: '2024',
      status: 'active',
      sdgGoals: [13, 15]
    }]
  });
  const [patents, setPatents] = useState({
    patents: [{
      id: '9',
      title: 'Solar Panel Efficiency Enhancement System',
      description: 'Patent for innovative solar energy capture technology',
      year: '2024',
      status: 'active',
      sdgGoals: [7, 9, 13]
    }, {
      id: '10',
      title: 'Water Purification Nanotechnology',
      description: 'Patent for affordable water treatment solution',
      year: '2024',
      status: 'completed',
      sdgGoals: [6, 3]
    }],
    innovations: [{
      id: '11',
      title: 'Smart Waste Management IoT System',
      description: 'Innovation in circular economy and waste reduction',
      year: '2024',
      status: 'active',
      sdgGoals: [11, 12]
    }]
  });
  const [courses, setCourses] = useState({
    undergraduate: [],
    graduate: [],
    certifications: []
  });
  const [studentResearch, setStudentResearch] = useState({
    thesis: [{
      id: '12',
      title: 'Gender Equality in STEM Education',
      description: 'Thesis on improving female participation in science fields',
      year: '2024',
      status: 'active',
      sdgGoals: [4, 5]
    }],
    projects: [{
      id: '13',
      title: 'Community Health Monitoring System',
      description: 'Student project on accessible healthcare technology',
      year: '2024',
      status: 'active',
      sdgGoals: [3, 10]
    }]
  });
  const [collaborations, setCollaborations] = useState({
    industry: [{
      id: '14',
      title: 'Green Manufacturing Partnership',
      description: 'Industry collaboration on sustainable production',
      year: '2024',
      status: 'active',
      sdgGoals: [8, 9, 12]
    }],
    international: [{
      id: '15',
      title: 'Global Peace Research Network',
      description: 'International collaboration on conflict resolution',
      year: '2024',
      status: 'active',
      sdgGoals: [16, 17]
    }]
  });
  const [outreach, setOutreach] = useState({
    community: [{
      id: '16',
      title: 'Zero Hunger Community Program',
      description: 'Local food security initiative',
      year: '2024',
      status: 'active',
      sdgGoals: [1, 2]
    }],
    service: [{
      id: '17',
      title: 'Educational Equity Outreach',
      description: 'Service program for underserved communities',
      year: '2024',
      status: 'active',
      sdgGoals: [4, 10]
    }]
  });
  const [startups, setStartups] = useState({
    incubated: [],
    launched: []
  });
  const [graduates, setGraduates] = useState({
    greenJobs: [],
    careers: []
  });
  const [innovations, setInnovations] = useState({
    climateAction: [],
    technologies: []
  });
  const addItem = (category: string, subcategory: string, item: ResearchItem) => {
    const setters: Record<string, Function> = {
      funding: setFunding,
      publications: setPublications,
      patents: setPatents,
      courses: setCourses,
      studentResearch: setStudentResearch,
      collaborations: setCollaborations,
      outreach: setOutreach,
      startups: setStartups,
      graduates: setGraduates,
      innovations: setInnovations
    };
    const setter = setters[category];
    if (setter) {
      setter((prev: any) => ({
        ...prev,
        [subcategory]: [...prev[subcategory], item]
      }));
    }
  };
  const updateItem = (category: string, subcategory: string, id: string, item: ResearchItem) => {
    const setters: Record<string, Function> = {
      funding: setFunding,
      publications: setPublications,
      patents: setPatents,
      courses: setCourses,
      studentResearch: setStudentResearch,
      collaborations: setCollaborations,
      outreach: setOutreach,
      startups: setStartups,
      graduates: setGraduates,
      innovations: setInnovations
    };
    const setter = setters[category];
    if (setter) {
      setter((prev: any) => ({
        ...prev,
        [subcategory]: prev[subcategory].map((i: ResearchItem) => i.id === id ? item : i)
      }));
    }
  };
  const deleteItem = (category: string, subcategory: string, id: string) => {
    const setters: Record<string, Function> = {
      funding: setFunding,
      publications: setPublications,
      patents: setPatents,
      courses: setCourses,
      studentResearch: setStudentResearch,
      collaborations: setCollaborations,
      outreach: setOutreach,
      startups: setStartups,
      graduates: setGraduates,
      innovations: setInnovations
    };
    const setter = setters[category];
    if (setter) {
      setter((prev: any) => ({
        ...prev,
        [subcategory]: prev[subcategory].filter((i: ResearchItem) => i.id !== id)
      }));
    }
  };
  return <ResearchContext.Provider value={{
    funding,
    publications,
    patents,
    courses,
    studentResearch,
    collaborations,
    outreach,
    startups,
    graduates,
    innovations,
    addItem,
    updateItem,
    deleteItem
  }}>
      {children}
    </ResearchContext.Provider>;
}
export function useResearch() {
  const context = useContext(ResearchContext);
  if (!context) {
    throw new Error('useResearch must be used within ResearchProvider');
  }
  return context;
}