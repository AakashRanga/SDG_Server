import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, TreesIcon, EyeIcon } from "lucide-react";
import { InfrastructureForm } from "../components/InfrastructureForm";
import { InfrastructureItemCard } from "../components/InfrastructureItemCard";

export function InfrastructureGreenSpaces() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"openAreas" | "forestedZones">(
    "openAreas"
  );

  const [greenSpaces, setGreenSpaces] = useState<{ [key: string]: any[] }>({
    openAreas: [],
    forestedZones: [],
  });

  const API_BASE = "http://180.235.121.250:8006/api/infrastructure";

  // Fetch items for a tab
  const fetchItems = async (type: string) => {
    try {
      const res = await fetch(`${API_BASE}/${type}`);
      const data = await res.json();

      const parsed = data.map((item: any) => ({
        ...item,
        imageLink: item.imageLink || null,
        videoLink: item.videoLink || null,
      }));

      setGreenSpaces((prev) => ({ ...prev, [type]: parsed }));
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  useEffect(() => {
    ["openAreas", "forestedZones"].forEach((t) => fetchItems(t));
  }, []);

  // ADD — supports imageLink & videoLink
  const addItem = async (type, item) => {
    try {
      const formData = new FormData();

      formData.append("title", item.title);
      formData.append("description", item.description);
      formData.append("value", item.value);
      formData.append("unit", item.unit);
      formData.append("year", item.year);
      formData.append("status", item.status);

      // Images
      if (item.images) {
        item.images.forEach((img) => formData.append("images", img));
      }

      // Videos stored as JSON text
      formData.append("videoLink", JSON.stringify(item.videoLink || []));

      const res = await fetch(`${API_BASE}/${type}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setGreenSpaces((prev) => ({
        ...prev,
        [type]: [...prev[type], data]
      }));
    } catch (err) {
      console.error("Add error:", err);
    }
  };


  // UPDATE — supports editing + replacing image/video
  const updateItem = async (type: string, updated: any) => {
  try {
    const formData = new FormData();

    // Text fields
    formData.append("title", updated.title);
    formData.append("description", updated.description || "");
    formData.append("value", updated.value || "");
    formData.append("unit", updated.unit || "");
    formData.append("year", updated.year || "");
    formData.append("status", updated.status || "active");

    // Keep existing images
    formData.append("oldImages", JSON.stringify(updated.imageLink || []));

    // Videos
    formData.append("videos", JSON.stringify(updated.videoLink || []));

    // New images selected from edit card
    if (updated.newImages && updated.newImages.length > 0) {
      updated.newImages.forEach((file: File) =>
        formData.append("images", file)
      );
    }

    // Send multipart request
    await fetch(`${API_BASE}/${updated.id}`, {
      method: "PUT",
      body: formData,
    });

    // Reload items
    await fetchItems(type);

  } catch (err) {
    console.error("Update error:", err);
  }
};


  // DELETE
  const deleteItem = async (type: string, id: string) => {
    try {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE" });

      setGreenSpaces((prev) => ({
        ...prev,
        [type]: prev[type].filter((item) => item.id !== id),
      }));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const tabs = [
    {
      id: "openAreas" as const,
      label: "Open Areas",
      count: greenSpaces.openAreas.length,
    },
    {
      id: "forestedZones" as const,
      label: "Forested & Planted Zones",
      count: greenSpaces.forestedZones.length,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex gap-4 items-center">
            <button
              onClick={() => navigate("/infrastructure")}
              className="flex items-center gap-2 text-white hover:text-green-100"
            >
              <ArrowLeftIcon className="w-5 h-5" /> Back to Infrastructure
            </button>
          </div>

          <button
            onClick={() => navigate("/infrastructure/site")}
            className="flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50"
          >
            <EyeIcon className="w-5 h-5" /> Visit Site
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
            <TreesIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">
            Green & Open Spaces
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
              className={`px-6 py-3 font-semibold whitespace-nowrap ${activeTab === tab.id
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-green-600"
                }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card list */}
          <div className="lg:col-span-2 space-y-6">
            {greenSpaces[activeTab].map((item) => (
              <InfrastructureItemCard
                key={item.id}
                item={item}
                onUpdate={(updated) => updateItem(activeTab, updated)}
                onDelete={() => deleteItem(activeTab, item.id)}
              />
            ))}

            {greenSpaces[activeTab].length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No items yet. Add your first item using the form.
              </div>
            )}
          </div>

          {/* Add Form */}
          <div className="lg:col-span-1">
            <InfrastructureForm
              onSubmit={(item) => addItem(activeTab, item)}
              category="greenSpaces"
              subcategory={activeTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
