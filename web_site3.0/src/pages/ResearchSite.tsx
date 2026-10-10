import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeftIcon,
  DollarSignIcon,
  BookOpenIcon,
  LightbulbIcon,
  GraduationCapIcon,
  FlaskConicalIcon,
  HandshakeIcon,
  UsersIcon,
  RocketIcon,
  BriefcaseIcon,
  SparklesIcon,
  XIcon,
  FileIcon,
  DownloadIcon,
  CalendarIcon,
  ExternalLinkIcon,
  TargetIcon,
  TrendingUpIcon,
} from "lucide-react";
import { useLocation } from "react-router-dom";

type DataType =
  | "publications"
  | "research"
  | "patents"
  | "initiatives"
  | "funding"
  | "all";

const BASE_URL = "http://180.235.121.250:8006/api/research_site";

export function ResearchSite() {
  const navigate = useNavigate();
  const location = useLocation();
  const type = location.state?.type || "all";
  const [hoveredGoal, setHoveredGoal] = useState<number | null>(null);
  const [selectedSDG, setSelectedSDG] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeDataType, setActiveDataType] = useState<DataType>("all");

  const [data, setData] = useState({
    publications: [],
    studentResearch: [],
    patents: [],
    collaborations: [],
    outreach: [],
    startups: [],
    graduates: [],
    innovations: [],
    courses: [],
    funding: [],
  });

  const parse = (v: any) => {
    try {
      if (!v) return [];
      return Array.isArray(v) ? v : JSON.parse(v);
    } catch {
      return [];
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const endpoints = [
          "publications",
          "studentResearch",
          "patents",
          "collaborations",
          "outreach",
          "startups",
          "graduates",
          "innovations",
          "courses",
          "funding",
          "initiatives", // ✅ ADD THIS
        ];

        const res = await Promise.all(
          endpoints.map((ep) => axios.get(`${BASE_URL}/${ep}/all`))
        );

        const obj: any = {};

        endpoints.forEach((ep, i) => {
          let d = res[i].data;

          // map for each backend response shape
          if (ep === "publications") {
            d = Object.values(d).flat();
          } else if (ep === "studentResearch") {
            d = Object.values(d.data).flat();
          } else if (ep === "patents") {
            d = Object.values(d.data).flat();
          } else if (ep === "collaborations") {
            d = Object.values(d.data).flat();
          } else if (ep === "outreach") {
            d = Object.values(d.data).flat();
          } else if (ep === "startups") {
            d = Object.values(d.data).flat();
          } else if (ep === "graduates") {
            d = Object.values(d.data).flat();
          } else if (ep === "innovations") {
            d = Object.values(d.data).flat();
          } else if (ep === "courses") {
            d = Object.values(d.data).flat();
          } else if (ep === "funding") {
            d = [
              ...d.research_grants,
              ...d.corporate_sponsorship,
              ...d.government_funding,
            ];
          } else if (ep === "initiatives") {
            d = Object.values(d.data).flat();
          }

          obj[ep] = d.map((i: any) => ({
            ...i,
            images: parse(i.images),
            files: parse(i.files),
            sdgGoals: parse(i.sdgGoals),
          }));
        });

        setData(obj);
      } catch (err) {
        console.error("API ERROR:", err);
      }
    })();
  }, []);

  const allItems = [
    ...data.publications,
    ...data.studentResearch,
    ...data.patents,
    ...data.collaborations,
    ...data.outreach,
    ...data.startups,
    ...data.graduates,
    ...data.innovations,
    ...data.courses,
    ...data.funding,
  ];

  const itemsForSDG = (goal: number) =>
    allItems.filter((i: any) => i.sdgGoals?.includes(goal));
  const getTotalBySDG = (goal: number) => itemsForSDG(goal).length;
  const getTotalCount = () =>
    Array.from({ length: 17 }, (_, i) => i + 1).reduce(
      (t, g) => t + getTotalBySDG(g),
      0
    );

  const calculateTotalFunding = () =>
    data.funding.reduce((a: number, f: any) => a + (parseInt(f.value) || 0), 0);

  const counts: any = {
    funding: data.funding.length,
    publications: data.publications.length,
    patents: data.patents.length,
    courses: data.courses.length,
    studentResearch: data.studentResearch.length,
    collaborations: data.collaborations.length,
    outreach: data.outreach.length,
    startups: data.startups.length,
    graduates: data.graduates.length,
    innovations: data.innovations.length,
  };

  const getCategoryData = () =>
    selectedCategory ? data[selectedCategory] : [];

  const dataTypeConfig = {
    all: {
      label: "All Data",
      icon: TargetIcon,
      color: "from-purple-500 to-indigo-600",
    },
    publications: {
      label: "Publications",
      icon: BookOpenIcon,
      color: "from-blue-500 to-cyan-600",
    },
    research: {
      label: "Research Projects",
      icon: FlaskConicalIcon,
      color: "from-green-500 to-emerald-600",
    },
    patents: {
      label: "Patents",
      icon: LightbulbIcon,
      color: "from-amber-500 to-orange-600",
    },
    initiatives: {
      label: "Initiatives",
      icon: RocketIcon,
      color: "from-pink-500 to-rose-600",
    },
  };

  const activeConfig = dataTypeConfig[activeDataType];
  const ActiveIcon = activeConfig.icon;

  const sdgAngleMap: Record<number, number> = {};
  for (let i = 1; i <= 17; i++) sdgAngleMap[i] = -90 + (360 / 17) * i;
  sdgAngleMap[17] = -90;

  const sdgGoals = [
    { number: 1, title: "No Poverty", solidColor: "#E5243B", icon: "🏠" },
    { number: 2, title: "Zero Hunger", solidColor: "#DDA63A", icon: "🌾" },
    { number: 3, title: "Good Health", solidColor: "#4C9F38", icon: "❤️" },
    {
      number: 4,
      title: "Quality Education",
      solidColor: "#C5192D",
      icon: "📚",
    },
    { number: 5, title: "Gender Equality", solidColor: "#FF3A21", icon: "⚖️" },
    { number: 6, title: "Clean Water", solidColor: "#26BDE2", icon: "💧" },
    { number: 7, title: "Clean Energy", solidColor: "#FCC30B", icon: "⚡" },
    { number: 8, title: "Economic Growth", solidColor: "#A21942", icon: "💼" },
    { number: 9, title: "Innovation", solidColor: "#FD6925", icon: "🏗️" },
    {
      number: 10,
      title: "Reduced Inequality",
      solidColor: "#DD1367",
      icon: "🤝",
    },
    {
      number: 11,
      title: "Sustainable Cities",
      solidColor: "#FD9D24",
      icon: "🏙️",
    },
    {
      number: 12,
      title: "Responsible Consumption",
      solidColor: "#BF8B2E",
      icon: "♻️",
    },
    { number: 13, title: "Climate Action", solidColor: "#3F7E44", icon: "🌍" },
    {
      number: 14,
      title: "Life Below Water",
      solidColor: "#0A97D9",
      icon: "🐠",
    },
    { number: 15, title: "Life on Land", solidColor: "#56C02B", icon: "🌳" },
    { number: 16, title: "Peace & Justice", solidColor: "#00689D", icon: "⚖️" },
    { number: 17, title: "Partnerships", solidColor: "#19486A", icon: "🌐" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 shadow-lg overflow-hidden min-h-[600px]">
        {/* Hero Banner Image */}
        <div className="absolute inset-0">
          <img
            src="/saveetha7926.jpg.webp"
            alt="Research Laboratory"
            className="w-full h-full object-cover"
          />
          {/* Subtle overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/30 to-black/40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
          <div className="absolute top-0 right-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-white hover:text-white/80 transition-colors bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Home
            </button>
          </div>
          <h1 className="text-4xl font-bold text-white text-center drop-shadow-lg">
            Sustainability Research Portal
          </h1>
          <p className="text-center text-indigo-100 mt-2 text-lg drop-shadow-md">
            Showcasing our sustainability research initiatives and achievements
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* ✅ SDG WHEEL (UNCHANGED UI) */}
        {/* ✅ SDG WHEEL — Modern Glass + Glow + Dynamic Counts */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 mb-12 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 bg-clip-text text-transparent mb-2">
              SDG Impact Dashboard
            </h2>
            <p className="text-center text-gray-600 mb-2 text-lg">
              Explore our research contributions across all 17 Sustainable
              Development Goals
            </p>
            <p className="text-center text-gray-500 mb-8 text-sm italic">
              Hover over a goal to see details
            </p>

            {/*
      Helpers scoped to this block — use your API data and activeDataType to compute counts
    */}
            {(() => {
              const filterBySDG = (arr: any[], g: number) =>
                (arr || []).filter(
                  (i: any) =>
                    Array.isArray(i?.sdgGoals) && i.sdgGoals.includes(g)
                );

              // A) Publications = everything in data.publications (your current flat list)
              const getPublicationsForSDG = (g: number) =>
                filterBySDG(data.publications, g);
              // Research = studentResearch (your API list)
              const getResearchForSDG = (g: number) =>
                filterBySDG(data.studentResearch, g);
              // Patents = patents + innovations (to match your second UI grouping)
              const getPatentsForSDG = (g: number) =>
                filterBySDG(data.patents || [], g);
              console.log(data.patents);
              // Initiatives = collaborations + outreach (to match your second UI grouping)
              const getInitiativesForSDG = (g: number) =>
                filterBySDG(
                  [...(data.collaborations || []), ...(data.outreach || [])],
                  g
                );

              const getCountForSDG = (g: number): number => {
                switch (activeDataType) {
                  case "publications":
                    return getPublicationsForSDG(g).length;
                  case "research":
                    return getResearchForSDG(g).length;
                  case "patents":
                    return getPatentsForSDG(g).length;
                  case "initiatives":
                    return getInitiativesForSDG(g).length;
                  case "all":
                  default:
                    return (
                      getPublicationsForSDG(g).length +
                      getResearchForSDG(g).length +
                      getPatentsForSDG(g).length +
                      getInitiativesForSDG(g).length
                    );
                }
              };

              const getTotalCountDynamic = () =>
                sdgGoals.reduce(
                  (sum, goal) => sum + getCountForSDG(goal.number),
                  0
                );

              return (
                <>
                  {/* Data Type Toggle */}
                  <div className="flex justify-center mb-12">
                    <div className="inline-flex bg-gray-100 rounded-2xl p-2 gap-2 shadow-inner">
                      {(Object.keys(dataTypeConfig) as DataType[]).map((t) => {
                        const cfg = dataTypeConfig[t];
                        const Ico = cfg.icon;
                        const isActive = activeDataType === t;
                        return (
                          <button
                            key={t}
                            onClick={() => setActiveDataType(t)}
                            className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                              isActive
                                ? `bg-gradient-to-r ${cfg.color} text-white shadow-lg transform scale-105`
                                : "text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            <Ico
                              className={`w-5 h-5 ${
                                isActive ? "animate-pulse" : ""
                              }`}
                            />
                            <span className="relative z-10">{cfg.label}</span>
                            {isActive && (
                              <span className="relative z-10 px-2 py-0.5 bg-white/30 rounded-full text-xs font-bold">
                                {getTotalCountDynamic()}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Wheel */}
                  <div
                    className="relative w-full max-w-4xl mx-auto"
                    style={{ aspectRatio: "1" }}
                  >
                    {/* Background wheel image */}
                    <img
                      src="/un-sustainable-development-goals.png"
                      alt="UN Sustainable Development Goals Wheel"
                      className="absolute inset-0 w-full h-full object-contain z-0"
                    />

                    {/* Interactive segment overlays (accurate radial clipping + hover tint) */}
                    {sdgGoals.map((goal) => {
                      const total = sdgGoals.length;
                      const seg = 360 / total;
                      let mid = sdgAngleMap[goal.number];
                      let start = mid - seg / 2;
                      let end = mid + seg / 2;
                      if (goal.number === 17) {
                        start = -90 - seg / 2;
                        end = -90 + seg / 2;
                      }

                      const innerR = 15;
                      const outerR = 42;
                      const toXY = (ang: number, r: number) => ({
                        x: 50 + r * Math.cos((ang * Math.PI) / 180),
                        y: 50 + r * Math.sin((ang * Math.PI) / 180),
                      });

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
                            clipPath: `polygon(${innerStart.x}% ${innerStart.y}%, ${outerStart.x}% ${outerStart.y}%, ${outerEnd.x}% ${outerEnd.y}%, ${innerEnd.x}% ${innerEnd.y}%)`,
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

                    {/* Badges — centered on each slice, with glow + scale on hover */}
                    {sdgGoals.map((goal) => {
                      const mid = sdgAngleMap[goal.number];
                      const r = 28.5;
                      const x = 50 + r * Math.cos((mid * Math.PI) / 180);
                      const y = 50 + r * Math.sin((mid * Math.PI) / 180);
                      const count = getCountForSDG(goal.number);
                      const hasData = count > 0;
                      const isHovered = hoveredGoal === goal.number;

                      return (
                        <button
                          key={goal.number}
                          onClick={() => {
                            if (!hasData) return;

                            navigate(`/sdg/consolidated/${goal.number}`, {
                              state: { type: activeDataType },
                            });
                          }}
                          onMouseEnter={() => setHoveredGoal(goal.number)}
                          onMouseLeave={() => setHoveredGoal(null)}
                          className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 
    ${isHovered ? "scale-125 z-20" : "z-10"} 
    ${hasData ? "cursor-pointer" : "cursor-default"}`}
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
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
                                borderColor: hasData
                                  ? goal.solidColor
                                  : "#d1d5db",
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
                                    color: hasData
                                      ? goal.solidColor
                                      : "#9ca3af",
                                  }}
                                >
                                  SDG {goal.number}
                                </span>
                                <span
                                  className={`text-2xl font-bold drop-shadow-sm block ${
                                    isHovered ? "scale-110" : ""
                                  } transition-transform`}
                                  style={{
                                    color: hasData
                                      ? goal.solidColor
                                      : "#9ca3af",
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
                        </button>
                      );
                    })}

                    {/* Center bubble with details on hover */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
                      {hoveredGoal
                        ? (() => {
                            const g = sdgGoals.find(
                              (x) => x.number === hoveredGoal
                            );
                            const count = getCountForSDG(hoveredGoal);
                            const hasData = count > 0;
                            return (
                              <div
                                className="bg-white/95 backdrop-blur-sm rounded-full p-5 shadow-2xl border-4 transition-all duration-300 aspect-square flex items-center justify-center overflow-hidden"
                                style={{
                                  borderColor: g?.solidColor,
                                  width: "320px",
                                  height: "320px",
                                }}
                              >
                                <div className="text-center w-full h-full flex flex-col items-center justify-center px-3">
                                  <div
                                    className="mb-2 pb-2 border-b-2 w-full"
                                    style={{ borderColor: g?.solidColor }}
                                  >
                                    <div className="text-4xl mb-1">
                                      {g?.icon}
                                    </div>
                                    <p
                                      className="font-bold text-xs opacity-90 mb-1"
                                      style={{ color: g?.solidColor }}
                                    >
                                      SDG {g?.number}
                                    </p>
                                    <p
                                      className="font-bold text-lg line-clamp-2 leading-tight"
                                      style={{ color: g?.solidColor }}
                                    >
                                      {g?.title}
                                    </p>
                                  </div>

                                  {hasData ? (
                                    <div className="space-y-2 w-full overflow-hidden">
                                      <div className="flex items-center justify-center gap-2 mb-2">
                                        <ActiveIcon
                                          className="w-5 h-5 flex-shrink-0"
                                          style={{ color: g?.solidColor }}
                                        />
                                        <span
                                          className="font-bold text-2xl"
                                          style={{ color: g?.solidColor }}
                                        >
                                          {count}
                                        </span>
                                        <span className="text-sm text-gray-600 font-medium truncate">
                                          {activeConfig.label}
                                        </span>
                                      </div>

                                      {activeDataType === "all" && (
                                        <div className="space-y-1 text-xs max-h-20 overflow-y-auto px-1">
                                          {getPublicationsForSDG(hoveredGoal)
                                            .length > 0 && (
                                            <div
                                              className="flex justify-between items-center p-1 rounded"
                                              style={{
                                                backgroundColor: `${g?.solidColor}15`,
                                              }}
                                            >
                                              <span className="text-gray-700 font-medium text-xs truncate">
                                                Publications:
                                              </span>
                                              <span
                                                className="font-bold text-sm flex-shrink-0 ml-1"
                                                style={{ color: g?.solidColor }}
                                              >
                                                {
                                                  getPublicationsForSDG(
                                                    hoveredGoal
                                                  ).length
                                                }
                                              </span>
                                            </div>
                                          )}

                                          {getResearchForSDG(hoveredGoal)
                                            .length > 0 && (
                                            <div
                                              className="flex justify-between items-center p-1 rounded"
                                              style={{
                                                backgroundColor: `${g?.solidColor}15`,
                                              }}
                                            >
                                              <span className="text-gray-700 font-medium text-xs truncate">
                                                Research:
                                              </span>
                                              <span
                                                className="font-bold text-sm flex-shrink-0 ml-1"
                                                style={{ color: g?.solidColor }}
                                              >
                                                {
                                                  getResearchForSDG(hoveredGoal)
                                                    .length
                                                }
                                              </span>
                                            </div>
                                          )}

                                          {getPatentsForSDG(hoveredGoal)
                                            .length > 0 && (
                                            <div
                                              className="flex justify-between items-center p-1 rounded"
                                              style={{
                                                backgroundColor: `${g?.solidColor}15`,
                                              }}
                                            >
                                              <span className="text-gray-700 font-medium text-xs truncate">
                                                Patents:
                                              </span>
                                              <span
                                                className="font-bold text-sm flex-shrink-0 ml-1"
                                                style={{ color: g?.solidColor }}
                                              >
                                                {
                                                  getPatentsForSDG(hoveredGoal)
                                                    .length
                                                }
                                              </span>
                                            </div>
                                          )}

                                          {getInitiativesForSDG(hoveredGoal)
                                            .length > 0 && (
                                            <div
                                              className="flex justify-between items-center p-1 rounded"
                                              style={{
                                                backgroundColor: `${g?.solidColor}15`,
                                              }}
                                            >
                                              <span className="text-gray-700 font-medium text-xs truncate">
                                                Initiatives:
                                              </span>
                                              <span
                                                className="font-bold text-sm flex-shrink-0 ml-1"
                                                style={{ color: g?.solidColor }}
                                              >
                                                {
                                                  getInitiativesForSDG(
                                                    hoveredGoal
                                                  ).length
                                                }
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      <p
                                        className="text-xs italic mt-2 pt-1 border-t text-center truncate"
                                        style={{
                                          color: g?.solidColor,
                                          borderColor: `${g?.solidColor}30`,
                                        }}
                                      >
                                        Click to view details
                                      </p>
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

                  {/* Legend */}
                  <div className="mt-12 flex justify-center">
                    <div className="inline-flex items-center gap-6 bg-gray-50 px-8 py-4 rounded-2xl shadow-md border border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full shadow-md border-2 border-white" />
                        <span className="text-sm font-semibold text-gray-700">
                          Active Data
                        </span>
                      </div>
                      <div className="w-px h-6 bg-gray-300" />
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full opacity-60 border-2 border-gray-400" />
                        <span className="text-sm font-semibold text-gray-700">
                          No Data
                        </span>
                      </div>
                      <div className="w-px h-6 bg-gray-300" />
                      <div className="flex items-center gap-2">
                        <TrendingUpIcon className="w-6 h-6 text-blue-600" />
                        <span className="text-sm font-semibold text-gray-700">
                          Click to Explore
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Funding */}
          <button
            // onClick={() => setSelectedCategory("funding")}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSignIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Total Funding
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  ₹{calculateTotalFunding().toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {counts.funding} grants
                </p>
              </div>
            </div>
          </button>

          {/* Publications */}
          <button
            // onClick={() => setSelectedCategory("publications")}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <BookOpenIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Publications
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {counts.publications}
                </p>
                {/* <p className="text-sm text-gray-500 mt-1">
                  Click to view details
                </p> */}
              </div>
            </div>
          </button>

          {/* Patents */}
          <button
            // onClick={() => setSelectedCategory("patents")}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <LightbulbIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Patents & Innovations
                </h3>
                <p className="text-2xl font-bold text-purple-600">
                  {counts.patents}
                </p>
                {/* <p className="text-sm text-gray-500 mt-1">
                  Click to view details
                </p> */}
              </div>
            </div>
          </button>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Research Areas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: GraduationCapIcon,
              title: "Sustainability Education",
              count: counts.courses,
              color: "bg-yellow-100",
              textColor: "text-yellow-600",
              category: "courses",
            },
            {
              icon: FlaskConicalIcon,
              title: "Student Research",
              count: counts.studentResearch,
              color: "bg-pink-100",
              textColor: "text-pink-600",
              category: "studentResearch",
            },
            {
              icon: HandshakeIcon,
              title: "Research Collaborations",
              count: counts.collaborations,
              color: "bg-indigo-100",
              textColor: "text-indigo-600",
              category: "collaborations",
            },
            {
              icon: UsersIcon,
              title: "Community Outreach",
              count: counts.outreach,
              color: "bg-teal-100",
              textColor: "text-teal-600",
              category: "outreach",
            },
            {
              icon: RocketIcon,
              title: "Sustainability Startups",
              count: counts.startups,
              color: "bg-orange-100",
              textColor: "text-orange-600",
              category: "startups",
            },
            {
              icon: SparklesIcon,
              title: "Climate Innovations",
              count: counts.innovations,
              color: "bg-cyan-100",
              textColor: "text-cyan-600",
              category: "innovations",
            },
          ].map((area, idx) => {
            const Icon = area.icon;
            return (
              <button
                key={idx}
                onClick={() => setSelectedCategory(area.category)}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`${area.color} p-3 rounded-full`}>
                    <Icon className={`w-6 h-6 ${area.textColor}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {area.title}
                    </h3>
                    <p className={`text-2xl font-bold ${area.textColor}`}>
                      {area.count}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Click to view details
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Graduates Card */}
        <div className="mb-12">
          <button
            onClick={() => setSelectedCategory("graduates")}
            className="w-full bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="bg-emerald-100 p-3 rounded-full">
                <BriefcaseIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Green Job Graduates
                </h3>
                <p className="text-2xl font-bold text-emerald-600">
                  {counts.graduates}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Click to view career outcomes
                </p>
              </div>
            </div>
          </button>
        </div>

        <div
          class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-center"
          data-id="element-2162"
        >
          <h2 class="text-3xl font-bold text-white mb-4" data-id="element-2163">
            Partner With Us
          </h2>
          <p
            class="text-indigo-100 text-lg mb-6 max-w-3xl mx-auto"
            data-id="element-2164"
          >
            Join our mission to create a sustainable future through cutting-edge
            research and innovation. We welcome collaborations with industry
            partners, government agencies, and research institutions.
          </p>
          <button
            class="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow-lg"
            data-id="element-2165"
            fdprocessedid="wq3qdm"
          >
            Contact Research Office
          </button>
        </div>
      </div>

      {selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {selectedCategory.replace(/([A-Z])/g, " $1").toUpperCase()}
              </h2>
              <button onClick={() => setSelectedCategory(null)}>
                <XIcon className="text-white w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {getCategoryData().map((i: any) => {
                const sdgs = Array.isArray(i.sdgGoals) ? i.sdgGoals : [];

                return (
                  <div key={i.id} className="bg-gray-50 p-6 rounded-xl shadow">
                    <h3 className="font-bold text-lg mb-2">{i.title}</h3>

                    {/* Images */}
                    {i.images?.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {i.images.map((img: any, idx: number) => (
                          <img
                            key={idx}
                            src={img}
                            className="h-40 w-full object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}

                    {/* Files */}
                    {i.files?.length > 0 &&
                      i.files.map((f: any, idx: number) => (
                        <div
                          key={idx}
                          onClick={() => window.open(f.url, "_blank")}
                          className="flex justify-between bg-white p-3 rounded mb-2 cursor-pointer hover:bg-gray-100 transition"
                        >
                          <div className="flex gap-2 items-center">
                            <FileIcon className="text-gray-500 w-4 h-4" />
                            <span className="text-sm">{f.name}</span>
                          </div>

                          <DownloadIcon className="w-4 h-4 text-blue-600" />
                        </div>
                      ))}

                    {/* SDG Badges */}
                    {sdgs.length > 0 && (
                      <div className="flex gap-2 flex-wrap mt-2">
                        {sdgs.map((goal: number) => {
                          const g = sdgGoals.find((x) => x.number === goal);
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
                              SDG {goal} {g?.icon}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Year + Status */}
                    <div className="flex gap-2 flex-wrap mt-2">
                      {i.year && (
                        <span className="bg-gray-200 px-2 py-1 text-xs rounded flex gap-1 items-center">
                          <CalendarIcon className="w-3 h-3" /> {i.year}
                        </span>
                      )}

                      {i.status && (
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            i.status === "active"
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {i.status}
                        </span>
                      )}
                      {/* Visit Website */}
                      {i.link && (
                        <a
                          href={i.link}
                          target="_blank"
                          className="inline-flex items-center gap-2 text-sm font-semibold 
                            bg-blue-600 text-white px-3 py-2 rounded-lg shadow 
                            hover:bg-blue-700 transition-colors"
                        >
                          Visit Site <ExternalLinkIcon className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
