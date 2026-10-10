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
  ChevronDownIcon,
  GlobeIcon,

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
export function EnvironmentSite() {
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
    ...Object.values(energyClimate).flat(),
    ...Object.values(waterConservation).flat(),
    ...Object.values(transportation).flat(),
    ...Object.values(biodiversity).flat(),
    ...Object.values(wasteManagement).flat(),
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
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  const navigationSections = [
    {
      id: "energy-climate",
      title: "Energy & Climate",
      icon: ZapIcon,
      gradient: "from-orange-400 via-yellow-500 to-orange-600",
      bgGradient: "from-orange-50 to-yellow-50",
      description: "Renewable energy & carbon reduction",
    },
    {
      id: "water-conservation",
      title: "Water Conservation",
      icon: DropletIcon,
      gradient: "from-blue-400 via-cyan-500 to-blue-600",
      bgGradient: "from-blue-50 to-cyan-50",
      description: "Sustainable water management",
    },
    {
      id: "transportation",
      title: "Transportation",
      icon: BusIcon,
      gradient: "from-purple-400 via-pink-500 to-purple-600",
      bgGradient: "from-purple-50 to-pink-50",
      description: "Sustainable mobility solutions",
    },
    {
      id: "biodiversity",
      title: "Biodiversity",
      icon: TreesIcon,
      gradient: "from-green-400 via-emerald-500 to-green-600",
      bgGradient: "from-green-50 to-emerald-50",
      description: "Ecosystem conservation",
    },
    {
      id: "waste-management",
      title: "Waste Management",
      icon: Trash2Icon,
      gradient: "from-teal-400 via-cyan-500 to-teal-600",
      bgGradient: "from-teal-50 to-cyan-50",
      description: "Circular economy initiatives",
    },
    {
      id: "center-for-waste-management",
      title: "Center for Waste Management and Renewable Energy",
      icon: GlobeIcon,
      gradient: "from-blue-500 via-indigo-500 to-blue-700",
      bgGradient: "from-blue-50 to-indigo-50",

      // description: "Circular economy initiatives",
      externalUrl: "https://www.simatswaste-energy.com/",
    },
  ];
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
      {/* HERO SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 min-h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/DJI_0961.jpg"
            alt="SIMATS Sustainable Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center z-10">
          {/* Back Button */}
          <div className="absolute top-0 left-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-white hover:text-white/80 transition-colors bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Home
            </button>
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 animate-fade-in drop-shadow-2xl">
            Environmental Sustainability
          </h1>

          <p
            className="text-2xl text-white/95 max-w-3xl mx-auto mb-12 animate-fade-in drop-shadow-lg"
            style={{ animationDelay: "0.2s" }}
          >
            Our commitment to environmental stewardship through comprehensive
            programs in energy, water, transportation, and biodiversity
          </p>

          {/* Floating + Tilt Stats */}
          <div className="flex flex-wrap justify-center gap-6">
            {/* Total Initiatives */}
            <div className="floating-card tilt-card">
              <div className="tilt-inner bg-white/20 backdrop-blur-lg px-8 py-6 rounded-2xl shadow-xl cursor-pointer">
                <SparklesIcon className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white font-semibold text-center">
                  <span className="text-4xl block mb-1">
                    <AnimatedCounter end={allCategories.length} />
                  </span>
                  Total Initiatives
                </p>
              </div>
            </div>

            {/* Active */}
            <div className="floating-card tilt-card">
              <div className="tilt-inner bg-white/20 backdrop-blur-lg px-8 py-6 rounded-2xl shadow-xl cursor-pointer">
                <ActivityIcon className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white font-semibold text-center">
                  <span className="text-4xl block mb-1">
                    <AnimatedCounter end={activeInitiatives} />
                  </span>
                  Active Projects
                </p>
              </div>
            </div>

            {/* Completed */}
            <div className="floating-card tilt-card">
              <div className="tilt-inner bg-white/20 backdrop-blur-lg px-8 py-6 rounded-2xl shadow-xl cursor-pointer">
                <TrendingUpIcon className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white font-semibold text-center">
                  <span className="text-4xl block mb-1">
                    <AnimatedCounter end={completedInitiatives} />
                  </span>
                  Completed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H0Z"
              fill="white"
            />
          </svg>
        </div>

        {/* FLOAT + TILT CSS */}
        <style>{`
    @keyframes smoothFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }
    .floating-card {
      animation: smoothFloat 3.8s ease-in-out infinite;
    }
    .tilt-card:hover .tilt-inner {
      transform: perspective(900px) rotateX(8deg) rotateY(-8deg) scale(1.06);
      box-shadow: 0 20px 40px rgba(0,0,0,0.35);
    }
    .tilt-inner {
      transition: transform 0.4s ease, box-shadow 0.3s ease;
    }
  `}</style>
      </div>

      {/* Navigation Tiles Section */}
      <div className="py-24 bg-gradient-to-b from-white to-gray-50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Explore Our Initiatives
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Click on any section to learn more about our environmental
              programs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {navigationSections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => {
                  if (section.externalUrl) {
                    window.open(section.externalUrl, "_blank"); // opens in new tab
                  } else {
                    scrollToSection(section.id);
                  }
                }}
                className="group relative overflow-hidden rounded-3xl p-8 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`,
                  opacity: 0,
                }}
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${section.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon Container */}
                  <div className="mb-6 relative">
                    <div
                      className={`inline-flex p-6 rounded-2xl bg-gradient-to-br ${section.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                    >
                      <section.icon className="w-12 h-12 text-white" />
                    </div>
                    {/* Floating particles effect */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
                  </div>
                  {/* Text */}
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-800 group-hover:to-gray-600 transition-all duration-300">
                    {section.title}
                  </h3>
                  <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors">
                    {section.description}
                  </p>
                  {/* Arrow indicator */}
                  <div className="flex items-center justify-center">
                    <ChevronDownIcon className="w-6 h-6 text-gray-400 group-hover:text-gray-600 group-hover:translate-y-2 transition-all duration-300" />
                  </div>
                </div>
                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Energy & Climate Section */}
      <div
        id="energy-climate"
        className="py-24 bg-gradient-to-b from-white to-orange-50 relative scroll-mt-20"
      >
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-orange-200 rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-yellow-200 rounded-full opacity-10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <FloatingCard>
              <div className="inline-block bg-gradient-to-br from-orange-100 to-yellow-100 p-6 rounded-2xl mb-6 hover:scale-110 transition-transform shadow-lg">
                <ZapIcon className="w-12 h-12 text-orange-600" />
              </div>
            </FloatingCard>
            <h2 className="text-5xl font-bold text-gray-800 mb-4">
              Energy & Climate Change
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Reducing our carbon footprint through renewable energy and
              efficiency
            </p>
            {/* Progress Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">
                    Renewable Energy
                  </span>
                  <span className="text-2xl font-bold text-orange-600">
                    55%
                  </span>
                </div>
                <ProgressBar value={55} max={100} color="orange" />
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">
                    Carbon Reduction
                  </span>
                  <span className="text-2xl font-bold text-green-600">40%</span>
                </div>
                <ProgressBar value={40} max={100} color="green" />
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">
                    Energy Efficiency
                  </span>
                  <span className="text-2xl font-bold text-blue-600">65%</span>
                </div>
                <ProgressBar value={65} max={100} color="blue" />
              </div>
            </div>
          </div>

          {Object.entries(energyClimate).map(([key, items], sectionIndex) => {
            if (items.length === 0) return null;
            const labels: Record<string, string> = {
              climateChange: "Climate Change Initiatives",
              renewableEnergy: "Renewable Energy",
              energyPrograms: "Energy Efficient Programs",
              greenBuilding: "Green Building",
              carbonFootprint: "Carbon Footprint",
              ghgReduction: "GHG Emissions Reduction",
            };
            return (
              <div key={key} className="mb-20">
                <h3 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b-4 border-orange-200 flex items-center gap-3">
                  <span className="bg-orange-100 text-orange-600 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">
                    {sectionIndex + 1}
                  </span>
                  {labels[key]}
                </h3>
                <div className="grid grid-cols-1 gap-8">
                  {items.map((item, index) => {
                    // Alternate layouts for visual variety
                    const isReversed = index % 2 === 1;
                    const isFullWidth = index % 3 === 0;
                    return (
                      <div
                        key={item.id}
                        className={`bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${isFullWidth ? "col-span-full" : ""
                          }`}
                      >
                        <div
                          className={`grid grid-cols-1 ${item.images && item.images.length > 0
                              ? "lg:grid-cols-2"
                              : ""
                            } gap-0`}
                        >
                          {/* Images Section */}
                          {item.images && item.images.length > 0 && (
                            <div
                              className={`relative h-80 lg:h-auto ${isReversed ? "lg:order-2" : ""
                                }`}
                            >
                              {item.images.length === 1 ? (
                                <div className="relative group h-full">
                                  <img
                                    src={item.images[0]}
                                    alt={item.title}
                                    className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500"
                                    onClick={() =>
                                      openImageModal(item.images!, 0)
                                    }
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                              ) : (
                                <div className="grid grid-cols-2 gap-2 p-2 h-full">
                                  {item.images
                                    .slice(0, 4)
                                    .map((image, imgIndex) => (
                                      <div
                                        key={imgIndex}
                                        className="relative overflow-hidden rounded-lg cursor-pointer group"
                                        onClick={() =>
                                          openImageModal(item.images!, imgIndex)
                                        }
                                      >
                                        <img
                                          src={image}
                                          alt={`${item.title} ${imgIndex + 1}`}
                                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                        {imgIndex === 3 &&
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
                          {/* Content Section */}
                          <div className="p-8 flex flex-col justify-center">
                            <div className="flex items-start gap-3 mb-4">
                              <div className="bg-orange-100 p-2 rounded-lg">
                                <ZapIcon className="w-6 h-6 text-orange-600" />
                              </div>
                              <h4 className="text-2xl font-bold text-gray-800 flex-1">
                                {item.title}
                              </h4>
                            </div>
                            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                              {item.description}
                            </p>
                            {/* Badges */}
                            <div className="flex flex-wrap gap-3 mb-6">
                              {item.value && item.unit && (
                                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 flex items-center gap-2 hover:scale-105 transition-transform">
                                  <TrendingUpIcon className="w-5 h-5" />
                                  {item.value} {item.unit}
                                </span>
                              )}
                              {item.year && (
                                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 flex items-center gap-2 hover:scale-105 transition-transform">
                                  <CalendarIcon className="w-5 h-5" />
                                  {item.year}
                                </span>
                              )}
                              {item.status && (
                                <span
                                  className={`px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 transition-transform ${item.status === "completed"
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
                            {/* Files */}
                            {item.files && item.files.length > 0 && (
                              <div className="space-y-3">
                                <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                  <FileIcon className="w-4 h-4" />
                                  Documents & Resources
                                </h5>
                                {item.files.map((file, fileIndex) => (
                                  <button
                                    key={fileIndex}
                                    onClick={() =>
                                      handleDownload(file.url, file.name)
                                    }
                                    className="w-full flex items-center justify-between bg-gradient-to-r from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100 p-4 rounded-xl transition-all group transform hover:scale-[1.02]"
                                  >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <div className="bg-orange-200 p-2 rounded-lg group-hover:scale-110 transition-transform">
                                        <FileIcon className="w-6 h-6 text-orange-700" />
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
                                    <DownloadIcon className="w-5 h-5 text-orange-600 group-hover:text-orange-700 group-hover:translate-y-1 transition-transform" />
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Water Conservation Section */}
      <div
        id="water-conservation"
        className="py-24 bg-gradient-to-b from-orange-50 to-blue-50 relative overflow-hidden scroll-mt-20"
      >
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
                                  className={`px-4 py-2 rounded-full text-sm font-semibold ${item.status === "completed"
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

      {/* Transportation Section */}
      <div
        id="transportation"
        className="py-24 bg-gradient-to-b from-blue-50 to-purple-50 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block bg-purple-100 p-6 rounded-2xl mb-6">
              <BusIcon className="w-12 h-12 text-purple-600" />
            </div>
            <h2 className="text-5xl font-bold text-gray-800 mb-4">
              Sustainable Transportation
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Creating a cleaner, more accessible campus through sustainable
              mobility
            </p>
          </div>
          {Object.entries(transportation).map(([key, items]) => {
            if (items.length === 0) return null;
            const labels: Record<string, string> = {
              shuttleServices: "Shuttle Services",
              pedestrianPaths: "Pedestrian & Bicycle Pathways",
              zeroEmission: "Zero Emission Vehicles",
              parkingReduction: "Parking Reduction",
            };
            return (
              <div key={key} className="mb-20">
                <h3 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b-4 border-purple-200">
                  {labels[key]}
                </h3>
                <div className="grid grid-cols-1 gap-8">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {item.images && item.images.length > 0 && (
                          <div className="relative h-80 lg:h-auto">
                            {item.images.length === 1 ? (
                              <img
                                src={item.images[0]}
                                alt={item.title}
                                className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                                onClick={() => openImageModal(item.images!, 0)}
                              />
                            ) : (
                              <div className="grid grid-cols-2 gap-2 p-2 h-full">
                                {item.images.slice(0, 4).map((image, index) => (
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
                                    {index === 3 && item.images!.length > 4 && (
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
                              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-purple-100 text-purple-700 flex items-center gap-2">
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
                                className={`px-4 py-2 rounded-full text-sm font-semibold ${item.status === "completed"
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
                                  className="w-full flex items-center justify-between bg-purple-50 hover:bg-purple-100 p-4 rounded-xl transition-colors group"
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="bg-purple-200 p-2 rounded-lg">
                                      <FileIcon className="w-6 h-6 text-purple-700" />
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
                                  <DownloadIcon className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
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
          })}
        </div>
      </div>

      {/* Biodiversity Section */}
      <div
        id="biodiversity"
        className="py-24 bg-gradient-to-b from-purple-50 to-white scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block bg-green-100 p-6 rounded-2xl mb-6">
              <TreesIcon className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-5xl font-bold text-gray-800 mb-4">
              Biodiversity & Conservation
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Protecting and enhancing campus ecosystems for future generations
            </p>
          </div>
          {Object.entries(biodiversity).map(([key, items]) => {
            if (items.length === 0) return null;
            const labels: Record<string, string> = {
              floraFauna: "Flora & Fauna Conservation",
              biodiversityMapping: "Campus Biodiversity Mapping",
              greenCorridors: "Green Corridors",
            };
            return (
              <div key={key} className="mb-20">
                <h3 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b-4 border-green-200">
                  {labels[key]}
                </h3>
                <div className="grid grid-cols-1 gap-8">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {item.images && item.images.length > 0 && (
                          <div className="relative h-80 lg:h-auto">
                            {item.images.length === 1 ? (
                              <img
                                src={item.images[0]}
                                alt={item.title}
                                className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                                onClick={() => openImageModal(item.images!, 0)}
                              />
                            ) : (
                              <div className="grid grid-cols-2 gap-2 p-2 h-full">
                                {item.images.slice(0, 4).map((image, index) => (
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
                                    {index === 3 && item.images!.length > 4 && (
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
                              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-700 flex items-center gap-2">
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
                                className={`px-4 py-2 rounded-full text-sm font-semibold ${item.status === "completed"
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
                                  className="w-full flex items-center justify-between bg-green-50 hover:bg-green-100 p-4 rounded-xl transition-colors group"
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="bg-green-200 p-2 rounded-lg">
                                      <FileIcon className="w-6 h-6 text-green-700" />
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
                                  <DownloadIcon className="w-5 h-5 text-green-600 group-hover:text-green-700" />
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
          })}
        </div>
      </div>

      {/* Waste Management Section */}
      <div
        id="waste-management"
        className="py-24 bg-gradient-to-b from-white to-teal-50 relative overflow-hidden scroll-mt-20"
      >
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-teal-200 rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-200 rounded-full opacity-10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <FloatingCard delay={0.4}>
              <div className="inline-block bg-gradient-to-br from-teal-100 to-cyan-100 p-6 rounded-2xl mb-6 hover:scale-110 transition-transform shadow-lg">
                <Trash2Icon className="w-12 h-12 text-teal-600" />
              </div>
            </FloatingCard>
            <h2 className="text-5xl font-bold text-gray-800 mb-4">
              Waste Management & Circular Economy
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Building a sustainable future through comprehensive waste
              reduction and recycling programs
            </p>
            {/* Waste Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">
                    Waste Diversion
                  </span>
                  <RecycleIcon className="w-6 h-6 text-teal-600" />
                </div>
                <p className="text-3xl font-bold text-teal-600 mb-2">
                  <AnimatedCounter end={75} suffix="%" />
                </p>
                <ProgressBar value={75} max={100} color="teal" />
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">
                    E-Waste Recycled
                  </span>
                  <ActivityIcon className="w-6 h-6 text-cyan-600" />
                </div>
                <p className="text-3xl font-bold text-cyan-600 mb-2">
                  <AnimatedCounter end={15} suffix=" tons" />
                </p>
                <ProgressBar value={60} max={100} color="cyan" />
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">
                    Composting
                  </span>
                  <TrendingUpIcon className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-green-600 mb-2">
                  <AnimatedCounter end={50} suffix=" tons" />
                </p>
                <ProgressBar value={80} max={100} color="green" />
              </div>
            </div>
          </div>

          {Object.entries(wasteManagement).map(([key, items], sectionIndex) => {
            if (items.length === 0) return null;
            const labels: Record<string, string> = {
              eWaste: "E-Waste Management",
              biomedicalWaste: "Biomedical Waste",
              medicalWaste: "Medical Waste",
              dentalWaste: "Dental Waste",
              generalWaste: "General Waste & Recycling",
              foodWaste: "Food Waste & Composting",
              renewalProjects: "Waste Renewal Projects",
              artFromWaste: "Art from Waste",
            };
            return (
              <div key={key} className="mb-20">
                <h3 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b-4 border-teal-200 flex items-center gap-3">
                  <span className="bg-teal-100 text-teal-600 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">
                    {sectionIndex + 1}
                  </span>
                  {labels[key]}
                </h3>
                <div className="grid grid-cols-1 gap-8">
                  {items.map((item, index) => {
                    const isReversed = index % 2 === 1;
                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div
                          className={`grid grid-cols-1 ${item.images && item.images.length > 0
                              ? "lg:grid-cols-2"
                              : ""
                            } gap-0`}
                        >
                          {/* Images Section */}
                          {item.images && item.images.length > 0 && (
                            <div
                              className={`relative h-80 lg:h-auto ${isReversed ? "lg:order-2" : ""
                                }`}
                            >
                              {item.images.length === 1 ? (
                                <div className="relative group h-full">
                                  <img
                                    src={item.images[0]}
                                    alt={item.title}
                                    className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500"
                                    onClick={() =>
                                      openImageModal(item.images!, 0)
                                    }
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                              ) : (
                                <div className="grid grid-cols-2 gap-2 p-2 h-full">
                                  {item.images
                                    .slice(0, 4)
                                    .map((image, imgIndex) => (
                                      <div
                                        key={imgIndex}
                                        className="relative overflow-hidden rounded-lg cursor-pointer group"
                                        onClick={() =>
                                          openImageModal(item.images!, imgIndex)
                                        }
                                      >
                                        <img
                                          src={image}
                                          alt={`${item.title} ${imgIndex + 1}`}
                                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                        {imgIndex === 3 &&
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
                          {/* Content Section */}
                          <div className="p-8 flex flex-col justify-center">
                            <div className="flex items-start gap-3 mb-4">
                              <div className="bg-teal-100 p-2 rounded-lg">
                                <Trash2Icon className="w-6 h-6 text-teal-600" />
                              </div>
                              <h4 className="text-2xl font-bold text-gray-800 flex-1">
                                {item.title}
                              </h4>
                            </div>
                            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                              {item.description}
                            </p>
                            {/* Badges */}
                            <div className="flex flex-wrap gap-3 mb-6">
                              {item.value && item.unit && (
                                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 flex items-center gap-2 hover:scale-105 transition-transform">
                                  <TrendingUpIcon className="w-5 h-5" />
                                  {item.value} {item.unit}
                                </span>
                              )}
                              {item.year && (
                                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 flex items-center gap-2 hover:scale-105 transition-transform">
                                  <CalendarIcon className="w-5 h-5" />
                                  {item.year}
                                </span>
                              )}
                              {item.status && (
                                <span
                                  className={`px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 transition-transform ${item.status === "completed"
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
                            {/* Files */}
                            {item.files && item.files.length > 0 && (
                              <div className="space-y-3">
                                <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                  <FileIcon className="w-4 h-4" />
                                  Documents & Resources
                                </h5>
                                {item.files.map((file, fileIndex) => (
                                  <button
                                    key={fileIndex}
                                    onClick={() =>
                                      handleDownload(file.url, file.name)
                                    }
                                    className="w-full flex items-center justify-between bg-gradient-to-r from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 p-4 rounded-xl transition-all group transform hover:scale-[1.02]"
                                  >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <div className="bg-teal-200 p-2 rounded-lg group-hover:scale-110 transition-transform">
                                        <FileIcon className="w-6 h-6 text-teal-700" />
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
                                    <DownloadIcon className="w-5 h-5 text-teal-600 group-hover:text-teal-700 group-hover:translate-y-1 transition-transform" />
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
