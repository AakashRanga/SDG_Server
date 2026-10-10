import React, { useState, createContext, useContext } from "react";
export interface InfrastructureItem {
  id: string;
  title: string;
  description: string;
  value?: string;
  unit?: string;
  year?: string;
  status?: "active" | "planned" | "completed";
  images?: string[];
  videos?: string[];
  files?: Array<{
    name: string;
    url: string;
    size: string;
  }>;
}
interface InfrastructureContextType {
  greenSpaces: {
    openAreas: InfrastructureItem[];
    forestedZones: InfrastructureItem[];
  };
  accessibility: {
    buildings: InfrastructureItem[];
    facilities: InfrastructureItem[];
  };
  wellness: {
    facilities: InfrastructureItem[];
    programs: InfrastructureItem[];
  };
  smartBuildings: {
    initiatives: InfrastructureItem[];
    technologies: InfrastructureItem[];
  };
  budget: {
    allocations: InfrastructureItem[];
    investments: InfrastructureItem[];
  };
  planning: {
    strategies: InfrastructureItem[];
    expansions: InfrastructureItem[];
  };
  addItem: (
    category: string,
    subcategory: string,
    item: Omit<InfrastructureItem, "id">
  ) => void;
  updateItem: (
    category: string,
    subcategory: string,
    id: string,
    item: Omit<InfrastructureItem, "id">
  ) => void;
  deleteItem: (category: string, subcategory: string, id: string) => void;
}
const InfrastructureContext = createContext<
  InfrastructureContextType | undefined
