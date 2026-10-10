import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, MapIcon, EyeIcon } from "lucide-react";
import { InfrastructureForm } from "../components/InfrastructureForm";
import { InfrastructureItemCard } from "../components/InfrastructureItemCard";

interface PlanningItem {
  id: number;
  title: string;
  description: string;
  value?: string;
  unit?: string;
  year?: string;
  status?: "active" | "planned" | "completed";
  imageLink?: string[];
  videoLink?: string[];
  newImages?: File[];
}

export function InfrastructurePlanning() {
  const navigate = useNavigate();
  const API = "http://180.235.121.250:8006/api";

  const [activeTab, setActiveTab] =
    useState<"strategies" | "expansions">("strategies");

  const [planning, setPlanning] = useState<{
    strategies: PlanningItem[];
    expansions: PlanningItem[];
  }>({
    strategies: [],
    expansions: [],
  });

  const tabs = [
    {
      id: "strategies" as const,
      label: "Long-term Strategies",
      count: planning.strategies.length,
    },
    {
      id: "expansions" as const,
      label: "Expansion Plans",
      count: planning.expansions.length,
    },
  ];

  // Normalize DB → UI
  const normalizeMedia = (item: any): PlanningItem => ({
    ...item,
    imageLink: Array.isArray(item.images) ? item.images : [],
    videoLink: Array.isArray(item.videos) ? item.videos : [],
  });

  const fetchPlanning = async (subcategory: "strategies" | "expansions") => {
    try {
      const res = await fetch(`${API}/planning/${subcategory}`);
      const data = await res.json();

      setPlanning((prev) => ({
        ...prev,
        [subcategory]: data.map(normalizeMedia),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPlanning("strategies");
    fetchPlanning("expansions");
  }, []);

  // ---------------------- ADD ITEM ----------------------
  const addItem = async (subcategory: "strategies" | "expansions", item: any) => {
    try {
      const fd = new FormData();

      fd.append("title", item.title);
      fd.append("description", item.description);
      fd.append("value", item.value || "");
      fd.append("unit", item.unit || "");
      fd.append("year", item.year || "");
      fd.append("status", item.status || "");
      fd.append("videos", JSON.stringify(item.videoLink || []));

      if (item.images?.length > 0) {
        item.images.forEach((file: File) => fd.append("images", file));
      }

      await fetch(`${API}/planning/${subcategory}`, {
        method: "POST",
        body: fd,
      });

      fetchPlanning(subcategory);
    } catch (err) {
      console.error("Add Error:", err);
    }
  };

  // ---------------------- UPDATE ITEM ----------------------
  const updateItem = async (
    subcategory: "strategies" | "expansions",
    id: number,
    updated: PlanningItem
  ) => {
    try {
      const fd = new FormData();

      fd.append("title", updated.title);
      fd.append("description", updated.description);
      fd.append("value", updated.value || "");
      fd.append("unit", updated.unit || "");
      fd.append("year", updated.year || "");
      fd.append("status", updated.status || "");

      fd.append("oldImages", JSON.stringify(updated.imageLink || []));
      fd.append("videos", JSON.stringify(updated.videoLink || []));

      if (updated.newImages?.length > 0) {
        updated.newImages.forEach((file) => fd.append("images", file));
      }

      await fetch(`${API}/planning/${id}`, {
        method: "PUT",
        body: fd,
      });

      fetchPlanning(subcategory);
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  // ---------------------- DELETE ITEM ----------------------
  const deleteItem = async (
    subcategory: "strategies" | "expansions",
    id: number
  ) => {
    try {
      await fetch(`${API}/planning/${id}`, {
        method: "DELETE",
      });

      fetchPlanning(subcategory);
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/infrastructure")}
              className="flex items-center gap-2 text-white"
            >
              <ArrowLeftIcon className="w-5 h-5" /> Back to Infrastructure
            </button>

            <button
              onClick={() => navigate("/infrastructure/site")}
              className="flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-lg"
            >
              <EyeIcon className="w-5 h-5" /> Visit Site
            </button>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <div className="bg-white/20 p-4 rounded-full">
              <MapIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              Planning & Expansion Strategy
            </h1>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold ${
                activeTab === tab.id
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {planning[activeTab].map((item) => (
              <InfrastructureItemCard
                key={item.id}
                item={item}
                onUpdate={(updatedItem) => updateItem(activeTab, item.id, updatedItem)}
                onDelete={() => deleteItem(activeTab, item.id)}
              />
            ))}

            {planning[activeTab].length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No items yet.
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <InfrastructureForm
              onSubmit={(item) => addItem(activeTab, item)}
              category="planning"
              subcategory={activeTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
