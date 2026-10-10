import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  LeafIcon,
  ZapIcon,
  FlaskConicalIcon,
  BuildingIcon,
  TrophyIcon,
  FileBarChartIcon,
  FileTextIcon,
  ChevronRightIcon,
  GlobeIcon,
  UsersIcon,
  DropletIcon,
  RecycleIcon,
  TreesIcon,
  AwardIcon,
  ArrowRightIcon,
  MapPinIcon,
  SparklesIcon,
  MailIcon,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  InstagramIcon,
  DownloadIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  BookOpenIcon,
  TargetIcon,
  ChevronDownIcon,
  MenuIcon,
  XIcon,
  BusIcon,
  Trash2Icon,
  DollarSignIcon,
  HomeIcon,
} from "lucide-react";
import { useGovernance } from "../contexts/GovernanceContext";
import { useEnvironment } from "../contexts/EnvironmentContext";
import { useResearch } from "../contexts/ResearchContext";
import { useInfrastructure } from "../contexts/InfrastructureContext";
import { useAchievement } from "../contexts/AchievementContext";
import { useReports } from "../contexts/ReportsContext";
import { SDGWheel } from "../components/SDGWheel";
import { useSDG } from "../contexts/SDGContext";
// Navigation menu structure
const navigationMenu = [
  {
    title: "Governance",
    icon: FileTextIcon,
    color: "emerald",
    path: "/governance/site",
  },
  {
    title: "Environment",
    icon: LeafIcon,
    color: "green",
    path: "/environment/site",
  },
  {
    title: "Research",
    icon: FlaskConicalIcon,
    color: "purple",
    path: "/research/site",
  },
  {
    title: "Infrastructure",
    icon: BuildingIcon,
    color: "orange",
    path: "/infrastructure/site",
  },
  {
    title: "Achievements",
    icon: TrophyIcon,
    color: "yellow",
    path: "/achievements/site",
  },
  {
    title: "Reports",
    icon: FileBarChartIcon,
    color: "red",
    path: "/reports/site",
  },
  {
    title: "Whitepapers",
    icon: FileTextIcon,
    color: "indigo",
    path: "/ranking-data/site",
  },
];
export function HomePage() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [currentRanking, setCurrentRanking] = useState(0);
  const [hoveredGoal, setHoveredGoal] = useState<number | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Import all contexts for real data with safe defaults
  const { greenOffice, committees, studentCouncil } = useGovernance();
  const {
    energyClimate,
    wasteManagement,
    waterConservation,
    biodiversity,
    transportation: envTransportation,
  } = useEnvironment();
  const {
    publications,
    funding,
    patents,
    studentResearch,
    collaborations,
    outreach,
  } = useResearch();
  const infrastructureData = useInfrastructure();
  const {
    awards,
    certifications,
    rankings: achievementRankings,
  } = useAchievement();
  const { annualReports } = useReports();
  const { sdgData, researchActivities, reports } = useSDG();
  const [activeDataType, setActiveDataType] = useState<
    "all" | "publications" | "research" | "patents" | "initiatives"
  >("all");
  // Data Type Configuration
  const dataTypeConfig = {
    all: {
      label: "All Data",
      icon: TargetIcon,
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-100",
      textColor: "text-purple-700",
      badgeColor: "bg-purple-500",
    },
    publications: {
      label: "Publications",
      icon: BookOpenIcon,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
      badgeColor: "bg-blue-500",
    },
    research: {
      label: "Research Projects",
      icon: FlaskConicalIcon,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      badgeColor: "bg-green-500",
    },
    patents: {
      label: "Patents",
      icon: AwardIcon,
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-100",
      textColor: "text-amber-700",
      badgeColor: "bg-amber-500",
    },
    initiatives: {
      label: "Initiatives",
      icon: SparklesIcon,
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-100",
      textColor: "text-pink-700",
      badgeColor: "bg-pink-500",
    },
  };
  // Safely extract infrastructure data with fallbacks
  const greenBuildings = {
    openAreas: infrastructureData?.greenSpaces?.openAreas || [],
    forestedZones: infrastructureData?.greenSpaces?.forestedZones || [],
    initiatives: infrastructureData?.smartBuildings?.initiatives || [],
    technologies: infrastructureData?.smartBuildings?.technologies || [],
  };

  const totalgreenBuildings =
    greenBuildings.openAreas.length +
    greenBuildings.forestedZones.length +
    greenBuildings.initiatives.length +
    greenBuildings.technologies.length;

  const transportation = infrastructureData?.transportation || {
    shuttleServices: [],
    pedestrianPaths: [],
    zeroEmission: [],
    parkingReduction: [],
  };
  const accessibility = infrastructureData?.accessibility || {
    facilities: [],
    programs: [],
  };
  // Calculate real statistics with safe access
  const totalMembers =
    (greenOffice?.members?.length || 0) +
    (committees?.reduce((sum, c) => sum + (c.members?.length || 0), 0) || 0) +
    (studentCouncil?.members?.length || 0);

  // TOP OF COMPONENT
  const [pubData, setPubData] = useState([]);

  // FETCH FROM API
  useEffect(() => {
    fetch("http://180.235.121.250:8006/api/research_site/publications/all")
      .then((res) => res.json())
      .then((data) => {
        console.log("RAW PUBLICATION API RESPONSE:", data);
        setPubData(data);
      })
      .catch((err) => console.error("API Error:", err));
  }, []);

  // console.log("pubData state:", pubData);

  // COUNT
  const totalPublications =
    (pubData.journals?.length || 0) +
    (pubData.conferences?.length || 0) +
    (pubData.books?.length || 0);

  const [fundingData, setFundingData] = useState([]);
  // FETCH FUNDING
  useEffect(() => {
    fetch("http://180.235.121.250:8006/api/research_site/funding/all")
      .then((res) => res.json())
      .then((data) => {
        console.log("RAW FUNDING API RESPONSE:", data);
        setFundingData(data);
      })
      .catch((err) => console.error("Funding API Error:", err));
  }, []);
  const totalFunding =
    (fundingData.grants?.length || 0) +
    (fundingData.corporateSponsorship?.length || 0) +
    (fundingData.governmentFunding?.length || 0);

  const [patentsData, setPatentsData] = useState({ data: { patents: [] } });

  useEffect(() => {
    fetch(
      "http://180.235.121.250:8006/api/research_site/patents/all?ts=" +
        Date.now(),
      {
        cache: "no-store",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("RAW PATENTS API RESPONSE:", data);
        setPatentsData(data);
      })
      .catch((err) => console.error("Patents API Error:", err));
  }, []);

  // ---------- CORRECT TOTAL PATENTS (NO DOUBLE COUNT) ----------

  // All patents
  const allPatents = patentsData.data?.patents || [];

  // Total patents (your raw count = 3260)
  const totalPatents = allPatents.length;

  const missingSDG = [];

  allPatents.forEach((p) => {
    const raw = p.sdgGoals;

    try {
      const parsed = JSON.parse(
        raw
          ?.trim()
          ?.replace(/'/g, '"')
          ?.replace(/\s+/g, "")
          ?.replace(/,]/g, "]")
          ?.replace(/\[,/g, "[")
      );

      if (Array.isArray(parsed)) {
        // OK
      } else {
        missingSDG.push({ id: p.id, sdgGoals: raw });
      }
    } catch (e) {
      missingSDG.push({ id: p.id, sdgGoals: raw });
    }
  });

  // console.log(totalPatents);

  const [researchData, setResearchData] = useState({
    data: { thesis: [], projects: [] },
  });
  useEffect(() => {
    fetch("http://180.235.121.250:8006/api/research_site/studentResearch/all")
      .then((res) => res.json())
      .then((data) => {
        console.log("RAW STUDENT RESEARCH API RESPONSE:", data);
        setResearchData(data);
      })
      .catch((err) => console.error("Research API Error:", err));
  }, []);

  const totalResearch =
    (researchData.data?.thesis?.length || 0) +
    (researchData.data?.projects?.length || 0);

  const totalBuildings =
    (greenBuildings?.leedCertified?.length || 0) +
    (greenBuildings?.energyEfficient?.length || 0) +
    (greenBuildings?.smartBuildings?.length || 0);
  // const totalAwards =
  //   (awards?.environmental?.length || 0) +
  //   (awards?.research?.length || 0) +
  //   (awards?.community?.length || 0);

  const totalAwards = awards.length;
  const [initiativesData, setInitiativesData] = useState({
    data: {
      industry: [],
      international: [],
      service: [],
      community: [],
    },
    total: 0,
  });
  useEffect(() => {
    fetch("http://180.235.121.250:8006/api/research_site/initiatives/all")
      .then((res) => res.json())
      .then((data) => {
        console.log("RAW INITIATIVES API RESPONSE:", data);
        setInitiativesData(data);
      })
      .catch((err) => console.error("Initiatives API Error:", err));
  }, []);
  const totalInitiatives = initiativesData.total || 0;

  // const totalAwards = awards.length;
  // Calculate real KPI percentages using EnvironmentContext data
  const calculateEnergyPercentage = () => {
    const renewable = energyClimate?.renewableEnergy?.length || 0;
    const energyPrograms = energyClimate?.energyPrograms?.length || 0;
    const total = renewable + energyPrograms;
    return total > 0
      ? Math.min(Math.round((renewable / total) * 100), 100)
      : 45;
  };
  const calculateWasteReduction = () => {
    const recycling = wasteManagement?.generalWaste?.length || 0;
    const composting = wasteManagement?.foodWaste?.length || 0;
    const total =
      recycling + composting + (wasteManagement?.eWaste?.length || 0);
    return total > 0
      ? Math.min(Math.round(((recycling + composting) / total) * 100), 100)
      : 60;
  };
  const calculateWaterConservation = () => {
    const conservation = waterConservation?.conservation?.length || 0;
    const recycling = waterConservation?.recycling?.length || 0;
    const total =
      conservation +
      recycling +
      (waterConservation?.efficientAppliances?.length || 0);
    return total > 0
      ? Math.min(Math.round(((conservation + recycling) / total) * 100), 100)
      : 55;
  };
  const calculateCarbonReduction = () => {
    const greenCorridors = biodiversity?.greenCorridors?.length || 0;
    const nativePlants = biodiversity?.floraFauna?.length || 0;
    return Math.min((greenCorridors + nativePlants) * 10, 100) || 50;
  };
  // SDG Goals configuration
  const sdgGoals = [
    {
      number: 1,
      title: "No Poverty",
      color: "from-red-500 to-red-700",
      bgColor: "bg-red-600",
      solidColor: "#E5243B",
      icon: "🏠",
    },
    {
      number: 2,
      title: "Zero Hunger",
      color: "from-yellow-500 to-yellow-700",
      bgColor: "bg-yellow-600",
      solidColor: "#DDA63A",
      icon: "🌾",
    },
    {
      number: 3,
      title: "Good Health",
      color: "from-green-500 to-green-700",
      bgColor: "bg-green-600",
      solidColor: "#4C9F38",
      icon: "❤️",
    },
    {
      number: 4,
      title: "Quality Education",
      color: "from-red-600 to-red-800",
      bgColor: "bg-red-700",
      solidColor: "#C5192D",
      icon: "📚",
    },
    {
      number: 5,
      title: "Gender Equality",
      color: "from-orange-500 to-orange-700",
      bgColor: "bg-orange-600",
      solidColor: "#FF3A21",
      icon: "⚖️",
    },
    {
      number: 6,
      title: "Clean Water",
      color: "from-cyan-500 to-cyan-700",
      bgColor: "bg-cyan-600",
      solidColor: "#26BDE2",
      icon: "💧",
    },
    {
      number: 7,
      title: "Clean Energy",
      color: "from-yellow-400 to-yellow-600",
      bgColor: "bg-yellow-500",
      solidColor: "#FCC30B",
      icon: "⚡",
    },
    {
      number: 8,
      title: "Economic Growth",
      color: "from-red-700 to-red-900",
      bgColor: "bg-red-800",
      solidColor: "#A21942",
      icon: "💼",
    },
    {
      number: 9,
      title: "Innovation",
      color: "from-orange-600 to-orange-800",
      bgColor: "bg-orange-700",
      solidColor: "#FD6925",
      icon: "🏗️",
    },
    {
      number: 10,
      title: "Reduced Inequalities",
      color: "from-pink-500 to-pink-700",
      bgColor: "bg-pink-600",
      solidColor: "#DD1367",
      icon: "🤝",
    },
    {
      number: 11,
      title: "Sustainable Cities",
      color: "from-amber-500 to-amber-700",
      bgColor: "bg-amber-600",
      solidColor: "#FD9D24",
      icon: "🏙️",
    },
    {
      number: 12,
      title: "Responsible Consumption",
      color: "from-yellow-600 to-yellow-800",
      bgColor: "bg-yellow-700",
      solidColor: "#BF8B2E",
      icon: "♻️",
    },
    {
      number: 13,
      title: "Climate Action",
      color: "from-green-600 to-green-800",
      bgColor: "bg-green-700",
      solidColor: "#3F7E44",
      icon: "🌍",
    },
    {
      number: 14,
      title: "Life Below Water",
      color: "from-blue-500 to-blue-700",
      bgColor: "bg-blue-600",
      solidColor: "#0A97D9",
      icon: "🐠",
    },
    {
      number: 15,
      title: "Life on Land",
      color: "from-lime-500 to-lime-700",
      bgColor: "bg-lime-600",
      solidColor: "#56C02B",
      icon: "🌳",
    },
    {
      number: 16,
      title: "Peace & Justice",
      color: "from-blue-700 to-blue-900",
      bgColor: "bg-blue-800",
      solidColor: "#00689D",
      icon: "⚖️",
    },
    {
      number: 17,
      title: "Partnerships",
      color: "from-indigo-600 to-indigo-800",
      bgColor: "bg-indigo-700",
      solidColor: "#19486A",
      icon: "🌐",
    },
  ];
  const sdgAngleMap: Record<number, number> = {
    17: -90,
    1: -90 + (360 / 17) * 1,
    2: -90 + (360 / 17) * 2,
    3: -90 + (360 / 17) * 3,
    4: -90 + (360 / 17) * 4,
    5: -90 + (360 / 17) * 5,
    6: -90 + (360 / 17) * 6,
    7: -90 + (360 / 17) * 7,
    8: -90 + (360 / 17) * 8,
    9: -90 + (360 / 17) * 9,
    10: -90 + (360 / 17) * 10,
    11: -90 + (360 / 17) * 11,
    12: -90 + (360 / 17) * 12,
    13: -90 + (360 / 17) * 13,
    14: -90 + (360 / 17) * 14,
    15: -90 + (360 / 17) * 15,
    16: -90 + (360 / 17) * 16,
  };
  const navigationSections = [
    {
      id: 1,
      title: "Governance",
      icon: FileTextIcon,
      color: "from-emerald-400 to-green-600",
      path: "/governance/site",
      description: "Leadership & sustainability governance framework",
      count: totalMembers,
      label: "Team Members",
    },
    {
      id: 2,
      title: "Environment",
      icon: LeafIcon,
      color: "from-green-400 to-teal-600",
      path: "/environment/site",
      description: "Climate action, conservation & biodiversity",
      count:
        (energyClimate?.renewableEnergy?.length || 0) +
        (wasteManagement?.generalWaste?.length || 0),
      label: "Initiatives",
    },
    {
      id: 3,
      title: "Research",
      icon: FlaskConicalIcon,
      color: "from-teal-400 to-cyan-600",
      path: "/research/site",
      description: "Innovation, publications & sustainable solutions",
      count: totalPublications,
      label: "Publications",
    },
    {
      id: 4,
      title: "Infrastructure",
      icon: BuildingIcon,
      color: "from-cyan-400 to-blue-600",
      path: "/infrastructure/site",
      description: "Green buildings, smart campus & accessibility",
      count: totalgreenBuildings,
      label: "Green Buildings",
    },
    {
      id: 5,
      title: "Achievements",
      icon: TrophyIcon,
      color: "from-blue-400 to-indigo-600",
      path: "/achievements/site",
      description: "Awards, recognition & milestones",
      count: totalAwards,
      label: "Awards",
    },
    {
      id: 6,
      title: "Reports",
      icon: FileBarChartIcon,
      color: "from-indigo-400 to-purple-600",
      path: "/reports/site",
      description: "Impact reports & sustainability metrics",
      count: annualReports?.length || 0,
      label: "Reports",
    },
  ];
  const kpis = [
    {
      label: "Renewable Energy",
      value: calculateEnergyPercentage(),
      unit: "%",
      icon: ZapIcon,
      color: "from-yellow-400 to-orange-500",
      path: "/environment/site",
    },
    {
      label: "Waste Reduction",
      value: calculateWasteReduction(),
      unit: "%",
      icon: RecycleIcon,
      color: "from-green-400 to-emerald-500",
      path: "/environment/site",
    },
    {
      label: "Water Conservation",
      value: calculateWaterConservation(),
      unit: "%",
      icon: DropletIcon,
      color: "from-blue-400 to-cyan-500",
      path: "/environment/site",
    },
    {
      label: "Carbon Reduction",
      value: calculateCarbonReduction(),
      unit: "%",
      icon: LeafIcon,
      color: "from-emerald-400 to-teal-500",
      path: "/environment/site",
    },
  ];
  const rankings =
    achievementRankings?.length > 0
      ? achievementRankings.map((rank) => ({
          name: rank.title,
          rank: rank.description || "Recognized",
          year: rank.year || "2024",
          logo:
            rank.images?.[0] ||
            "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop",
          category: rank.category || "Achievement",
        }))
      : [
          {
            name: "THE Impact Rankings",
            rank: "101-200",
            year: "2024",
            logo: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop",
            category: "Global Ranking",
          },
        ];
  const campusHotspots = [
    {
      title: "Solar Power",
      description: `${
        energyClimate?.renewableEnergy?.length || 0
      } installations`,
      icon: ZapIcon,
      path: "/environment/site",
    },
    {
      title: "Water Systems",
      description: `${
        waterConservation?.conservation?.length || 0
      } conservation systems`,
      icon: DropletIcon,
      path: "/environment/site",
    },
    {
      title: "Green Buildings",
      description: `${totalBuildings} certified buildings`,
      icon: BuildingIcon,
      path: "/infrastructure/site",
    },
    {
      title: "Biodiversity",
      description: `${
        biodiversity?.floraFauna?.length || 0
      } conservation areas`,
      icon: TreesIcon,
      path: "/environment/site",
    },
  ];
  // Calculate publications per SDG
  const getPublicationsForSDG = (goalNumber: number) => {
    const allPublications = [
      ...(pubData.journals || []),
      ...(pubData.conferences || []),
      ...(pubData.books || []),
    ];

    return allPublications.filter((pub) => {
      if (!pub.sdgGoals) return false;

      // Parse "[1]" or "[1,2,3]" safely
      let sdgs = [];

      try {
        sdgs = JSON.parse(pub.sdgGoals); // NOW it becomes [1,2,3]
      } catch (e) {
        return false;
      }

      return Array.isArray(sdgs) && sdgs.includes(goalNumber);
    });
  };

  // Calculate research projects per SDG
  const getResearchForSDG = (goalNumber: number) => {
    // Combine thesis + projects
    const allResearch = [
      ...(researchData.data?.thesis || []),
      ...(researchData.data?.projects || []),
    ];

    return allResearch.filter((item) => {
      if (!item.sdgGoals) return false;

      let sdgArray;

      try {
        sdgArray = JSON.parse(item.sdgGoals); // Convert "[3,4]" → [3,4]
      } catch {
        return false;
      }

      return Array.isArray(sdgArray) && sdgArray.includes(goalNumber);
    });
  };

  // Safe SDG parser based on your actual format
  const parseSDG = (sdgString: any): number[] => {
    if (!sdgString || sdgString.trim() === "") return [];

    try {
      const parsed = JSON.parse(sdgString.trim());

      if (Array.isArray(parsed)) {
        return parsed.map(Number).filter((n) => !isNaN(n) && n > 0);
      }

      return [];
    } catch {
      return [];
    }
  };

  // Calculate patents per SDG (FINAL VERSION)
  const getPatentsForSDG = (goalNumber: number) => {
    return allPatents.filter((item) => {
      const goals = parseSDG(item.sdgGoals);
      return goals.includes(goalNumber);
    });
  };

  // Calculate initiatives per SDG
  const getInitiativesForSDG = (goalNumber: number) => {
    const allInitiatives = [
      ...(initiativesData.data?.industry || []),
      ...(initiativesData.data?.international || []),
      ...(initiativesData.data?.service || []),
      ...(initiativesData.data?.community || []),
    ];

    return allInitiatives.filter((item) => {
      if (!item.sdgGoals) return false;

      let sdgArray;

      try {
        sdgArray = JSON.parse(item.sdgGoals); // "[4,17]" → [4,17]
      } catch {
        return false;
      }

      return Array.isArray(sdgArray) && sdgArray.includes(goalNumber);
    });
  };

  // Get count based on active data type
  const getCountForSDG = (goalNumber: number): number => {
    switch (activeDataType) {
      case "publications":
        return getPublicationsForSDG(goalNumber).length;
      case "research":
        return getResearchForSDG(goalNumber).length;
      case "patents":
        return getPatentsForSDG(goalNumber).length;
      case "initiatives":
        return getInitiativesForSDG(goalNumber).length;
      case "all":
        return (
          getPublicationsForSDG(goalNumber).length +
          getResearchForSDG(goalNumber).length +
          getPatentsForSDG(goalNumber).length +
          getInitiativesForSDG(goalNumber).length
        );
      default:
        return 0;
    }
  };
  // Calculate total for center display
  const getTotalCount = (): number => {
    return sdgGoals.reduce((sum, goal) => sum + getCountForSDG(goal.number), 0);
  };
  const activeConfig = dataTypeConfig[activeDataType];
  const ActiveIcon = activeConfig.icon;
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRanking((prev) => (prev + 1) % rankings.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [rankings.length]);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const AnimatedCounter = ({
    end,
    duration = 2,
  }: {
    end: number;
    duration?: number;
  }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let startTime: number | null = null;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min(
          (timestamp - startTime) / (duration * 1000),
          1
        );
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }, [end, duration]);
    return <span>{count}</span>;
  };
  // Parallax effect for hero
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  // Helper function to navigate and scroll to top
  const navigateToPage = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-emerald-50 via-teal-50 to-cyan-50">
      {/* Navigation Bar */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-lg shadow-lg" : "bg-transparent"
        }`}
        initial={{
          y: -100,
        }}
        animate={{
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button
              onClick={() => navigateToPage("/")}
              className="flex items-center gap-3 group"
            >
              <div className="w-16 h-16 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <img
                  src="/simats_logo_400x400-3.png"
                  alt="SIMATS Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1
                className={`text-lg font-bold transition-colors ${
                  scrolled ? "text-gray-900" : "text-white"
                }`}
              >
                SIMATS Sustainability
              </h1>
            </button>
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navigationMenu.map((item) => {
                const Icon = item.icon;
                const hasDropdown = item.items && item.items.length > 0;
                return (
                  <div
                    key={item.title}
                    className="relative"
                    onMouseEnter={() =>
                      hasDropdown && setActiveDropdown(item.title)
                    }
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      onClick={() => {
                        if (item.path) {
                          navigateToPage(item.path);
                        }
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        scrolled
                          ? "text-gray-700 hover:bg-gray-100"
                          : "text-white hover:bg-white/20"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.title}</span>
                      {hasDropdown && (
                        <ChevronDownIcon
                          className={`w-4 h-4 transition-transform ${
                            activeDropdown === item.title ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>
                    {/* Dropdown Menu */}
                    {hasDropdown && activeDropdown === item.title && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 10,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          y: 10,
                        }}
                        className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
                      >
                        <div className="p-2">
                          {item.items?.map((subItem) => {
                            const SubIcon = subItem.icon;
                            return (
                              <button
                                key={subItem.path}
                                onClick={() => {
                                  navigateToPage(subItem.path);
                                  setActiveDropdown(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                              >
                                <SubIcon className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                                <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                                  {subItem.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                scrolled
                  ? "hover:bg-gray-100 text-gray-900"
                  : "hover:bg-white/20 text-white"
              }`}
            >
              {mobileMenuOpen ? (
                <XIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className="lg:hidden bg-white border-t border-gray-100"
            >
              <div className="max-w-7xl mx-auto px-6 py-4 space-y-2 max-h-[80vh] overflow-y-auto">
                {navigationMenu.map((item) => {
                  const Icon = item.icon;
                  const hasDropdown = item.items && item.items.length > 0;
                  return (
                    <div key={item.title}>
                      <button
                        onClick={() => {
                          if (hasDropdown) {
                            setActiveDropdown(
                              activeDropdown === item.title ? null : item.title
                            );
                          } else if (item.path) {
                            navigateToPage(item.path);
                            setMobileMenuOpen(false);
                          }
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-gray-600" />
                          <span className="font-medium text-gray-900">
                            {item.title}
                          </span>
                        </div>
                        {hasDropdown && (
                          <ChevronDownIcon
                            className={`w-5 h-5 text-gray-400 transition-transform ${
                              activeDropdown === item.title ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </button>
                      {/* Mobile Dropdown */}
                      {hasDropdown && activeDropdown === item.title && (
                        <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-200 pl-4">
                          {item.items?.map((subItem) => {
                            const SubIcon = subItem.icon;
                            return (
                              <button
                                key={subItem.path}
                                onClick={() => {
                                  navigateToPage(subItem.path);
                                  setMobileMenuOpen(false);
                                  setActiveDropdown(null);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                              >
                                <SubIcon className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-700">
                                  {subItem.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                {/* <button
                  onClick={() => {
                    navigateToPage("/dashboard");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold shadow-lg mt-4"
                >
                  Admin Dashboard
                </button> */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      {/* Hero Section with Image Background */}
      <motion.section
        style={{
          y: heroY,
          opacity: heroOpacity,
        }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/IMG_4245a-small.jpg"
            alt="SIMATS Campus"
            className="w-full h-full object-cover"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{
              y: 50,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            transition={{
              delay: 0.3,
              duration: 0.8,
            }}
            className="mb-8"
          >
            <motion.div
              className="inline-block mb-6"
              animate={{
                rotateY: [0, 20, -20, 0],
                rotateZ: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <img
                src="/simats_logo_400x400-3.png"
                alt="SIMATS Logo"
                className="w-32 h-32 object-contain drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
          <motion.h1
            className="text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl"
            initial={{
              y: 50,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            transition={{
              delay: 0.5,
              duration: 0.8,
            }}
          >
            SIMATS Sustainability
            <br />
            <span className="text-emerald-400">Leading the Way Forward</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto drop-shadow-lg"
            initial={{
              y: 50,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            transition={{
              delay: 0.7,
              duration: 0.8,
            }}
          >
            Saveetha Institute of Medical and Technical Sciences - Pioneering
            sustainable solutions through innovative research, responsible
            governance, and campus-wide environmental stewardship
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{
              y: 50,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            transition={{
              delay: 0.9,
              duration: 0.8,
            }}
          >
            <motion.button
              onClick={() => navigateToPage("/environment/site")}
              className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full font-semibold text-lg shadow-xl overflow-hidden"
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Explore Our Sustainability Journey
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600"
                initial={{
                  x: "-100%",
                }}
                whileHover={{
                  x: 0,
                }}
                transition={{
                  duration: 0.3,
                }}
              />
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <ChevronRightIcon className="w-8 h-8 text-white rotate-90 drop-shadow-lg" />
        </motion.div>
      </motion.section>

      {/* SDG Wheel Section - Enhanced Version from Research Site */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{
              opacity: 0,
              y: 50,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
            }}
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              UN Sustainable Development Goals
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SIMATS is committed to advancing all 17 UN Sustainable Development
              Goals through research, education, and community engagement
            </p>
          </motion.div>
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
            }}
          >
            {/* Data Type Toggle */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex bg-gray-100 rounded-2xl p-2 gap-2 shadow-inner">
                {(
                  Object.keys(dataTypeConfig) as Array<
                    keyof typeof dataTypeConfig
                  >
                ).map((type) => {
                  const config = dataTypeConfig[type];
                  const Icon = config.icon;
                  const isActive = activeDataType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setActiveDataType(type)}
                      className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                        isActive
                          ? `bg-gradient-to-r ${config.color} text-white shadow-lg transform scale-105`
                          : "text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${isActive ? "animate-pulse" : ""}`}
                      />
                      <span className="relative z-10">{config.label}</span>
                      {isActive && (
                        <span className="relative z-10 px-2 py-0.5 bg-white/30 rounded-full text-xs font-bold">
                          {getTotalCount()}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* UN SDG Wheel Container */}
            <div
              className="relative w-full max-w-4xl mx-auto"
              style={{
                aspectRatio: "1",
              }}
            >
              {/* Background UN SDG Wheel Image */}
              <img
                src="/un-sustainable-development-goals.png"
                alt="UN Sustainable Development Goals Wheel"
                className="absolute inset-0 w-full h-full object-contain z-0"
              />
              {/* Interactive Segment Overlays */}
              {sdgGoals.map((goal) => {
                const ROTATION_OFFSET = -7; // anticlockwise & alignment tweak
                const total = sdgGoals.length;
                const seg = 360 / total;

                // Apply anticlockwise rotation
                let mid = sdgAngleMap[goal.number] + ROTATION_OFFSET;

                // Compute segment boundaries
                let start = mid - seg / 2;
                let end = mid + seg / 2;

                // Fix exact top alignment for SDG 17
                if (goal.number === 17) {
                  start = -90 + ROTATION_OFFSET - seg / 2;
                  end = -90 + ROTATION_OFFSET + seg / 2;
                }

                // Radii for inner and outer clipping of segment
                const innerR = 15;
                const outerR = 42;

                const toXY = (ang, r) => ({
                  x: 50 + r * Math.cos((ang * Math.PI) / 180),
                  y: 50 + r * Math.sin((ang * Math.PI) / 180),
                });

                // Final clipping polygon points (anticlockwise)
                const innerStart = toXY(start, innerR);
                const outerStart = toXY(start, outerR);
                const outerEnd = toXY(end, outerR);
                const innerEnd = toXY(end, innerR);

                const isHovered = hoveredGoal === goal.number;
                const hasData = getCountForSDG(goal.number) > 0;

                return (
                  <div
                    key={`segment-${goal.number}`}
                    className="absolute inset-0 cursor-pointer"
                    style={{
                      clipPath: `polygon(
          ${innerStart.x}% ${innerStart.y}%,
          ${outerStart.x}% ${outerStart.y}%,
          ${outerEnd.x}% ${outerEnd.y}%,
          ${innerEnd.x}% ${innerEnd.y}%
        )`,
                    }}
                    onMouseEnter={() => setHoveredGoal(goal.number)}
                    onMouseLeave={() => setHoveredGoal(null)}
                    onClick={() => {
                      if (!hasData) return;
                      navigate(`/sdg/consolidated/${goal.number}`, {
                        state: { type: activeDataType },
                      });
                    }}
                  >
                    <div
                      className={`absolute inset-0 transition-all duration-300 ${
                        isHovered ? "bg-white/30" : "bg-transparent"
                      }`}
                      style={{
                        backdropFilter: isHovered ? "blur(2px)" : "none",
                      }}
                    />

                    {isHovered && hasData && (
                      <div
                        className="absolute inset-0 animate-ping"
                        style={{
                          background: `radial-gradient(circle at 50% 50%, ${goal.solidColor}40 0%, transparent 70%)`,
                        }}
                      />
                    )}
                  </div>
                );
              })}

              {/* Interactive Badge Overlays */}
              {sdgGoals.map((goal) => {
                // rotate anticlockwise
                const ROTATION_OFFSET = -8;

                const badgeAngle = sdgAngleMap[goal.number] + ROTATION_OFFSET;
                const radius = 28.5;

                // compute new badge position with anticlockwise adjustment
                const x = 50 + radius * Math.cos((badgeAngle * Math.PI) / 180);
                const y = 50 + radius * Math.sin((badgeAngle * Math.PI) / 180);

                const count = getCountForSDG(goal.number);
                const hasData = count > 0;
                const isHovered = hoveredGoal === goal.number;

                return (
                  <div
                    key={goal.number}
                    onMouseEnter={() => setHoveredGoal(goal.number)}
                    onMouseLeave={() => setHoveredGoal(null)}
                    onClick={() => {
                      if (!hasData) return;

                      navigate(`/sdg/consolidated/${goal.number}`, {
                        state: { type: activeDataType },
                      });
                    }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                      isHovered ? "scale-125 z-20" : "z-10"
                    }`}
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      cursor: hasData ? "pointer" : "default", // ✅ Added this line
                    }}
                  >
                    <div className="relative">
                      {isHovered && hasData && (
                        <>
                          <div
                            className="absolute inset-0 rounded-full blur-lg opacity-60 animate-pulse"
                            style={{ backgroundColor: goal.solidColor }}
                          />
                          <div
                            className="absolute inset-0 rounded-full blur-2xl opacity-40"
                            style={{
                              backgroundColor: goal.solidColor,
                              animation:
                                "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
                            }}
                          />
                        </>
                      )}

                      <div
                        className={`relative rounded-full flex flex-col items-center justify-center shadow-xl border-4 transition-all duration-300 ${
                          isHovered ? "w-24 h-24" : "w-20 h-20"
                        } bg-white`}
                        style={{
                          borderColor: hasData ? goal.solidColor : "#d1d5db",
                          boxShadow:
                            isHovered && hasData
                              ? `0 0 30px ${goal.solidColor}aa, 0 0 60px ${goal.solidColor}66, 0 10px 40px rgba(0,0,0,0.3)`
                              : hasData
                              ? `0 4px 20px ${goal.solidColor}66`
                              : "0 2px 8px rgba(0,0,0,0.1)",
                          transform: isHovered
                            ? "rotate(5deg)"
                            : "rotate(0deg)",
                        }}
                      >
                        <div className="text-center">
                          <span
                            className={`text-base font-bold block mb-1 ${
                              isHovered ? "scale-110" : ""
                            } transition-transform`}
                            style={{
                              color: hasData ? goal.solidColor : "#9ca3af",
                            }}
                          >
                            SDG {goal.number}
                          </span>
                          <span
                            className={`text-2xl font-bold drop-shadow-sm block ${
                              isHovered ? "scale-110" : ""
                            } transition-transform`}
                            style={{
                              color: hasData ? goal.solidColor : "#9ca3af",
                            }}
                          >
                            {count}
                          </span>
                        </div>
                      </div>

                      {isHovered && hasData && (
                        <>
                          <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
                          <div
                            className="absolute -bottom-2 -left-2 w-2 h-2 bg-yellow-300 rounded-full animate-ping"
                            style={{ animationDelay: "0.3s" }}
                          />
                          <div
                            className="absolute -top-1 -left-1 w-2 h-2 bg-white rounded-full animate-ping"
                            style={{ animationDelay: "0.15s" }}
                          />
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Center Hover Details Display */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
                {hoveredGoal
                  ? (() => {
                      const goal = sdgGoals.find(
                        (g) => g.number === hoveredGoal
                      );
                      const count = getCountForSDG(hoveredGoal);
                      const hasData = count > 0;
                      return (
                        <div
                          className="bg-white/95 backdrop-blur-sm rounded-full p-5 shadow-2xl border-4 transition-all duration-300 aspect-square flex items-center justify-center overflow-hidden"
                          style={{
                            borderColor: goal?.solidColor,
                            width: "320px",
                            height: "320px",
                          }}
                        >
                          <div className="text-center w-full h-full flex flex-col items-center justify-center px-3">
                            <div
                              className="mb-2 pb-2 border-b-2 w-full"
                              style={{
                                borderColor: goal?.solidColor,
                              }}
                            >
                              <div className="text-4xl mb-1">{goal?.icon}</div>
                              <p
                                className="font-bold text-xs opacity-90 mb-1"
                                style={{
                                  color: goal?.solidColor,
                                }}
                              >
                                SDG {goal?.number}
                              </p>
                              <p
                                className="font-bold text-lg line-clamp-2 leading-tight"
                                style={{
                                  color: goal?.solidColor,
                                }}
                              >
                                {goal?.title}
                              </p>
                            </div>
                            {hasData ? (
                              <div className="space-y-1 text-xs px-1 mx-auto w-[88%] md:w-[90%]">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                  <ActiveIcon
                                    className="w-5 h-5 flex-shrink-0"
                                    style={{
                                      color: goal?.solidColor,
                                    }}
                                  />
                                  <span
                                    className="font-bold text-2xl"
                                    style={{
                                      color: goal?.solidColor,
                                    }}
                                  >
                                    {count}
                                  </span>
                                  <span className="text-sm text-gray-600 font-medium truncate">
                                    {activeConfig.label}
                                  </span>
                                </div>
                                {activeDataType === "all" && (
                                  <div className="space-y-1 text-xs px-1">
                                    {/* Publications */}
                                    {getPublicationsForSDG(hoveredGoal).length >
                                      0 && (
                                      <div
                                        className="flex justify-between items-center p-1 rounded"
                                        style={{
                                          backgroundColor: `${goal?.solidColor}15`,
                                        }}
                                      >
                                        <span className="text-gray-700 font-medium">
                                          Publications
                                        </span>
                                        <span
                                          className="font-bold ml-1"
                                          style={{ color: goal?.solidColor }}
                                        >
                                          {
                                            getPublicationsForSDG(hoveredGoal)
                                              .length
                                          }
                                        </span>
                                      </div>
                                    )}

                                    {/* Research */}
                                    {getResearchForSDG(hoveredGoal).length >
                                      0 && (
                                      <div
                                        className="flex justify-between items-center p-1 rounded"
                                        style={{
                                          backgroundColor: `${goal?.solidColor}15`,
                                        }}
                                      >
                                        <span className="text-gray-700 font-medium">
                                          Research
                                        </span>
                                        <span
                                          className="font-bold ml-1"
                                          style={{ color: goal?.solidColor }}
                                        >
                                          {
                                            getResearchForSDG(hoveredGoal)
                                              .length
                                          }
                                        </span>
                                      </div>
                                    )}

                                    {/* Patents */}
                                    {getPatentsForSDG(hoveredGoal).length >
                                      0 && (
                                      <div
                                        className="flex justify-between items-center p-1 rounded"
                                        style={{
                                          backgroundColor: `${goal?.solidColor}15`,
                                        }}
                                      >
                                        <span className="text-gray-700 font-medium">
                                          Patents
                                        </span>
                                        <span
                                          className="font-bold ml-1"
                                          style={{ color: goal?.solidColor }}
                                        >
                                          {getPatentsForSDG(hoveredGoal).length}
                                        </span>
                                      </div>
                                    )}

                                    {/* Initiatives */}
                                    {getInitiativesForSDG(hoveredGoal).length >
                                      0 && (
                                      <div
                                        className="flex justify-between items-center p-1 rounded"
                                        style={{
                                          backgroundColor: `${goal?.solidColor}15`,
                                        }}
                                      >
                                        <span className="text-gray-700 font-medium">
                                          Initiatives
                                        </span>
                                        <span
                                          className="font-bold ml-1"
                                          style={{ color: goal?.solidColor }}
                                        >
                                          {
                                            getInitiativesForSDG(hoveredGoal)
                                              .length
                                          }
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 italic text-center">
                                No data available yet
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })()
                  : null}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Navigation Hub */}
      <section className="py-24 px-6 relative bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{
              opacity: 0,
              y: 50,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
            }}
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Explore Our Impact
            </h2>
            <p className="text-xl text-gray-600">
              Discover how we are leading the way in sustainable development
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {navigationSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.id}
                  initial={{
                    opacity: 0,
                    y: 50,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.6,
                  }}
                  onMouseEnter={() => setActiveCard(section.id)}
                  onMouseLeave={() => setActiveCard(null)}
                >
                  <motion.button
                    onClick={() => navigateToPage(section.path)}
                    className="relative w-full h-64 rounded-2xl overflow-hidden shadow-xl group"
                    whileHover={{
                      scale: 1.05,
                      y: -10,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-90 group-hover:opacity-100 transition-opacity`}
                    />
                    <div className="relative h-full flex flex-col items-center justify-center p-8 text-white">
                      <motion.div
                        animate={{
                          scale: activeCard === section.id ? 1.2 : 1,
                          rotate: activeCard === section.id ? 360 : 0,
                        }}
                        transition={{
                          duration: 0.6,
                        }}
                      >
                        <Icon className="w-16 h-16 mb-4" />
                      </motion.div>
                      <h3 className="text-2xl font-bold mb-3">
                        {section.title}
                      </h3>
                      <AnimatePresence>
                        {activeCard === section.id && (
                          <motion.p
                            className="text-sm text-white/90 text-center mb-4"
                            initial={{
                              opacity: 0,
                              height: 0,
                            }}
                            animate={{
                              opacity: 1,
                              height: "auto",
                            }}
                            exit={{
                              opacity: 0,
                              height: 0,
                            }}
                            transition={{
                              duration: 0.3,
                            }}
                          >
                            {section.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <p className="text-sm font-semibold">
                          <span className="text-2xl">{section.count}</span>{" "}
                          {section.label}
                        </p>
                      </div>
                      <motion.div
                        className="mt-4 flex items-center gap-2"
                        animate={{
                          x: activeCard === section.id ? 10 : 0,
                        }}
                      >
                        <span className="text-sm font-medium">Explore</span>
                        <ArrowRightIcon className="w-5 h-5" />
                      </motion.div>
                    </div>
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Live Sustainability Scoreboard */}
      <section className="py-24 px-6 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{
              opacity: 0,
              y: 50,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
            }}
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Live Impact Dashboard
            </h2>
            <p className="text-xl text-gray-600">
              Real-time sustainability metrics and achievements
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {kpis.map((kpi, index) => {
              const Icon = kpi.icon;
              return (
                <motion.button
                  key={index}
                  onClick={() => navigateToPage(kpi.path)}
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.6,
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -10,
                  }}
                  className="relative text-left"
                >
                  <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
                    <div
                      className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${kpi.color} mb-6`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      {kpi.label}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-5xl font-bold text-gray-900">
                        <AnimatedCounter end={kpi.value} />
                      </span>
                      <span className="text-2xl font-semibold text-gray-600">
                        {kpi.unit}
                      </span>
                    </div>
                    <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className={`absolute inset-y-0 left-0 bg-gradient-to-r ${kpi.color} rounded-full`}
                        initial={{
                          width: 0,
                        }}
                        whileInView={{
                          width: `${kpi.value}%`,
                        }}
                        viewport={{
                          once: true,
                        }}
                        transition={{
                          delay: index * 0.1 + 0.5,
                          duration: 1.5,
                        }}
                      />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Rankings & Certifications - Squarespace Style */}
      <section
        id="rankings"
        className="py-24 px-6 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
            }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-6">
              Global Recognition
            </h2>
            <div className="w-24 h-1 bg-emerald-600 mx-auto mb-6" />
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
              Recognized by leading sustainability ranking organizations
              worldwide
            </p>
          </motion.div>
          {/* Carousel */}
          <div className="relative max-w-5xl mx-auto pb-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentRanking}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.43, 0.13, 0.23, 0.96],
                }}
                className="w-full"
              >
                <button
                  onClick={() => navigateToPage("/achievements/site")}
                  className="w-full group block"
                >
                  <div className="bg-gray-50 rounded-none overflow-hidden hover:shadow-2xl transition-shadow duration-500">
                    {/* Image Section */}
                    <div className="relative h-64 overflow-hidden">
                      <motion.img
                        src={rankings[currentRanking].logo}
                        alt={rankings[currentRanking].name}
                        className="w-full h-full object-cover"
                        whileHover={{
                          scale: 1.05,
                        }}
                        transition={{
                          duration: 0.6,
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute top-6 left-6">
                        <span className="inline-block px-4 py-2 bg-white/95 backdrop-blur-sm text-gray-900 text-sm font-medium tracking-wide">
                          {rankings[currentRanking].category}
                        </span>
                      </div>
                    </div>
                    {/* Content Section */}
                    <div className="p-10 bg-white">
                      <h3 className="text-3xl font-light text-gray-900 mb-8 leading-tight">
                        {rankings[currentRanking].name}
                      </h3>
                      <div className="flex items-center gap-12 mb-8">
                        <div>
                          <p className="text-sm text-gray-500 mb-2 tracking-wider uppercase font-medium">
                            Ranking
                          </p>
                          <p className="text-4xl font-light text-emerald-600">
                            {rankings[currentRanking].rank}
                          </p>
                        </div>
                        <div className="w-px h-16 bg-gray-200" />
                        <div>
                          <p className="text-sm text-gray-500 mb-2 tracking-wider uppercase font-medium">
                            Year
                          </p>
                          <p className="text-4xl font-light text-emerald-600">
                            {rankings[currentRanking].year}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-gray-900 font-light text-base group-hover:gap-5 transition-all duration-300">
                        <span>View All Achievements</span>
                        <ArrowRightIcon className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </button>
              </motion.div>
            </AnimatePresence>
            {/* Navigation Dots */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-4">
              {rankings.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentRanking(index)}
                  className={`transition-all duration-300 ${
                    index === currentRanking
                      ? "w-12 h-1.5 bg-emerald-600"
                      : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to ranking ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Campus Sustainability Hotspots */}
      <section className="py-24 px-6 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{
              opacity: 0,
              y: 50,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
            }}
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Campus Sustainability Hotspots
            </h2>
            <p className="text-xl text-gray-600">
              Discover our green initiatives across campus
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {campusHotspots.map((hotspot, index) => {
              const Icon = hotspot.icon;
              return (
                <motion.button
                  key={index}
                  onClick={() => navigateToPage(hotspot.path)}
                  initial={{
                    opacity: 0,
                    y: 50,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.6,
                  }}
                  whileHover={{
                    y: -10,
                  }}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer text-left"
                >
                  <div className="bg-gradient-to-br from-emerald-400 to-teal-500 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {hotspot.title}
                  </h3>
                  <p className="text-gray-600">{hotspot.description}</p>
                  <MapPinIcon className="w-5 h-5 text-emerald-600 mt-4" />
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>
      {/* Call to Action */}
      <section className="py-24 px-6 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{
              opacity: 0,
              y: 50,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
            }}
          >
            <SparklesIcon className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-5xl font-bold mb-6">
              Join the Sustainability Movement
            </h2>
            <p className="text-xl mb-12 text-white/90">
              Be part of our mission to create a sustainable future for all
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                onClick={() => navigateToPage("/governance/site")}
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                className="px-8 py-4 bg-white text-emerald-600 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-shadow"
              >
                Student Engagement
              </motion.button>
              <motion.button
                onClick={() => navigateToPage("/research/site")}
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-emerald-600 transition-colors"
              >
                Partnerships & Collaborations
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">Sustainability Hub</h3>
              <p className="text-gray-400">
                Leading the way in sustainable education and environmental
                stewardship
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button
                    onClick={() => navigateToPage("/governance/site")}
                    className="hover:text-white transition-colors"
                  >
                    Governance
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateToPage("/environment/site")}
                    className="hover:text-white transition-colors"
                  >
                    Environment
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateToPage("/research/site")}
                    className="hover:text-white transition-colors"
                  >
                    Research
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                />
                <button className="px-4 py-2 bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">
                  <MailIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <button className="p-3 bg-gray-800 rounded-lg hover:bg-emerald-600 transition-colors">
                  <FacebookIcon className="w-5 h-5" />
                </button>
                <button className="p-3 bg-gray-800 rounded-lg hover:bg-emerald-600 transition-colors">
                  <TwitterIcon className="w-5 h-5" />
                </button>
                <button className="p-3 bg-gray-800 rounded-lg hover:bg-emerald-600 transition-colors">
                  <LinkedinIcon className="w-5 h-5" />
                </button>
                <button className="p-3 bg-gray-800 rounded-lg hover:bg-emerald-600 transition-colors">
                  <InstagramIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400">
              © 2024 University Sustainability Hub. All rights reserved.
            </p>
            <button
              onClick={() => navigateToPage("/reports/site")}
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <DownloadIcon className="w-5 h-5" />
              Download Sustainability Report
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
