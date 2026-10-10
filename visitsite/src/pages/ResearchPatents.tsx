// FINAL UPDATED PATENTS COMPONENT (remove-existing feature included)

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  LightbulbIcon,
  EyeIcon,
  XIcon,
  EditIcon,
  ExternalLinkIcon,
  SaveIcon,
} from "lucide-react";
import { ResearchForm } from "../components/ResearchForm";

export function ResearchPatents() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"patents" | "innovations">(
    "patents"
  );

  const [items, setItems] = useState<{ patents: any[]; innovations: any[] }>({
    patents: [],
    innovations: [],
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [selectedSDGs, setSelectedSDGs] = useState<number[]>([]);

  const API_BASE = "http://180.235.121.250:8006/api/research_patents";

  const sdgIcons: Record<number, string> = {
    1: "🏠",
    2: "🌾",
    3: "❤️",
    4: "📚",
    5: "⚖️",
    6: "💧",
    7: "⚡",
    8: "💼",
    9: "🏗️",
    10: "🤝",
    11: "🏙️",
    12: "♻️",
    13: "🌍",
    14: "🐠",
    15: "🌳",
    16: "⚖️",
    17: "🌐",
  };

  // Fetch data
  const fetchTab = async (type: string) => {
    try {
      const res = await fetch(`${API_BASE}/${type}`);
      const data = await res.json();

      const parsed = data.map((item: any) => ({
        ...item,
        images: Array.isArray(item.images) ? item.images : [],
        files: Array.isArray(item.files) ? item.files : [],
        sdgGoals: Array.isArray(item.sdgGoals) ? item.sdgGoals : [],
      }));

      setItems((prev) => ({ ...prev, [type]: parsed }));
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchTab("patents");
    fetchTab("innovations");
  }, []);

  // Add new
  const addItem = async (type: string, item: any) => {
    const formData = new FormData();

    formData.append("title", item.title);
    formData.append("description", item.description || "");
    formData.append("year", item.year || "");
    formData.append("link", item.link || "");
    formData.append("sdgGoals", JSON.stringify(item.sdgGoals || []));

    item.images?.forEach((img: File) => formData.append("images", img));
    item.files?.forEach((file: File) => formData.append("files", file));

    await fetch(`${API_BASE}/${type}`, { method: "POST", body: formData });
    fetchTab(type);
  };

  // Save edit
  const saveEdit = async () => {
    if (!editForm) return;

    const formData = new FormData();

    formData.append("title", editForm.title);
    formData.append("description", editForm.description || "");
    formData.append("year", editForm.year || "");
    formData.append("link", editForm.link || "");
    formData.append("sdgGoals", JSON.stringify(selectedSDGs || []));

    // new uploads
    editForm.newImages?.forEach((img: File) => formData.append("images", img));
    editForm.newFiles?.forEach((file: File) => formData.append("files", file));

    // existing
    formData.append("oldImages", JSON.stringify(editForm.images || []));
    formData.append("oldFiles", JSON.stringify(editForm.files || []));

    await fetch(`${API_BASE}/${editForm.id}`, {
      method: "PUT",
      body: formData,
    });

    fetchTab(activeTab);
    setEditingId(null);
    setEditForm(null);
    setSelectedSDGs([]);
  };

  // Delete
  const deleteItem = async (type: string, id: number) => {
    await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    fetchTab(type);
  };

  const toggleSDG = (goalNumber: number) => {
    setSelectedSDGs((prev) =>
      prev.includes(goalNumber)
        ? prev.filter((n) => n !== goalNumber)
        : [...prev, goalNumber]
    );
  };

  const tabs = [
    { id: "patents", label: "Patents", count: items.patents.length },
    { id: "innovations", label: "Innovations", count: items.innovations.length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate("/research")}
              className="flex items-center gap-2 text-white hover:text-yellow-100"
            >
              <ArrowLeftIcon className="w-5 h-5" /> Back to Research Data
            </button>

            <button
              onClick={() => navigate("/research/site")}
              className="flex items-center gap-2 bg-white text-yellow-600 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-50 shadow-lg"
            >
              <EyeIcon className="w-5 h-5" /> Visit Site
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="bg-white/20 p-4 rounded-full">
              <LightbulbIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              Patents & Innovations
            </h1>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-semibold ${
                activeTab === tab.id
                  ? "text-yellow-600 border-b-2 border-yellow-600"
                  : "text-gray-600 hover:text-yellow-600"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LIST */}
          <div className="lg:col-span-2 space-y-6">
            {items[activeTab].map((item: any) => (
              <div key={item.id} className="bg-white p-6 shadow rounded-xl">
                {editingId === item.id ? (
                  <>
                    {/* EDIT MODE */}

                    <input
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      className="w-full p-2 border rounded mb-3"
                    />

                    <textarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({ ...editForm, description: e.target.value })
                      }
                      className="w-full p-2 border rounded mb-3"
                    />

                    <input
                      value={editForm.year || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, year: e.target.value })
                      }
                      className="w-full p-2 border rounded mb-3"
                    />

                    <input
                      value={editForm.link || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, link: e.target.value })
                      }
                      className="w-full p-2 border rounded mb-3"
                    />

                    {/* SDGs */}
                    <div className="mt-3">
                      <label className="font-medium">SDG Goals</label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {Object.entries(sdgIcons).map(([num, icon]) => (
                          <button
                            key={num}
                            onClick={() => toggleSDG(Number(num))}
                            className={`p-2 rounded text-center ${
                              selectedSDGs.includes(Number(num))
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100"
                            }`}
                          >
                            <div className="text-2xl">{icon}</div>
                            <div className="text-xs">{num}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* IMAGES */}
                    <div className="mt-4">
                      <label className="font-medium">Images</label>

                      {/* Show existing only if no newImages selected */}
                      {editForm.images?.length > 0 &&
                        editForm.newImages?.length === 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {editForm.images.map((img: string, idx: number) => (
                              <div
                                key={idx}
                                className="relative w-24 h-24 border rounded"
                              >
                                <img
                                  src={img}
                                  className="w-full h-full object-cover rounded"
                                />
                                <button
                                  onClick={() =>
                                    setEditForm({
                                      ...editForm,
                                      images: editForm.images.filter(
                                        (_: any, i: number) => i !== idx
                                      ),
                                    })
                                  }
                                  className="absolute top-1 right-1 bg-red-600 text-white text-xs w-6 h-6 rounded-full"
                                >
                                  X
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                      {/* NEW images remove old */}
                      <input
                        type="file"
                        multiple
                        className="mt-2"
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            images: [], // remove existing immediately
                            newImages: [...Array.from(e.target.files || [])],
                          })
                        }
                      />
                    </div>

                    {/* FILES */}
                    <div className="mt-4">
                      <label className="font-medium">Files</label>

                      {editForm.files?.length > 0 &&
                        editForm.newFiles?.length === 0 && (
                          <ul className="mt-2 space-y-1">
                            {editForm.files.map((file: any, idx: number) => (
                              <li
                                key={idx}
                                className="flex justify-between bg-gray-100 p-2 rounded"
                              >
                                <a
                                  href={file.url}
                                  target="_blank"
                                  className="text-blue-600 underline"
                                >
                                  {file.name}
                                </a>
                                <button
                                  onClick={() =>
                                    setEditForm({
                                      ...editForm,
                                      files: editForm.files.filter(
                                        (_: any, i: number) => i !== idx
                                      ),
                                    })
                                  }
                                  className="text-red-600"
                                >
                                  Remove
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}

                      {/* NEW files remove old */}
                      <input
                        type="file"
                        multiple
                        className="mt-2"
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            files: [], // remove old
                            newFiles: [...Array.from(e.target.files || [])],
                          })
                        }
                      />
                    </div>

                    {/* BUTTONS */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={saveEdit}
                        className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
                      >
                        <SaveIcon className="w-4 h-4" /> Save
                      </button>

                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditForm(null);
                          setSelectedSDGs([]);
                        }}
                        className="bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2"
                      >
                        <XIcon className="w-4 h-4" /> Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* VIEW MODE */}

                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold">{item.title}</h3>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(item.id);
                            setEditForm({
                              ...item,
                              newImages: [],
                              newFiles: [],
                            });
                            setSelectedSDGs(item.sdgGoals || []);
                          }}
                          className="text-blue-600"
                        >
                          <EditIcon className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => deleteItem(activeTab, item.id)}
                          className="text-red-600"
                        >
                          <XIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-700">{item.description}</p>

                    {/* SDGs */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.sdgGoals?.map((sdg: number) => (
                        <span
                          key={sdg}
                          className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs flex items-center gap-1"
                        >
                          {sdgIcons[sdg]} SDG {sdg}
                        </span>
                      ))}
                    </div>

                    {/* YEAR + LINK */}
                    <div className="mt-2 flex gap-2">
                      {item.year && (
                        <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
                          {item.year}
                        </span>
                      )}

                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          className="px-3 py-1 bg-yellow-600 text-white rounded flex items-center gap-1"
                        >
                          <ExternalLinkIcon className="w-4 h-4" /> View
                        </a>
                      )}
                    </div>

                    {/* IMAGES */}
                    {item.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {item.images.map((img: string) => (
                          <img
                            key={img}
                            src={img}
                            className="w-24 h-24 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}

                    {/* FILES */}
                    {item.files.length > 0 && (
                      <div className="mt-3">
                        {item.files.map((fileObj: any) => (
                          <a
                            key={fileObj.url}
                            href={fileObj.url}
                            target="_blank"
                            className="text-blue-600 underline block"
                          >
                            {fileObj.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* FORM PANEL */}
          <div className="lg:col-span-1">
            <ResearchForm
              category="research_patents"
              subcategory={activeTab}
              showSDGGoals={true}
              onSubmit={(item) => addItem(activeTab, item)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
