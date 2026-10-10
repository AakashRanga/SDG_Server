import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, CpuIcon, EyeIcon } from "lucide-react";
import { InfrastructureForm } from "../components/InfrastructureForm";
import { InfrastructureItemCard } from "../components/InfrastructureItemCard";

export function InfrastructureSmartBuildings() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"initiatives" | "technologies">(
    "initiatives"
  );

  const [smartBuildings, setSmartBuildings] = useState<{
    [key: string]: any[];
  }>({
    initiatives: [],
    technologies: [],
  });

  const API_BASE = "http://180.235.121.250:8006/api/smartBuildings";

  // Fetch items for a tab
  const fetchItems = async (type: string) => {
  try {
    const res = await fetch(`${API_BASE}/${type}`, { cache: "no-store" });
    const data = await res.json();

    const parsed = data.map((item: any) => ({
      ...item,
      imageLink: Array.isArray(item.images)
        ? item.images.filter((img) => typeof img === "string" && img.trim() !== "")
        : [],

      videoLink: Array.isArray(item.videos)
        ? item.videos
        : [],
    }));

    setSmartBuildings((prev) => ({ ...prev, [type]: parsed }));
  } catch (err) {
    console.error("Error fetching items:", err);
  }
};


  // Load both tabs on mount
  useEffect(() => {
    ["initiatives", "technologies"].forEach((t) => fetchItems(t));
  }, []);

  // Add new item
  const addItem = async (type: string, item: any) => {
  try {
    const formData = new FormData();

    formData.append("title", item.title);
    formData.append("description", item.description);
    formData.append("value", item.value || "");
    formData.append("unit", item.unit || "");
    formData.append("year", item.year || "");
    formData.append("status", item.status || "");

    // videos stored as array JSON
    formData.append("videos", JSON.stringify(item.videoLink || []));

    // images (files)
    if (item.images && item.images.length > 0) {
      item.images.forEach((file: File) => {
        formData.append("images", file);
      });
    }

    await fetch(`${API_BASE}/${type}`, {
      method: "POST",
      body: formData, // ❗ NO HEADERS
    });

    await fetchItems(type);
  } catch (err) {
    console.error("Add item error:", err);
  }
};


  // Update item
  const updateItem = async (type: string, updated: any) => {
  try {
    const formData = new FormData();

    formData.append("title", updated.title);
    formData.append("description", updated.description || "");
    formData.append("value", updated.value || "");
    formData.append("unit", updated.unit || "");
    formData.append("year", updated.year || "");
    formData.append("status", updated.status || "");

    // keep old ones
    formData.append("oldImages", JSON.stringify(updated.imageLink || []));
    formData.append("videos", JSON.stringify(updated.videoLink || []));

    // add new images
    if (updated.newImages && updated.newImages.length > 0) {
      updated.newImages.forEach((file: File) => {
        formData.append("images", file);
      });
    }

    await fetch(`${API_BASE}/${updated.id}`, {
      method: "PUT",
      body: formData,
    });

    await fetchItems(type);
  } catch (err) {
    console.error("Update error:", err);
  }
};


  // Delete item
  const deleteItem = async (type: string, id: string) => {
    try {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      setSmartBuildings((prev) => ({
        ...prev,
        [type]: prev[type].filter((item) => item.id !== id),
      }));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const tabs = [
    {
      id: "initiatives" as const,
      label: "Smart Initiatives",
      count: smartBuildings.initiatives.length,
    },
    {
      id: "technologies" as const,
      label: "Technologies",
      count: smartBuildings.technologies.length,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between">
          <button
            onClick={() => navigate("/infrastructure")}
            className="flex items-center gap-2 text-white hover:text-purple-100"
          >
            <ArrowLeftIcon className="w-5 h-5" /> Back to Infrastructure
          </button>
          <button
            onClick={() => navigate("/infrastructure/site")}
            className="flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50"
          >
            <EyeIcon className="w-5 h-5" /> Visit Site
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
            <CpuIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">
            Smart Building Initiatives
          </h1>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cards */}
          <div className="lg:col-span-2 space-y-6">
            {smartBuildings[activeTab].map((item) => (
              <InfrastructureItemCard
                key={item.id}
                item={item}
                onUpdate={(updated) => updateItem(activeTab, updated)}
                onDelete={() => deleteItem(activeTab, item.id)}
              />
            ))}
            {smartBuildings[activeTab].length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No items yet. Add your first item using the form.
              </div>
            )}
          </div>

          {/* Form */}
          <div className="lg:col-span-1">
            <InfrastructureForm
              onSubmit={(item) => addItem(activeTab, item)}
              category="smartBuildings"
              subcategory={activeTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
