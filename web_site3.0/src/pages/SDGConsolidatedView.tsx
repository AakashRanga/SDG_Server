import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  ArrowLeftIcon,
  BookOpenIcon,
  FlaskConicalIcon,
  AwardIcon,
  SparklesIcon,
  ExternalLinkIcon,
  CalendarIcon,
  FileIcon,
  DownloadIcon,
} from "lucide-react";

const API = "http://180.235.121.250:8006/api/research_site";

const SDG_INFO = [
  {
    number: 1,
    title: "No Poverty",
    description: "End poverty in all its forms everywhere",
    color: "from-red-500 to-red-700",
    solidColor: "#E5243B",
    icon: "🏠",
  },
  {
    number: 2,
    title: "Zero Hunger",
    description: "End hunger, achieve food security and improved nutrition",
    color: "from-yellow-500 to-yellow-700",
    solidColor: "#DDA63A",
    icon: "🌾",
  },
  {
    number: 3,
    title: "Good Health",
    description: "Ensure healthy lives and promote well-being for all",
    color: "from-green-500 to-green-700",
    solidColor: "#4C9F38",
    icon: "❤️",
  },
  {
    number: 4,
    title: "Quality Education",
    description: "Ensure inclusive and equitable quality education",
    color: "from-red-600 to-red-800",
    solidColor: "#C5192D",
    icon: "📚",
  },
  {
    number: 5,
    title: "Gender Equality",
    description: "Achieve gender equality and empower all women and girls",
    color: "from-orange-500 to-orange-700",
    solidColor: "#FF3A21",
    icon: "⚖️",
  },
  {
    number: 6,
    title: "Clean Water",
    description: "Ensure availability and sustainable management of water",
    color: "from-cyan-500 to-cyan-700",
    solidColor: "#26BDE2",
    icon: "💧",
  },
  {
    number: 7,
    title: "Clean Energy",
    description: "Ensure access to affordable, reliable, sustainable energy",
    color: "from-yellow-400 to-yellow-600",
    solidColor: "#FCC30B",
    icon: "⚡",
  },
  {
    number: 8,
    title: "Economic Growth",
    description: "Promote sustained, inclusive economic growth",
    color: "from-red-700 to-red-900",
    solidColor: "#A21942",
    icon: "💼",
  },
  {
    number: 9,
    title: "Innovation",
    description: "Build resilient infrastructure, promote innovation",
    color: "from-orange-600 to-orange-800",
    solidColor: "#FD6925",
    icon: "🏗️",
  },
  {
    number: 10,
    title: "Reduced Inequalities",
    description: "Reduce inequality within and among countries",
    color: "from-pink-500 to-pink-700",
    solidColor: "#DD1367",
    icon: "🤝",
  },
  {
    number: 11,
    title: "Sustainable Cities",
    description: "Make cities and settlements inclusive and sustainable",
    color: "from-amber-500 to-amber-700",
    solidColor: "#FD9D24",
    icon: "🏙️",
  },
  {
    number: 12,
    title: "Responsible Consumption",
    description: "Ensure sustainable consumption",
    color: "from-yellow-600 to-yellow-800",
    solidColor: "#BF8B2E",
    icon: "♻️",
  },
  {
    number: 13,
    title: "Climate Action",
    description: "Take urgent action to combat climate change",
    color: "from-green-600 to-green-800",
    solidColor: "#3F7E44",
    icon: "🌍",
  },
  {
    number: 14,
    title: "Life Below Water",
    description: "Conserve oceans and marine resources",
    color: "from-blue-500 to-blue-700",
    solidColor: "#0A97D9",
    icon: "🐠",
  },
  {
    number: 15,
    title: "Life on Land",
    description: "Protect and restore land ecosystems",
    color: "from-lime-500 to-lime-700",
    solidColor: "#56C02B",
    icon: "🌳",
  },
  {
    number: 16,
    title: "Peace & Justice",
    description: "Promote peaceful and inclusive societies",
    color: "from-blue-700 to-blue-900",
    solidColor: "#00689D",
    icon: "⚖️",
  },
  {
    number: 17,
    title: "Partnerships",
    description: "Strengthen implementation",
    color: "from-indigo-600 to-indigo-800",
    solidColor: "#19486A",
    icon: "🌐",
  },
];

// Safe JSON decode
const safe = (v: any) => {
  try {
    if (!v) return [];
    if (typeof v === "string") return JSON.parse(v);
    if (Array.isArray(v)) return v;
    return [];
  } catch {
    return [];
  }
};

// Normalize backend
const normalizeItem = (item: any) => ({
  ...item,
  sdgGoals: safe(item.sdg_goals ?? item.sdgGoals),
  images: safe(item.images),
  files: safe(item.files),
});

