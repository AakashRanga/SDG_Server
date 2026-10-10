import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, HeartPulseIcon, EyeIcon } from "lucide-react";
import { InfrastructureForm } from "../components/InfrastructureForm";
import { InfrastructureItemCard } from "../components/InfrastructureItemCard";

interface WellnessItem {
  id?: number;
  title: string;
  description: string;
  value?: string;
  unit?: string;
  year?: string;
  status?: "active" | "completed" | "planned";
  imageLink?: string[];   // stored as array
  videoLink?: string[];   // stored as array
  newImages?: File[];
}

export function InfrastructureWellness() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"facilities" | "programs">(
    "facilities"
  );

  const [items, setItems] = useState<{ [key: string]: WellnessItem[] }>({
    facilities: [],
    programs: [],
  });

  const API_BASE = "http://180.235.121.250:8006/api/wellness";

  // -------------------------------------------------------------------
  // FETCH ITEMS
  // -------------------------------------------------------------------
  const fetchItems = async (category: "facilities" | "programs") => {
    try {
      const res = await fetch(`${API_BASE}/${category}`, {
        cache: "no-store",
      });

      const data = await res.json();

      const mapped = data.map((item: any) => ({
        ...item,
        imageLink: Array.isArray(item.images) ? item.images : [],
        videoLink: Array.isArray(item.videos) ? item.videos : [],
      }));

      setItems((prev) => ({
        ...prev,
        [category]: mapped,
      }));
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchItems("facilities");
    fetchItems("programs");
  }, []);

  // -------------------------------------------------------------------
  // ADD ITEM (FormData)
  // -------------------------------------------------------------------
  const addItem = async (category: "facilities" | "programs", item: any) => {
    try {
      const fd = new FormData();

      fd.append("title", item.title);
      fd.append("description", item.description);
      fd.append("value", item.value || "");
      fd.append("unit", item.unit || "");
      fd.append("year", item.year || "");
      fd.append("status", item.status || "");
      fd.append("videos", JSON.stringify(item.videoLink || []));
      fd.append("type", category);

      if (item.images?.length > 0) {
        item.images.forEach((file: File) => fd.append("images", file));
      }

      await fetch(`${API_BASE}/${category}`, {
        method: "POST",
        body: fd,
      });

      await fetchItems(category);
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  // -------------------------------------------------------------------
  // UPDATE ITEM (FormData)
  // -------------------------------------------------------------------
  const updateItem = async (
    updated: WellnessItem,
    category: "facilities" | "programs"
  ) => {
    if (!updated.id) return;

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

      await fetch(`${API_BASE}/${updated.id}`, {
        method: "PUT",
        body: fd,
      });

      await fetchItems(category);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // -------------------------------------------------------------------
  // DELETE ITEM
  // -------------------------------------------------------------------
  const deleteItem = async (
    category: "facilities" | "programs",
    id?: number
  ) => {
    if (!id) return;

    try {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      await fetchItems(category);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // -------------------------------------------------------------------
  // UI
  // -------------------------------------------------------------------
  const tabs = [
    {
      id: "facilities" as const,
      label: "Wellness Facilities",
      count: items.facilities.length,
    },
    {
      id: "programs" as const,
      label: "Health Programs",
      count: items.programs.length,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between">
          <button
            onClick={() => navigate("/infrastructure")}
            className="flex items-center gap-2 text-white"
          >
            <ArrowLeftIcon className="w-5 h-5" /> Back
          </button>

          <button
            onClick={() => navigate("/infrastructure/site")}
            className="flex items-center gap-2 bg-white text-pink-600 px-6 py-3 rounded-lg"
          >
            <EyeIcon className="w-5 h-5" /> Visit Site
          </button>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <div className="bg-white/20 p-4 rounded-full">
            <HeartPulseIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">
            Health & Wellness
          </h1>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-300 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-6 py-3 font-semibold ${
                activeTab === t.id
                  ? "text-pink-600 border-b-2 border-pink-600"
                  : "text-gray-600"
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CARDS */}
          <div className="lg:col-span-2 space-y-6">
            {items[activeTab].map((item) => (
              <InfrastructureItemCard
                key={item.id}
                item={item}
                onUpdate={(updated) => updateItem(updated, activeTab)}
                onDelete={() => deleteItem(activeTab, item.id)}
              />
            ))}

            {items[activeTab].length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No items yet.
              </div>
            )}
          </div>

          {/* FORM */}
          <div className="lg:col-span-1">
            <InfrastructureForm
              onSubmit={(item) => addItem(activeTab, item)}
              category="wellness"
              subcategory={activeTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
