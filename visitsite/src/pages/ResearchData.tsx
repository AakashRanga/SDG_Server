import React from "react";
import { useNavigate } from "react-router-dom";
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
  EyeIcon,
} from "lucide-react";
export function ResearchData() {
  const navigate = useNavigate();
  const categories = [
    {
      id: 1,
      title: "Research Funding",
      icon: DollarSignIcon,
      color: "from-green-400 to-green-600",
      path: "/research/funding",
    },
    {
      id: 2,
      title: "Publications & Scholarly Output",
      icon: BookOpenIcon,
      color: "from-blue-400 to-blue-600",
      path: "/research/publications",
    },
    {
      id: 3,
      title: "Patents & Innovations",
      icon: LightbulbIcon,
      color: "from-yellow-400 to-yellow-600",
      path: "/research/patents",
    },
    {
      id: 4,
      title: "Sustainability Courses",
      icon: GraduationCapIcon,
      color: "from-purple-400 to-purple-600",
      path: "/research/courses",
    },
    {
      id: 5,
      title: "Student Research",
      icon: FlaskConicalIcon,
      color: "from-pink-400 to-pink-600",
      path: "/research/student-research",
    },
    {
      id: 6,
      title: "Collaborations",
      icon: HandshakeIcon,
      color: "from-indigo-400 to-indigo-600",
      path: "/research/collaborations",
    },
    {
      id: 7,
      title: "Community Outreach",
      icon: UsersIcon,
      color: "from-teal-400 to-teal-600",
      path: "/research/outreach",
    },
    {
      id: 8,
      title: "Sustainability Startups",
      icon: RocketIcon,
      color: "from-orange-400 to-orange-600",
      path: "/research/startups",
    },
    {
      id: 9,
      title: "Green Job Graduates",
      icon: BriefcaseIcon,
      color: "from-emerald-400 to-emerald-600",
      path: "/research/graduates",
    },
    {
      id: 10,
      title: "Climate Action Innovations",
      icon: SparklesIcon,
      color: "from-cyan-400 to-cyan-600",
      path: "/research/innovations",
    },
  ];
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-white hover:text-purple-100 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate("/research/site")}
              className="flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors shadow-lg"
            >
              <EyeIcon className="w-5 h-5" />
              Visit Site
            </button>
          </div>
          <h1 className="text-4xl font-bold text-white mt-6 text-center">
            Research & Innovation Data Collection
          </h1>
          <p className="text-center text-purple-100 mt-2 text-lg">
            Collect and manage sustainability research data
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => navigate(category.path)}
                className={`relative group bg-gradient-to-br ${category.color} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/20 pointer-events-none" />
                <div className="relative p-8 flex flex-col items-center justify-center space-y-4">
                  <div className="bg-white/20 rounded-full p-6 shadow-inner backdrop-blur-sm">
                    <Icon className="w-12 h-12 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-white text-center leading-tight">
                    {category.title}
                  </h3>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
