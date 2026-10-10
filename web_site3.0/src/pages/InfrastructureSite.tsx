import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeftIcon,
  TreesIcon,
  AccessibilityIcon,
  HeartPulseIcon,
  CpuIcon,
  AmphoraIcon,
  MapIcon,
  PlayIcon,
  XIcon,
  BuildingIcon,
  TrophyIcon,
  AwardIcon,
  CalendarIcon,
} from "lucide-react";

export interface InfrastructureItem {
  id: number;
  type: string;
  title: string;
  description: string;
  value?: string;
  unit?: string;
  year?: string;
  status?: "active" | "completed" | "planned";
  images?: string[];
  videos?: string[];
}

const API_BASE_URL = "http://180.235.121.250:8006/api/infrastructuresite";
const MEDIA_BASE_URL = "http://180.235.121.250:8006";

export function InfrastructureSite() {
  const navigate = useNavigate();
  const [infrastructureData, setInfrastructureData] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<InfrastructureItem | null>(
    null
  );
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const axiosInstance = axios.create({ baseURL: API_BASE_URL });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/all");
        setInfrastructureData(res.data);
      } catch (err) {
        console.error("Error fetching infrastructure data:", err);
      }
    };
    fetchData();
  }, []);

  if (!infrastructureData) return <p>Loading...</p>;

 const normalizeMedia = (item: any): InfrastructureItem => {
   const parseMedia = (media: any): string[] => {
     if (!media) return [];
 
     if (Array.isArray(media)) {
       return media.filter((m) => typeof m === "string");
     }
 
     if (typeof media === "string") {
       try {
         const cleaned = media.replace(/^"+|"+$/g, "");
         const parsed = JSON.parse(cleaned);
         return Array.isArray(parsed)
           ? parsed.filter((m) => typeof m === "string")
           : [cleaned];
       } catch {
         return [media];
       }
     }
 
     return [];
   };
 
   const rawImages =
     item.images ??
     item.imageLink ??
     item.image ??
     [];
 
   const rawVideos =
     item.videos ??
     item.videoLink ??
     item.video ??
     [];
 
   return {
     ...item,
     images: parseMedia(rawImages), // 👈 DO NOT add base URL
     videos: parseMedia(rawVideos),
   };
 };


  // Flatten all items
  const allItems: InfrastructureItem[] = [
    ...Object.values(infrastructureData.greenSpaces || {}).flat(),
    ...Object.values(infrastructureData.accessibility || {}).flat(),
    ...Object.values(infrastructureData.wellness || {}).flat(),
    ...Object.values(infrastructureData.smartBuildings || {}).flat(),
    ...Object.values(infrastructureData.budget || {}).flat(),
    ...Object.values(infrastructureData.planning || {}).flat(),
  ].map(normalizeMedia);

  // Categories
  const categories = [
    {
      title: "Green & Open Spaces",
      icon: TreesIcon,
      color: "from-green-400 to-emerald-600",
      bgColor: "from-green-50 to-emerald-100",
      items: Object.values(infrastructureData.greenSpaces || {})
        .flat()
        .map(normalizeMedia),
    },
    {
      title: "Accessibility & Safety",
      icon: AccessibilityIcon,
      color: "from-teal-400 to-cyan-600",
      bgColor: "from-teal-50 to-cyan-100",
      items: Object.values(infrastructureData.accessibility || {})
        .flat()
        .map(normalizeMedia),
    },
    {
      title: "Health & Wellness",
      icon: HeartPulseIcon,
      color: "from-lime-400 to-green-600",
      bgColor: "from-lime-50 to-green-100",
      items: Object.values(infrastructureData.wellness || {})
        .flat()
        .map(normalizeMedia),
    },
    {
      title: "Smart Buildings",
      icon: CpuIcon,
      color: "from-emerald-400 to-teal-600",
      bgColor: "from-emerald-50 to-teal-100",
      items: Object.values(infrastructureData.smartBuildings || {})
        .flat()
        .map(normalizeMedia),
    },
    {
      title: "Arts and Heritage",
      icon: AmphoraIcon,
      color: "from-green-400 to-lime-600",
      bgColor: "from-green-50 to-lime-100",
      items: Object.values(infrastructureData.budget || {})
        .flat()
        .map(normalizeMedia),
    },
    {
      title: "Planning & Expansion",
      icon: MapIcon,
      color: "from-teal-400 to-green-600",
      bgColor: "from-teal-50 to-green-100",
      items: Object.values(infrastructureData.planning || {})
        .flat()
        .map(normalizeMedia),
    },
  ];

  const getVideoEmbedUrl = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.includes("youtu.be")
        ? url.split("youtu.be/")[1]
        : url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* =========================
          VIDEO MODAL
      ========================== */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2"
          >
            <XIcon className="w-8 h-8" />
          </button>
          <div
            className="w-full max-w-6xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={getVideoEmbedUrl(selectedVideo)}
              className="w-full h-full rounded-lg"
              allowFullScreen
              title="Infrastructure video"
            />
          </div>
        </div>
      )}

      {/* =========================
          DETAILS MODAL
      ========================== */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-6 flex items-center justify-between z-10">
              <h2 className="text-3xl font-bold text-white">
                {selectedItem.title}
              </h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-white hover:text-green-100 transition-colors bg-white/20 rounded-full p-2"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              {/* Images */}
              {selectedItem.images && selectedItem.images.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Images
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedItem.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${selectedItem.title} ${idx + 1}`}
                        className="w-full h-64 object-cover rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Videos */}
              {selectedItem.videos && selectedItem.videos.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Videos
                  </h3>
                  <div className="space-y-4">
                    {selectedItem.videos.map((video, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-lg"
                      >
                        <iframe
                          src={getVideoEmbedUrl(video)}
                          className="w-full h-full"
                          allowFullScreen
                          title={`${selectedItem.title} video ${idx + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Description
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap gap-3">
                {selectedItem.value && selectedItem.unit && (
                  <span className="px-6 py-3 rounded-full text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg">
                    {selectedItem.value} {selectedItem.unit}
                  </span>
                )}
                {selectedItem.year && (
                  <span className="px-6 py-3 rounded-full text-lg font-bold bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 shadow-md flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    {selectedItem.year}
                  </span>
                )}
                {selectedItem.status && (
                  <span
                    className={`px-6 py-3 rounded-full text-lg font-bold shadow-lg ${
                      selectedItem.status === "active"
                        ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                        : selectedItem.status === "completed"
                        ? "bg-gradient-to-r from-teal-400 to-cyan-500 text-white"
                        : "bg-gradient-to-r from-lime-400 to-green-500 text-white"
                    }`}
                  >
                    {selectedItem.status.charAt(0).toUpperCase() +
                      selectedItem.status.slice(1)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          HERO + ANIMATED STATS
      ========================== */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src="/ddj_0077.jpg"
            alt="SIMATS Sustainable Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 z-10 w-full text-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-12"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Home
          </button>

          <div className="inline-block mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 blur-3xl opacity-60 animate-pulse" />
            <div className="relative bg-white p-8 rounded-3xl shadow-2xl">
              <BuildingIcon className="w-20 h-20 text-green-600" />
            </div>
          </div>

          <h1 className="text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
            Sustainable Infrastructure
          </h1>

          <p className="text-2xl text-white font-medium max-w-3xl mx-auto mb-12 drop-shadow-lg">
            Building the future through innovative, accessible, and sustainable
            campus development
          </p>

          {/* ⭐⭐⭐ NEW ANIMATED STATS UI ⭐⭐⭐ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                label: "Total Projects",
                value: allItems.length,
                icon: BuildingIcon,
                gradient: "from-blue-400/30 to-blue-600/30",
                iconBg: "from-blue-400 to-blue-600",
                delay: 0,
              },
              {
                label: "Active Initiatives",
                value: allItems.filter((i) => i.status === "active").length,
                icon: TrophyIcon,
                gradient: "from-emerald-400/30 to-emerald-600/30",
                iconBg: "from-emerald-400 to-emerald-600",
                delay: 0.2,
              },
              {
                label: "Completed",
                value: allItems.filter((i) => i.status === "completed").length,
                icon: AwardIcon,
                gradient: "from-teal-400/30 to-teal-600/30",
                iconBg: "from-teal-400 to-teal-600",
                delay: 0.4,
              },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="animate-float"
                  style={{
                    animation: `float 3s ease-in-out infinite`,
                    animationDelay: `${stat.delay}s`,
                  }}
                >
                  <div className="group relative">
                    <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:bg-white/15">
                      {/* Overlay */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                      />

                      {/* Main Content */}
                      <div className="relative z-10">
                        <div className="flex items-center justify-center mb-4">
                          <div
                            className={`bg-gradient-to-br ${stat.iconBg} p-3 rounded-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                          >
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                        </div>

                        <p className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                          {stat.value}
                        </p>

                        <p className="text-sm font-semibold text-white/90 uppercase tracking-wider drop-shadow">
                          {stat.label}
                        </p>
                      </div>

                      {/* Shine Effect */}
                      <div className="absolute inset-0 rounded-2xl overflow-hidden">
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"
                          style={{
                            animation: `shine 3s ease-in-out infinite ${stat.delay}s`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================
          CATEGORY MASONRY GRID
      ========================== */}
      <div className="bg-gradient-to-b from-green-50 via-emerald-50 to-teal-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          {categories.map((category, categoryIndex) => {
            if (!category.items || category.items.length === 0) return null;

            const Icon = category.icon;

            return (
              <div key={categoryIndex} className="mb-24">
                <div className="flex items-center gap-4 mb-12">
                  <div
                    className={`bg-gradient-to-br ${category.color} p-5 rounded-2xl shadow-xl transform hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </div>

                  <div>
                    <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
                      {category.title}
                    </h2>
                    <p className="text-gray-600 mt-1 text-lg font-medium">
                      {category.items.length} initiatives
                    </p>
                  </div>
                </div>

                {/* Masonry */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="break-inside-avoid cursor-pointer"
                      onMouseEnter={() => setHoveredCard(item.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={() => setSelectedItem(item)}
                    >
                      <div
                        className={`bg-white rounded-2xl overflow-hidden shadow-xl transition-all duration-300 border-4 border-transparent hover:border-white ${
                          hoveredCard === item.id ? "shadow-2xl scale-105" : ""
                        }`}
                      >
                        {/* Image */}
                        {item.images && item.images.length > 0 && (
                          <div className="relative h-64 overflow-hidden">
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            />
                            <div
                              className={`absolute inset-0 bg-gradient-to-t ${category.bgColor} opacity-30`}
                            />
                          </div>
                        )}

                        {/* Video */}
                        {item.videos &&
                          item.videos.length > 0 &&
                          !item.images && (
                            <>
                              <div
                                className={`relative h-64 bg-gradient-to-br ${category.bgColor} flex items-center justify-center group`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedVideo(item.videos![0]);
                                }}
                              >
                                <PlayIcon className="w-20 h-20 text-gray-700 group-hover:scale-110 transition-transform drop-shadow-lg" />
                              </div>
                            </>
                          )}

                        <div className="p-6">
                          <h3 className="text-2xl font-bold text-gray-800 mb-3">
                            {item.title}
                          </h3>

                          <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                            {item.description}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {item.value && item.unit && (
                              <span
                                className={`px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${category.color} text-white shadow-lg`}
                              >
                                {item.value} {item.unit}
                              </span>
                            )}
                            {item.year && (
                              <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 shadow-md">
                                {item.year}
                              </span>
                            )}
                            {item.status && (
                              <span
                                className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                                  item.status === "active"
                                    ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                                    : item.status === "completed"
                                    ? "bg-gradient-to-r from-teal-400 to-cyan-500 text-white"
                                    : "bg-gradient-to-r from-lime-400 to-green-500 text-white"
                                }`}
                              >
                                {item.status.charAt(0).toUpperCase() +
                                  item.status.slice(1)}
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-gray-500 mt-4 italic">
                            Click to view full details
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================
          CTA SECTION
      ========================== */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 py-24">
        <div className="absolute inset-0 opacity-30">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: Math.random() * 6 + 2 + "px",
                height: Math.random() * 6 + 2 + "px",
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
                animation: `float ${
                  3 + Math.random() * 4
                }s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
          <h2 className="text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Join Our Sustainable Future
          </h2>

          <p className="text-2xl text-white font-medium mb-8 drop-shadow-md">
            Explore our campus infrastructure and discover how we are building a
            more sustainable, accessible, and innovative environment for all.
          </p>

          <button className="bg-white text-green-600 px-12 py-5 rounded-full font-bold text-xl hover:shadow-2xl transition-all transform hover:scale-110 hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100">
            Schedule a Campus Tour 🌟
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes shine {
          0%, 100% { opacity: 0; transform: translateX(-200%); }
          50% { opacity: 1; transform: translateX(0%); }
        }
      `}</style>
    </div>
  );
}
