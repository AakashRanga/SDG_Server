import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, AmphoraIcon, EyeIcon } from "lucide-react";
import { InfrastructureForm } from "../components/InfrastructureForm";
import { InfrastructureItemCard } from "../components/InfrastructureItemCard";

interface BudgetItem {
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

export function InfrastructureBudget() {
  const navigate = useNavigate();
  const API = "http://180.235.121.250:8006/api";

  const [activeTab, setActiveTab] =
    useState<"allocations" | "investments">("allocations");

  const [budget, setBudget] = useState<{
    allocations: BudgetItem[];
    investments: BudgetItem[];
  }>({
    allocations: [],
    investments: [],
  });

  const tabs = [
    { id: "allocations" as const, label: "Arts and Heritage" },
	//{ id: "investments" as const, label: "Investments" },
  ];

  // Normalize DB → UI fields
  const normalizeMedia = (item: any): BudgetItem => ({
    ...item,
    imageLink: Array.isArray(item.images) ? item.images : [],
    videoLink: Array.isArray(item.videos) ? item.videos : [],
  });

  // Fetch items
  const fetchBudget = async (subcategory: "allocations" | "investments") => {
    try {
      const res = await fetch(`${API}/budget/${subcategory}`);
      const data = await res.json();

      setBudget((prev) => ({
        ...prev,
        [subcategory]: data.map(normalizeMedia),
      }));
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchBudget("allocations");
    fetchBudget("investments");
  }, []);

  // ----------------------------------------------------------------------
  // ADD ITEM (FormData)
  // ----------------------------------------------------------------------
  const addItem = async (subcategory: "allocations" | "investments", item: any) => {
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

      await fetch(`${API}/budget/${subcategory}`, {
        method: "POST",
        body: fd,
      });

      fetchBudget(subcategory);
    } catch (err) {
      console.error("Add Error:", err);
    }
  };

  // ----------------------------------------------------------------------
  // UPDATE ITEM (FormData)
  // ----------------------------------------------------------------------
  const updateItem = async (
    subcategory: "allocations" | "investments",
    id: number,
    updated: BudgetItem
  ) => {
    try {
      const fd = new FormData();

      fd.append("title", updated.title);
      fd.append("description", updated.description);
      fd.append("value", updated.value || "");
      fd.append("unit", updated.unit || "");
      fd.append("year", updated.year || "");
      fd.append("status", updated.status || "");

      // Keep old images
      fd.append("oldImages", JSON.stringify(updated.imageLink || []));

      // Videos
      fd.append("videos", JSON.stringify(updated.videoLink || []));

      // Add new images
      if (updated.newImages?.length > 0) {
        updated.newImages.forEach((file: File) => fd.append("images", file));
      }

      await fetch(`${API}/budget/${id}`, {
        method: "PUT",
        body: fd,
      });

      fetchBudget(subcategory);
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  // ----------------------------------------------------------------------
  // DELETE ITEM
  // ----------------------------------------------------------------------
  const deleteItem = async (
    subcategory: "allocations" | "investments",
    id: number
  ) => {
    try {
      await fetch(`${API}/budget/${id}`, {
        method: "DELETE",
      });

      fetchBudget(subcategory);
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  // ----------------------------------------------------------------------
  // UI
  // ----------------------------------------------------------------------
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/infrastructure")}
              className="flex items-center gap-2 text-white hover:text-yellow-100 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Infrastructure
            </button>

            <button
              onClick={() => navigate("/infrastructure/site")}
              className="flex items-center gap-2 bg-white text-yellow-600 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-50 transition-colors shadow-lg"
            >
              <EyeIcon className="w-5 h-5" />
              Visit Site
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
              <AmphoraIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              Arts and Heritage
            </h1>
          </div>
        </div>
      </div>

      {/* TABS + BODY */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === tab.id
                  ? "text-yellow-600 border-b-2 border-yellow-600"
                  : "text-gray-600 hover:text-yellow-600"
              }`}
            >
              {tab.label} ({budget[tab.id].length})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cards */}
          <div className="lg:col-span-2 space-y-6">
            {budget[activeTab].map((item) => (
              <InfrastructureItemCard
                key={item.id}
                item={item}
                onUpdate={(updatedItem) => updateItem(activeTab, item.id, updatedItem)}
                onDelete={() => deleteItem(activeTab, item.id)}
              />
            ))}

            {/* Empty Message */}
            {budget[activeTab].length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No items yet. Add your first item using the form.
              </div>
            )}
          </div>

          {/* Form */}
          <div className="lg:col-span-1">
            <InfrastructureForm
              onSubmit={(item) => addItem(activeTab, item)}
              category="budget"
              subcategory={activeTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