>(undefined);
export function InfrastructureProvider({ children }: { children: ReactNode }) {
  const [greenSpaces, setGreenSpaces] = useState({
    openAreas: [
      {
        id: "1",
        title: "Central Campus Green",
        description:
          "A 15-acre open lawn space featuring native wildflowers and sustainable landscaping. This area serves as the heart of campus outdoor activities and provides essential green infrastructure for stormwater management.",
        value: "15",
        unit: "acres",
        year: "2023",
        status: "completed" as const,
        images: [
          "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop",
        ],
      },
      {
        id: "2",
        title: "Meditation Garden",
        description:
          "A tranquil 2-acre garden designed for mindfulness and reflection, featuring zen rock gardens, bamboo groves, and water features. Open to all students and staff for quiet study and meditation.",
        value: "2",
        unit: "acres",
        year: "2024",
        status: "active" as const,
        images: [
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
        ],
      },
      {
        id: "3",
        title: "Athletic Fields Complex",
        description:
          "Sustainable sports complex with organic turf management, rainwater harvesting for irrigation, and solar-powered lighting. Includes soccer fields, track, and outdoor fitness areas.",
        value: "8",
        unit: "acres",
        year: "2022",
        status: "completed" as const,
        images: [
          "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop",
        ],
      },
      {
        id: "4",
        title: "Community Garden Plaza",
        description:
          "Student-operated organic garden featuring raised beds, composting stations, and educational signage. Produces fresh vegetables donated to local food banks and campus dining halls.",
        value: "1.5",
        unit: "acres",
        year: "2024",
        status: "active" as const,
        images: [
          "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=600&fit=crop",
        ],
      },
    ] as InfrastructureItem[],
    forestedZones: [
      {
        id: "1",
        title: "Native Tree Arboretum",
        description:
          "A living laboratory featuring 200+ species of native trees and shrubs. Provides habitat for local wildlife, carbon sequestration, and outdoor classroom space for environmental science courses.",
        value: "25",
        unit: "acres",
        year: "2021",
        status: "completed" as const,
        images: [
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=600&fit=crop",
        ],
      },
      {
        id: "2",
        title: "Riparian Restoration Zone",
        description:
          "Restored streamside forest corridor with native plantings to prevent erosion, filter runoff, and create wildlife habitat. Part of our watershed protection initiative.",
        value: "10",
        unit: "acres",
        year: "2023",
        status: "active" as const,
        images: [
          "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&h=600&fit=crop",
        ],
      },
      {
        id: "3",
        title: "Urban Forest Expansion",
        description:
          "Planned expansion of campus tree canopy with 500 new native trees to increase shade, reduce heat island effect, and improve air quality. Target 40% canopy coverage by 2030.",
        value: "500",
        unit: "trees",
        year: "2025",
        status: "planned" as const,
        images: [
          "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&h=600&fit=crop",
        ],
      },
    ] as InfrastructureItem[],
  });
  const [accessibility, setAccessibility] = useState({
    buildings: [
      {
        id: "1",
        title: "Universal Design Learning Center",
        description:
          "State-of-the-art academic building featuring automatic doors, tactile wayfinding, adjustable-height workstations, and assistive technology labs. LEED Platinum certified with 100% accessibility compliance.",
        value: "100",
        unit: "% accessible",
        year: "2023",
        status: "completed" as const,
        images: [
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
        ],
      },
      {
        id: "2",
        title: "Accessible Residence Halls",
        description:
          "Four residence halls retrofitted with wheelchair-accessible rooms, visual fire alarms, accessible bathrooms, and elevator access to all floors. Includes sensory-friendly quiet rooms.",
        value: "4",
        unit: "buildings",
        year: "2024",
        status: "active" as const,
        images: [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
        ],
      },
      {
        id: "3",
        title: "Science Building Renovation",
        description:
          "Complete accessibility upgrade including lab equipment at multiple heights, accessible fume hoods, and specialized equipment for students with disabilities.",
        value: "85000",
        unit: "sq ft",
        year: "2022",
        status: "completed" as const,
        images: [
          "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop",
        ],
      },
    ] as InfrastructureItem[],
    facilities: [
      {
        id: "1",
        title: "Emergency Blue Light System",
        description:
          "Network of 150 emergency call stations with LED lighting, two-way communication, and automatic location tracking. Connected to 24/7 campus security dispatch.",
        value: "150",
        unit: "stations",
        year: "2023",
        status: "active" as const,
        images: [
          "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop",
        ],
      },
      {
        id: "2",
        title: "AED Network",
        description:
          "Automated External Defibrillators installed in all major buildings with clear signage and staff training. Part of our Heart Safe Campus initiative.",
        value: "75",
        unit: "units",
        year: "2024",
        status: "active" as const,
        images: [
          "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=600&fit=crop",
        ],
      },
      {
        id: "3",
        title: "Accessible Pathway Network",
        description:
          "Miles of smooth, well-lit pathways connecting all campus buildings with proper grading, curb cuts, and tactile paving for visually impaired navigation.",
        value: "12",
        unit: "miles",
        year: "2023",
        status: "completed" as const,
        images: [
          "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
        ],
      },
    ] as InfrastructureItem[],
  });
  const [wellness, setWellness] = useState({
    facilities: [
      {
        id: "1",
        title: "Wellness & Recreation Center",
        description:
          "Modern 120,000 sq ft facility featuring fitness equipment, indoor track, climbing wall, swimming pool, yoga studios, and meditation rooms. Powered by 100% renewable energy.",
        value: "120000",
        unit: "sq ft",
        year: "2022",
        status: "completed" as const,
        images: [
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop",
        ],
      },
      {
        id: "2",
        title: "Mental Health & Counseling Center",
        description:
          "Expanded counseling facility with private therapy rooms, group session spaces, and telehealth capabilities. Provides free mental health services to all students.",
        value: "15000",
        unit: "sq ft",
        year: "2024",
        status: "active" as const,
        images: [
          "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=600&fit=crop",
        ],
      },
      {
        id: "3",
        title: "Campus Health Clinic",
        description:
          "Full-service health clinic with primary care, urgent care, pharmacy, and wellness programs. Features green design with natural lighting and healing gardens.",
        value: "25000",
        unit: "sq ft",
        year: "2023",
        status: "completed" as const,
        images: [
          "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop",
        ],
      },
    ] as InfrastructureItem[],
    programs: [
      {
        id: "1",
        title: "Mindfulness & Meditation Programs",
        description:
          "Free daily meditation sessions, mindfulness workshops, and stress reduction programs. Includes guided nature walks and forest bathing experiences in campus arboretum.",
        value: "500",
        unit: "participants/month",
        year: "2024",
        status: "active" as const,
        images: [
          "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&h=600&fit=crop",
        ],
      },
      {
        id: "2",
        title: "Nutrition & Wellness Coaching",
        description:
          "One-on-one nutrition counseling, cooking classes, and wellness coaching. Emphasizes sustainable eating and local food systems.",
        value: "200",
        unit: "participants/semester",
        year: "2024",
        status: "active" as const,
        images: [
          "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop",
        ],
      },
      {
        id: "3",
        title: "Outdoor Adventure Program",
        description:
          "Guided hiking, kayaking, rock climbing, and camping trips promoting physical activity and connection with nature. All equipment provided.",
        value: "300",
        unit: "participants/year",
        year: "2023",
        status: "completed" as const,
        images: [
          "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop",
        ],
      },
    ] as InfrastructureItem[],
  });
  const [smartBuildings, setSmartBuildings] = useState({
    initiatives: [
      {
        id: "1",
        title: "AI-Powered Energy Management",
        description:
          "Machine learning system optimizing HVAC, lighting, and energy use across 45 buildings. Achieved 30% energy reduction in first year of operation.",
        value: "30",
        unit: "% energy reduction",
        year: "2023",
        status: "active" as const,
        images: [
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
        ],
        videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
      },
      {
        id: "2",
        title: "Smart Classroom Technology",
        description:
          "Interactive displays, automated climate control, occupancy sensors, and hybrid learning technology in 200+ classrooms. Reduces energy waste and enhances learning experience.",
        value: "200",
        unit: "classrooms",
        year: "2024",
        status: "active" as const,
        images: [
          "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=600&fit=crop",
        ],
      },
      {
        id: "3",
        title: "Building Automation Network",
        description:
          "Centralized building management system monitoring and controlling all building systems in real-time. Predictive maintenance reduces equipment failures by 40%.",
        value: "45",
        unit: "buildings",
        year: "2023",
        status: "completed" as const,
        images: [
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
        ],
      },
    ] as InfrastructureItem[],
    technologies: [
      {
        id: "1",
        title: "IoT Sensor Network",
        description:
          "Thousands of sensors monitoring air quality, temperature, humidity, occupancy, and energy use. Data informs real-time adjustments and long-term planning.",
        value: "5000",
        unit: "sensors",
        year: "2024",
        status: "active" as const,
        images: [
          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
        ],
      },
      {
        id: "2",
        title: "Smart Lighting System",
        description:
          "LED lighting with occupancy sensors and daylight harvesting. Automatically adjusts based on natural light and room usage, saving 60% on lighting costs.",
        value: "60",
        unit: "% cost reduction",
        year: "2023",
        status: "completed" as const,
        images: [
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=600&fit=crop",
        ],
      },
      {
        id: "3",
        title: "Water Management System",
        description:
          "Smart meters and leak detection sensors across campus. Real-time monitoring has reduced water waste by 25% and prevented costly water damage.",
        value: "25",
        unit: "% water savings",
        year: "2024",
        status: "active" as const,
        images: [
          "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&h=600&fit=crop",
        ],
      },
    ] as InfrastructureItem[],
  });
  const [budget, setBudget] = useState({
    allocations: [
      {
        id: "1",
        title: "Renewable Energy Infrastructure",
        description:
          "Annual budget for solar panel installations, wind turbines, and battery storage systems. Goal: 100% renewable energy by 2030.",
        value: "5000000",
        unit: "USD",
        year: "2024",
        status: "active" as const,
        images: [
          "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop",
        ],
      },
      {
        id: "2",
        title: "Green Building Upgrades",
        description:
          "Funding for LEED certifications, energy-efficient retrofits, and sustainable building materials. Prioritizes oldest buildings with highest energy use.",
        value: "3500000",
        unit: "USD",
        year: "2024",
        status: "active" as const,
        images: [
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
        ],
      },
      {
        id: "3",
        title: "Sustainable Transportation",
        description:
          "Budget for electric vehicle charging stations, bike infrastructure, and shuttle bus electrification. Supports carbon-free campus goal.",
        value: "2000000",
        unit: "USD",
        year: "2024",
        status: "active" as const,
        images: [
          "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&fit=crop",
        ],
      },
      {
        id: "4",
        title: "Water Conservation Projects",
        description:
          "Investment in rainwater harvesting, greywater systems, and efficient irrigation. Target 50% reduction in potable water use.",
        value: "1500000",
        unit: "USD",
        year: "2024",
        status: "active" as const,
        images: [
          "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&h=600&fit=crop",
        ],
      },
    ] as InfrastructureItem[],
    investments: [
      {
        id: "1",
        title: "Green Bond Initiative",
        description:
          "Issued $50M in green bonds to fund major sustainability projects. Projects include solar installations, energy efficiency upgrades, and green building construction.",
        value: "50000000",
        unit: "USD",
        year: "2023",
        status: "completed" as const,
        images: [
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
        ],
      },
      {
        id: "2",
        title: "Endowment for Sustainability",
        description:
          "Established $25M endowment fund generating annual income for ongoing sustainability initiatives and research. Managed with ESG investment criteria.",
        value: "25000000",
        unit: "USD",
        year: "2022",
        status: "completed" as const,
        images: [
          "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=600&fit=crop",
        ],
      },
      {
        id: "3",
        title: "Innovation Fund",
        description:
          "Seed funding for student and faculty sustainability innovation projects. Supports prototypes, pilots, and proof-of-concept demonstrations.",
        value: "1000000",
        unit: "USD/year",
        year: "2024",
        status: "active" as const,
        images: [
          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
        ],
      },
    ] as InfrastructureItem[],
  });
  const [planning, setPlanning] = useState({
    strategies: [
      {
        id: "1",
        title: "Carbon Neutrality Roadmap 2030",
        description:
          "Comprehensive plan to achieve carbon neutrality by 2030 through renewable energy, efficiency improvements, and carbon offsets. Includes annual milestones and accountability measures.",
        value: "2030",
        unit: "target year",
        year: "2024",
        status: "active" as const,
        images: [
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
        ],
      },
      {
        id: "2",
        title: "Climate Adaptation Plan",
        description:
          "Strategy for adapting campus infrastructure to climate change impacts including extreme heat, flooding, and storms. Includes green infrastructure and resilient design standards.",
        value: "2025",
        unit: "implementation year",
        year: "2024",
        status: "active" as const,
        images: [
          "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop",
        ],
      },
      {
        id: "3",
        title: "Circular Economy Framework",
        description:
          "Long-term strategy to eliminate waste through reduction, reuse, and recycling. Goal: Zero waste to landfill by 2035.",
        value: "2035",
        unit: "target year",
        year: "2024",
        status: "planned" as const,
        images: [
          "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=600&fit=crop",
        ],
      },
      {
        id: "4",
        title: "Biodiversity Enhancement Strategy",
        description:
          "Ten-year plan to increase native species diversity, create wildlife corridors, and eliminate invasive species. Includes habitat restoration and monitoring programs.",
        value: "2034",
        unit: "target year",
        year: "2024",
        status: "active" as const,
        images: [
          "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop",
        ],
      },
    ] as InfrastructureItem[],
    expansions: [
      {
        id: "1",
        title: "Innovation District Development",
        description:
          "New 500,000 sq ft mixed-use district featuring net-zero buildings, innovation labs, startup incubators, and green spaces. Designed to LEED Platinum standards.",
        value: "500000",
        unit: "sq ft",
        year: "2026",
        status: "planned" as const,
        images: [
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
        ],
      },
      {
        id: "2",
        title: "Sustainable Housing Complex",
        description:
          "New student housing for 1,200 students featuring passive house design, rooftop solar, rainwater harvesting, and community gardens. Opening Fall 2025.",
        value: "1200",
        unit: "beds",
        year: "2025",
        status: "active" as const,
        images: [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
        ],
      },
      {
        id: "3",
        title: "Research & Innovation Hub",
        description:
          "State-of-the-art research facility for sustainability science and clean technology. Features living laboratory systems and public engagement spaces.",
        value: "150000",
        unit: "sq ft",
        year: "2027",
        status: "planned" as const,
        images: [
          "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop",
        ],
      },
      {
        id: "4",
        title: "Transit-Oriented Development",
        description:
          "Mixed-use development adjacent to new light rail station. Includes academic buildings, retail, and housing designed to reduce car dependency.",
        value: "300000",
        unit: "sq ft",
        year: "2028",
        status: "planned" as const,
        images: [
          "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop",
        ],
      },
    ] as InfrastructureItem[],
  });
  const addItem = (
    category: string,
    subcategory: string,
    item: Omit<InfrastructureItem, "id">
  ) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
    };
    const setters: Record<string, React.Dispatch<React.SetStateAction<any>>> = {
      greenSpaces: setGreenSpaces,
      accessibility: setAccessibility,
      wellness: setWellness,
      smartBuildings: setSmartBuildings,
      budget: setBudget,
      planning: setPlanning,
    };
    const setter = setters[category];
    if (setter) {
      setter((prev: any) => ({
        ...prev,
        [subcategory]: [...prev[subcategory], newItem],
      }));
    }
  };
  const updateItem = (
    category: string,
    subcategory: string,
    id: string,
    item: Omit<InfrastructureItem, "id">
  ) => {
    const setters: Record<string, React.Dispatch<React.SetStateAction<any>>> = {
      greenSpaces: setGreenSpaces,
      accessibility: setAccessibility,
      wellness: setWellness,
      smartBuildings: setSmartBuildings,
      budget: setBudget,
      planning: setPlanning,
    };
    const setter = setters[category];
    if (setter) {
      setter((prev: any) => ({
        ...prev,
        [subcategory]: prev[subcategory].map((i: InfrastructureItem) =>
          i.id === id
            ? {
                ...item,
                id,
              }
            : i
        ),
      }));
    }
  };
  const deleteItem = (category: string, subcategory: string, id: string) => {
    const setters: Record<string, React.Dispatch<React.SetStateAction<any>>> = {
      greenSpaces: setGreenSpaces,
      accessibility: setAccessibility,
      wellness: setWellness,
      smartBuildings: setSmartBuildings,
      budget: setBudget,
      planning: setPlanning,
    };
    const setter = setters[category];
    if (setter) {
      setter((prev: any) => ({
        ...prev,
        [subcategory]: prev[subcategory].filter(
          (item: InfrastructureItem) => item.id !== id
        ),
      }));
    }
  };
  return (
    <InfrastructureContext.Provider
      value={{
        greenSpaces,
        accessibility,
        wellness,
        smartBuildings,
        budget,
        planning,
        addItem,
        updateItem,
        deleteItem,
      }}
    >
      {children}
    </InfrastructureContext.Provider>
  );
}
export function useInfrastructure() {
  const context = useContext(InfrastructureContext);
  if (context === undefined) {
    throw new Error(
      "useInfrastructure must be used within an InfrastructureProvider"
    );
  }
  return context;
}