export function SDGConsolidatedView() {
  const navigate = useNavigate();
  const { goalNumber } = useParams();
  const sdgNumber = parseInt(goalNumber || "1");
  const sdgGoal = SDG_INFO.find((g) => g.number === sdgNumber);

  const [publications, setPublications] = useState<any[]>([]);
  const [research, setResearch] = useState<any[]>([]);
  const [patents, setPatents] = useState<any[]>([]);
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  // Load backend data
  useEffect(() => {
    const load = async () => {
      try {
        const pub = await axios.get(`${API}/publications/all`);
        setPublications([
          ...(pub.data.journals || []).map((x: any) =>
            normalizeItem({ ...x, type: "Journal" })
          ),
          ...(pub.data.conferences || []).map((x: any) =>
            normalizeItem({ ...x, type: "Conference" })
          ),
          ...(pub.data.books || []).map((x: any) =>
            normalizeItem({ ...x, type: "Book" })
          ),
        ]);

        const pt = await axios.get(`${API}/patents/all`);

        const patentList = [
          ...(pt.data.data?.patents || []).map((x: any) =>
            normalizeItem({ ...x, type: "Patent" })
          ),
          ...(pt.data.data?.innovations || []).map((x: any) =>
            normalizeItem({ ...x, type: "Innovation" })
          ),
        ];

        console.log("Total patents:", patentList.length);
        console.log("Patents for SDG", sdgNumber, patentsData.length);

        setPatents(patentList);

        const sr = await axios.get(`${API}/studentResearch/all`);
        const studentData = sr.data.data || {};
        let combined: any[] = [];

        Object.keys(studentData).forEach((key) => {
          const list = Array.isArray(studentData[key]) ? studentData[key] : [];

          combined = [
            ...combined,
            ...list.map((x: any) =>
              normalizeItem({
                ...x,
                type:
                  key === "thesis"
                    ? "Thesis"
                    : key === "projects"
                    ? "Project"
                    : key
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase()),
              })
            ),
          ];
        });

        setResearch(combined);

        // ------------------------
        // ⭐ Calculate SDG counts
        // ------------------------
        const sdgCount: any = {};

        combined.forEach((item: any) => {
          const goals = safe(item.sdgGoals);
          goals.forEach((g: number) => {
            sdgCount[g] = (sdgCount[g] || 0) + 1;
          });
        });

        console.log("SDG count for Student Research:", sdgCount);

        console.log("🔍 Total student research loaded:", combined.length);
        console.log("🔍 Student categories loaded:", Object.keys(studentData));

        const ini = await axios.get(`${API}/initiatives/all`);
        setInitiatives([
          ...(ini.data.data?.industry || []).map((x: any) =>
            normalizeItem({ ...x, type: "Industry Collaboration" })
          ),
          ...(ini.data.data?.international || []).map((x: any) =>
            normalizeItem({ ...x, type: "International Collaboration" })
          ),
          ...(ini.data.data?.community || []).map((x: any) =>
            normalizeItem({ ...x, type: "Community Outreach" })
          ),
          ...(ini.data.data?.service || []).map((x: any) =>
            normalizeItem({ ...x, type: "Service Program" })
          ),
        ]);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  // Reuse the same filter function from your SDG wheel
  const filterBySDG = (arr) =>
    (arr || []).filter(
      (i) => Array.isArray(i?.sdgGoals) && i.sdgGoals.includes(sdgNumber)
    );

  // Apply filtering to all four groups
  const publicationsData = filterBySDG(publications);
  const researchData = filterBySDG(research);

  // Patents MUST include both patents + innovations
  const patentsData = filterBySDG(patents);

  // Initiatives = industry + community + service + international
  const initiativesData = filterBySDG(initiatives);

  const tabs = [
    {
      id: "all",
      label: "All",
      icon: SparklesIcon,
      count:
        publicationsData.length +
        researchData.length +
        patentsData.length +
        initiativesData.length,
    },
    {
      id: "publications",
      label: "Publications",
      icon: BookOpenIcon,
      count: publicationsData.length,
    },
    {
      id: "research",
      label: "Research",
      icon: FlaskConicalIcon,
      count: researchData.length,
    },
    {
      id: "patents",
      label: "Patents",
      icon: AwardIcon,
      count: patentsData.length,
    },
    {
      id: "initiatives",
      label: "Initiatives",
      icon: SparklesIcon,
      count: initiativesData.length,
    },
  ];

  const displayData =
    activeTab === "publications"
      ? publicationsData
      : activeTab === "research"
      ? researchData
      : activeTab === "patents"
      ? patentsData
      : activeTab === "initiatives"
      ? initiativesData
      : [
          ...publicationsData,
          ...researchData,
          ...patentsData,
          ...initiativesData,
        ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* HERO */}
      <div
        className={`relative overflow-hidden bg-gradient-to-br ${sdgGoal?.color} min-h-[40vh] flex items-center`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v6h6V4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 z-10 w-full">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8"
          >
            <ArrowLeftIcon className="w-5 h-5" /> Back to Home
          </motion.button>

          <div className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="inline-block mb-6"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-full w-32 h-32 flex items-center justify-center text-7xl">
                {sdgGoal?.icon}
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold text-white">
                  {sdgGoal?.number}
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                {sdgGoal?.title}
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
                {sdgGoal?.description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-4">
                <StatBox label="Publications" value={publicationsData.length} />
                <StatBox label="Research" value={researchData.length} />
                <StatBox label="Patents" value={patentsData.length} />
                <StatBox label="Initiatives" value={initiativesData.length} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-semibold ${
                  activeTab === tab.id
                    ? "bg-white shadow-md -mb-2"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-200">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* CONTENT */}
        {displayData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayData.map((item, idx) => (
              <ItemCard
                key={`${item.type}-${item.id || "noid"}-${idx}`}
                item={item}
                sdgGoal={sdgGoal}
              />
            ))}
          </div>
        ) : (
          <NoData icon={sdgGoal?.icon} tab={activeTab} />
        )}
      </div>
    </div>
  );
}

// COMPONENTS
const StatBox = ({ label, value }: any) => (
  <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white text-center">
    <p className="text-3xl font-bold">{value}</p>
    <p>{label}</p>
  </div>
);

const ItemCard = ({ item, sdgGoal }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl shadow-lg p-6"
  >
    <span
      className="px-3 py-1 text-sm text-white rounded-full"
      style={{ backgroundColor: sdgGoal?.solidColor }}
    >
      {item.type}
    </span>

    <h3 className="text-2xl font-bold mt-3">{item.title}</h3>

    {/* {item.description && (
      <p className="text-gray-600 mt-2">{item.description}</p>
    )} */}

    {/* SDG GOALS */}
    {item.sdgGoals.length > 0 && (
      <div className="flex gap-2 flex-wrap mt-3">
        {item.sdgGoals.map((goal: number) => {
          const g = SDG_INFO.find((x) => x.number === goal);
          return (
            <span
              key={goal}
              className="px-2 py-1 text-xs font-semibold rounded flex items-center gap-1 shadow-sm"
              style={{
                backgroundColor: `${g?.solidColor}20`,
                color: g?.solidColor,
                border: `1px solid ${g?.solidColor}70`,
              }}
            >
              {g?.icon} SDG {goal}
            </span>
          );
        })}
      </div>
    )}

    {/* Images */}
    {item.images?.length > 0 && (
      <div className="grid grid-cols-2 gap-2 mt-4">
        {item.images.slice(0, 2).map((img: string, i: number) => (
          <img
            key={`${item.type}-${item.id || "noid"}-img-${i}`}
            src={img}
            className="w-full h-32 object-cover rounded-lg"
          />
        ))}
      </div>
    )}

    {/* Files */}
    {item.files?.length > 0 && (
      <div className="mt-4 space-y-2">
        {item.files.map((file: any, i: number) => (
          <button
            key={`${item.type}-${item.id || "noid"}-file-${i}`}
            onClick={() => window.open(file.url, "_blank")}
            className="flex justify-between items-center bg-gray-100 hover:bg-gray-200 p-3 rounded-lg w-full"
          >
            <span className="flex items-center gap-2">
              <FileIcon className="w-5 h-5" /> {file.name}
            </span>
            <DownloadIcon className="w-4 h-4" />
          </button>
        ))}
      </div>
    )}

    {/* Link */}
    {item.link && (
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        <ExternalLinkIcon className="w-4 h-4" /> View Link
      </a>
    )}

    {/* Metadata */}
    <div className="flex flex-wrap gap-2 mt-4">
      {item.year && (
        <span className="px-3 py-1 text-sm bg-gray-100 rounded-full flex items-center gap-1">
          <CalendarIcon className="w-4 h-4" /> {item.year}
        </span>
      )}
    </div>
  </motion.div>
);

const NoData = ({ icon, tab }: any) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-24"
  >
    <div className="text-8xl opacity-20 mb-6">{icon}</div>
    <h3 className="text-2xl font-bold">No Data Available</h3>
    <p className="text-gray-600">No {tab} data found for this SDG goal.</p>
  </motion.div>
);
