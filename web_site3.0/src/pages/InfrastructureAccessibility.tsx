import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, AccessibilityIcon, EyeIcon } from "lucide-react";
import { InfrastructureForm } from "../components/InfrastructureForm";
import { InfrastructureItemCard } from "../components/InfrastructureItemCard";

interface AccessibilityItem {
  id?: number;
  title: string;
  description: string;
  type: "buildings" | "facilities";
  value?: string;
  unit?: string;
  year?: string;
  status?: "active" | "completed" | "planned";
  imageLink?: string; // mapped from backend `images`
  videoLink?: string; // mapped from backend `videos`
}

export function InfrastructureAccessibility() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"buildings" | "facilities">(
    "buildings"
  );

  const [items, setItems] = useState<{ [key: string]: AccessibilityItem[] }>({
    buildings: [],
    facilities: [],
  });

  const API_BASE = "http://180.235.121.250:8006/api/accessibility";

  // Fetch items
  const fetchItems = async (category: "buildings" | "facilities") => {
    try {
      const res = await fetch(`${API_BASE}/${category}`);
      const data = await res.json();

      // Map backend `images` and `videos` to card props
      const mappedData = data.map((item: any) => ({
        ...item,
        imageLink: item.images,
        videoLink: item.videos,
      }));

      setItems((prev) => ({
        ...prev,
        [category]: Array.isArray(mappedData) ? mappedData : [],
      }));
    } catch (err) {
      console.error("Fetch items error:", err);
      setItems((prev) => ({ ...prev, [category]: [] }));
    }
  };

  useEffect(() => {
    fetchItems("buildings");
    fetchItems("facilities");
  }, []);

  // Add new item
  // Add new item
const addItem = async (
  category: "buildings" | "facilities",
  item: any
) => {
  try {
    const formData = new FormData();

    formData.append("title", item.title);
    formData.append("description", item.description);
    formData.append("value", item.value || "");
    formData.append("unit", item.unit || "");
    formData.append("year", item.year || "");
    formData.append("status", item.status || "");
    formData.append("videos", JSON.stringify(item.videoLink || []));

    // Add images (actual files)
    if (item.images && item.images.length > 0) {
      item.images.forEach((file: File) => {
        formData.append("images", file);
      });
    }

    const res = await fetch(`${API_BASE}/${category}`, {
      method: "POST",
      body: formData, // ✔ NO HEADERS HERE
    });

    const data = await res.json();

    const mappedItem = {
      ...data,
      imageLink: data.images,
      videoLink: data.videos,
    };

    setItems((prev) => ({
      ...prev,
      [category]: [...prev[category], mappedItem],
    }));
  } catch (err) {
    console.error("Add item error:", err);
  }
};


  // Update item
  const updateItem = async (item: any) => {
  if (!item.id) return;

  try {
    const formData = new FormData();

    // Required fields
    formData.append("title", item.title);
    formData.append("description", item.description);
    formData.append("value", item.value || "");
    formData.append("unit", item.unit || "");
    formData.append("year", item.year || "");
    formData.append("status", item.status || "");

    // KEEP existing images
    formData.append("oldImages", JSON.stringify(item.imageLink || []));

    // Videos
    formData.append("videos", JSON.stringify(item.videoLink || []));

    // Add NEW uploaded images (from InfrastructureItemCard)
    if (item.newImages && item.newImages.length > 0) {
      item.newImages.forEach((file: File) =>
        formData.append("images", file)
      );
    }

    // Send FormData (no headers)
    await fetch(`${API_BASE}/${item.id}`, {
      method: "PUT",
      body: formData,
    });

    // ⭐ RELOAD THE UPDATED LIST
    await fetchItems(item.type);

  } catch (err) {
    console.error("Update item error:", err);
  }
};


  // Delete item
  const deleteItem = async (
    category: "buildings" | "facilities",
    id?: number
  ) => {
    if (!id) return;
    try {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      setItems((prev) => ({
        ...prev,
        [category]: prev[category].filter((i) => i.id !== id),
      }));
    } catch (err) {
      console.error("Delete item error:", err);
    }
  };

  const tabs = [
    {
      id: "buildings" as const,
      label: "Accessible Buildings",
      count: items.buildings.length,
    },
    {
      id: "facilities" as const,
      label: "Safety Facilities",
      count: items.facilities.length,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between">
          <button
            onClick={() => navigate("/infrastructure")}
            className="flex items-center gap-2 text-white hover:text-blue-100"
          >
            <ArrowLeftIcon className="w-5 h-5" /> Back
          </button>
          <button
            onClick={() => navigate("/infrastructure/site")}
            className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50"
          >
            <EyeIcon className="w-5 h-5" /> Visit Site
          </button>
        </div>
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
            <AccessibilityIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">
            Accessibility & Safety
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
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
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
            {items[activeTab].map((item) => (
              <InfrastructureItemCard
                key={item.id}
                item={item}
                onUpdate={updateItem}
                onDelete={() => deleteItem(activeTab, item.id)}
              />
            ))}
            {items[activeTab].length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No items yet.
              </div>
            )}
          </div>

          {/* Form */}
          <div className="lg:col-span-1">
            <InfrastructureForm
              onSubmit={(item) => addItem(activeTab, item)}
              category="accessibility"
              subcategory={activeTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
