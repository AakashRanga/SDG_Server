import React, { useEffect, useState, createElement, Component } from "react";
import { useNavigate } from "react-router-dom";
import {
  LeafIcon,
  ZapIcon,
  DropletIcon,
  BusIcon,
  TreesIcon,
  Trash2Icon,
  ArrowLeftIcon,
  TrendingUpIcon,
  CalendarIcon,
  FileIcon,
  DownloadIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
  TrendingDownIcon,
  ActivityIcon,
  RecycleIcon,
} from "lucide-react";
import { useEnvironment } from "../contexts/EnvironmentContext";
// Animated Counter Component
function AnimatedCounter({
  end,
  duration = 2000,
  suffix = "",
}: {
  end: number;
  duration?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);
  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}
// Progress Bar Component
function ProgressBar({
  value,
  max,
  color = "green",
}: {
  value: number;
  max: number;
  color?: string;
}) {
  const percentage = (value / max) * 100;
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setTimeout(() => setWidth(percentage), 100);
  }, [percentage]);
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div
        className={`h-full bg-gradient-to-r from-${color}-400 to-${color}-600 transition-all duration-1000 ease-out`}
        style={{
          width: `${width}%`,
        }}
      />
    </div>
  );
}
// Floating Card Component
function FloatingCard({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <div
      className="animate-float"
      style={{
        animation: `float 3s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      {children}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
export function WaterConservationSite() {
  const navigate = useNavigate();
  const {
    energyClimate,
    waterConservation,
    transportation,
    biodiversity,
    wasteManagement,
  } = useEnvironment();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageGallery, setImageGallery] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const allCategories = [
    ...Object.values(waterConservation).flat(),
  ];
  const totalInitiatives = allCategories.length;
  const activeInitiatives = allCategories.filter(
    (item) => item.status === "active"
  ).length;
  const completedInitiatives = allCategories.filter(
    (item) => item.status === "completed"
  ).length;
  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  };
  const openImageModal = (images: string[], startIndex: number) => {
    setImageGallery(images);
    setCurrentImageIndex(startIndex);
    setSelectedImage(images[startIndex]);
  };
  const closeImageModal = () => {
    setSelectedImage(null);
    setImageGallery([]);
    setCurrentImageIndex(0);
  };
  const nextImage = () => {
    const newIndex = (currentImageIndex + 1) % imageGallery.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(imageGallery[newIndex]);
  };
  const prevImage = () => {
    const newIndex =
      (currentImageIndex - 1 + imageGallery.length) % imageGallery.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(imageGallery[newIndex]);
  };
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={closeImageModal}
        >
          <button
            onClick={closeImageModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2"
          >
            <XIcon className="w-8 h-8" />
          </button>
          {imageGallery.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-3"
              >
                <ChevronLeftIcon className="w-12 h-12" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-3"
              >
                <ChevronRightIcon className="w-12 h-12" />
              </button>
            </>
          )}
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          {imageGallery.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
              {currentImageIndex + 1} / {imageGallery.length}
            </div>
          )}
        </div>
      )}

      {/* Hero Section with Parallax */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 min-h-screen flex items-center">
        {/* Animated Background Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${
                  3 + Math.random() * 4
                }s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center z-10">
          <button
            onClick={() => navigate("/")}
            className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors hover:scale-110 transform"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back
          </button>

          <FloatingCard>
            <div className="inline-block mb-8">
              <div className="bg-white/20 backdrop-blur-sm p-8 rounded-full hover:scale-110 transition-transform duration-300">
                <LeafIcon className="w-20 h-20 text-white" />
              </div>
            </div>
          </FloatingCard>

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Environmental Sustainability
          </h1>

          <p
            className="text-2xl text-green-100 max-w-3xl mx-auto mb-12 animate-fade-in"
            style={{
              animationDelay: "0.2s",
            }}
          >
            Our commitment to environmental stewardship through comprehensive
            programs in energy, water, transportation, and biodiversity
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <FloatingCard delay={0}>
              <div className="bg-white/20 backdrop-blur-sm px-8 py-6 rounded-2xl hover:bg-white/30 transition-all hover:scale-105 transform cursor-pointer group">
                <SparklesIcon className="w-8 h-8 text-white mx-auto mb-2 group-hover:rotate-12 transition-transform" />
                <p className="text-white font-semibold">
                  <span className="text-4xl block mb-1">
                    <AnimatedCounter end={totalInitiatives} />
                  </span>
                  Total Initiatives
                </p>
              </div>
            </FloatingCard>
            <FloatingCard delay={0.2}>
              <div className="bg-white/20 backdrop-blur-sm px-8 py-6 rounded-2xl hover:bg-white/30 transition-all hover:scale-105 transform cursor-pointer group">
                <ActivityIcon className="w-8 h-8 text-white mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-white font-semibold">
                  <span className="text-4xl block mb-1">
                    <AnimatedCounter end={activeInitiatives} />
                  </span>
                  Active Projects
                </p>
              </div>
            </FloatingCard>
            <FloatingCard delay={0.4}>
              <div className="bg-white/20 backdrop-blur-sm px-8 py-6 rounded-2xl hover:bg-white/30 transition-all hover:scale-105 transform cursor-pointer group">
                <TrendingUpIcon className="w-8 h-8 text-white mx-auto mb-2 group-hover:translate-y-[-4px] transition-transform" />
                <p className="text-white font-semibold">
                  <span className="text-4xl block mb-1">
                    <AnimatedCounter end={completedInitiatives} />
                  </span>
                  Completed
                </p>
              </div>
            </FloatingCard>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* Water Conservation Section */}
            <div className="py-24 bg-gradient-to-b from-orange-50 to-blue-50 relative overflow-hidden">
              {/* Animated Water Drops */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-4 bg-blue-400/20 rounded-full"
                    style={{
                      left: `${10 + i * 10}%`,
                      animation: `fall ${2 + Math.random() * 3}s linear infinite`,
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  >
                    <style>{`
                      @keyframes fall {
                        0% { transform: translateY(-100px); opacity: 0; }
                        50% { opacity: 1; }
                        100% { transform: translateY(100vh); opacity: 0; }
                      }
                    `}</style>
                  </div>
                ))}
              </div>
      
              <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                  <FloatingCard delay={0.3}>
                    <div className="inline-block bg-gradient-to-br from-blue-100 to-cyan-100 p-6 rounded-2xl mb-6 hover:scale-110 transition-transform shadow-lg">
                      <DropletIcon className="w-12 h-12 text-blue-600" />
                    </div>
                  </FloatingCard>
                  <h2 className="text-5xl font-bold text-gray-800 mb-4">
                    Water Conservation
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                    Preserving our most precious resource through innovative
                    conservation practices
                  </p>
                  {/* Water Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600">
                          Water Saved
                        </span>
                        <TrendingDownIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-3xl font-bold text-blue-600 mb-2">
                        <AnimatedCounter end={2000000} suffix=" gal" />
                      </p>
                      <ProgressBar value={75} max={100} color="blue" />
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600">
                          Recycling Rate
                        </span>
                        <ActivityIcon className="w-6 h-6 text-cyan-600" />
                      </div>
                      <p className="text-3xl font-bold text-cyan-600 mb-2">
                        <AnimatedCounter end={45} suffix="%" />
                      </p>
                      <ProgressBar value={45} max={100} color="cyan" />
                    </div>
                  </div>
                </div>
      
                {Object.entries(waterConservation).map(
                  ([key, items], sectionIndex) => {
                    if (items.length === 0) return null;
                    const labels: Record<string, string> = {
                      conservation: "Water Conservation",
                      recycling: "Water Recycling",
                      efficientAppliances: "Water Efficient Appliances",
                      wastewaterTreatment: "Wastewater Treatment",
                    };
                    return (
                      <div key={key} className="mb-20">
                        <h3 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b-4 border-blue-200 flex items-center gap-3">
                          <span className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">
                            {sectionIndex + 1}
                          </span>
                          {labels[key]}
                        </h3>
                        <div className="grid grid-cols-1 gap-8">
                          {items.map((item, index) => (
                            <div
                              key={item.id}
                              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                                {item.images && item.images.length > 0 && (
                                  <div className="relative h-80 lg:h-auto">
                                    {item.images.length === 1 ? (
                                      <img
                                        src={item.images[0]}
                                        alt={item.title}
                                        className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                                        onClick={() =>
                                          openImageModal(item.images!, 0)
                                        }
                                      />
                                    ) : (
                                      <div className="grid grid-cols-2 gap-2 p-2 h-full">
                                        {item.images
                                          .slice(0, 4)
                                          .map((image, index) => (
                                            <div
                                              key={index}
                                              className="relative overflow-hidden rounded-lg cursor-pointer group"
                                              onClick={() =>
                                                openImageModal(item.images!, index)
                                              }
                                            >
                                              <img
                                                src={image}
                                                alt={`${item.title} ${index + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                              />
                                              {index === 3 &&
                                                item.images!.length > 4 && (
                                                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                    <span className="text-white text-2xl font-bold">
                                                      +{item.images!.length - 4}
                                                    </span>
                                                  </div>
                                                )}
                                            </div>
                                          ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                                <div className="p-8">
                                  <h4 className="text-2xl font-bold text-gray-800 mb-4">
                                    {item.title}
                                  </h4>
                                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                                    {item.description}
                                  </p>
                                  <div className="flex flex-wrap gap-3 mb-6">
                                    {item.value && item.unit && (
                                      <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 flex items-center gap-2">
                                        <TrendingUpIcon className="w-5 h-5" />
                                        {item.value} {item.unit}
                                      </span>
                                    )}
                                    {item.year && (
                                      <span className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 flex items-center gap-2">
                                        <CalendarIcon className="w-5 h-5" />
                                        {item.year}
                                      </span>
                                    )}
                                    {item.status && (
                                      <span
                                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                          item.status === "completed"
                                            ? "bg-green-100 text-green-700"
                                            : item.status === "active"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-gray-100 text-gray-700"
                                        }`}
                                      >
                                        {item.status.charAt(0).toUpperCase() +
                                          item.status.slice(1)}
                                      </span>
                                    )}
                                  </div>
                                  {item.files && item.files.length > 0 && (
                                    <div className="space-y-3">
                                      <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Documents & Resources
                                      </h5>
                                      {item.files.map((file, index) => (
                                        <button
                                          key={index}
                                          onClick={() =>
                                            handleDownload(file.url, file.name)
                                          }
                                          className="w-full flex items-center justify-between bg-blue-50 hover:bg-blue-100 p-4 rounded-xl transition-colors group"
                                        >
                                          <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="bg-blue-200 p-2 rounded-lg">
                                              <FileIcon className="w-6 h-6 text-blue-700" />
                                            </div>
                                            <div className="flex-1 min-w-0 text-left">
                                              <p className="text-sm font-semibold text-gray-800 truncate">
                                                {file.name}
                                              </p>
                                              <p className="text-xs text-gray-500">
                                                {file.size}
                                              </p>
                                            </div>
                                          </div>
                                          <DownloadIcon className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
            </div>
  );
}