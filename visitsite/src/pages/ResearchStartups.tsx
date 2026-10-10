import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  RocketIcon,
  EyeIcon,
  XIcon,
  EditIcon,
  SaveIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { ResearchForm } from "../components/ResearchForm";

export function ResearchStartups() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"incubated" | "launched">(
    "incubated"
  );
  const [items, setItems] = useState<{ incubated: any[]; launched: any[] }>({
    incubated: [],
    launched: [],
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [selectedSDGs, setSelectedSDGs] = useState<number[]>([]);

  const API_BASE = "http://180.235.121.250:8006/api/research_startup";

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
    fetchTab("incubated");
    fetchTab("launched");
  }, []);

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

  const saveEdit = async () => {
    if (!editForm) return;

    const formData = new FormData();
    formData.append("title", editForm.title);
    formData.append("description", editForm.description || "");
    formData.append("year", editForm.year || "");
    formData.append("link", editForm.link || "");
    formData.append("sdgGoals", JSON.stringify(selectedSDGs || []));

    // New images/files
    editForm.newImages?.forEach((img: File) => formData.append("images", img));
    editForm.newFiles?.forEach((file: File) => formData.append("files", file));

    // Old persisted images/files
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

  const deleteItem = async (type: string, id: number) => {
    await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    fetchTab(type);
  };

  const toggleSDG = (goal: number) => {
    setSelectedSDGs((prev) =>
      prev.includes(goal)
        ? prev.filter((n) => n !== goal)
        : [...prev, goal]
    );
  };

  const tabs = [
    {
      id: "incubated",
      label: "Incubated Startups",
      count: items.incubated.length,
    },
    {
      id: "launched",
      label: "Launched Startups",
      count: items.launched.length,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between">
          <button
            onClick={() => navigate("/research")}
            className="text-white flex items-center gap-2"
          >
            <ArrowLeftIcon /> Back
          </button>

          <button
            onClick={() => navigate("/research/site")}
            className="bg-white text-orange-600 px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <EyeIcon /> Visit Site
          </button>
        </div>

        <div className="flex justify-center gap-4 pb-6">
          <div className="bg-white/20 p-4 rounded-full">
            <RocketIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">Sustainability Startups</h1>
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
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-600"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE LIST */}
          <div className="lg:col-span-2 space-y-6">
            {items[activeTab].map((item) => (
              <div key={item.id} className="bg-white shadow p-6 rounded-xl">
                {editingId === item.id ? (
                  <div className="space-y-4">
                    {/* TITLE */}
                    <input
                      className="w-full border p-2 rounded"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                    />

                    {/* DESCRIPTION */}
                    <textarea
                      className="w-full border p-2 rounded"
                      rows={3}
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({ ...editForm, description: e.target.value })
                      }
                    />

                    {/* YEAR */}
                    <input
                      className="w-full border p-2 rounded"
                      value={editForm.year}
                      placeholder="Year"
                      onChange={(e) =>
                        setEditForm({ ...editForm, year: e.target.value })
                      }
                    />

                    {/* LINK */}
                    <input
                      className="w-full border p-2 rounded"
                      value={editForm.link || ""}
                      placeholder="Website Link"
                      onChange={(e) =>
                        setEditForm({ ...editForm, link: e.target.value })
                      }
                    />

                    {/* SDGs */}
                    <div>
                      <label className="font-semibold mb-2 block">
                        Related SDGs
                      </label>
                      <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                        {Object.entries(sdgIcons).map(([n, icon]) => (
                          <button
                            key={n}
                            onClick={() => toggleSDG(Number(n))}
                            className={`p-2 rounded text-center ${
                              selectedSDGs.includes(Number(n))
                                ? "bg-orange-600 text-white"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            <div className="text-xl">{icon}</div>
                            <small>SDG {n}</small>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* IMAGES */}
                    <div>
                      <label className="font-medium">Images</label>

                      {/* Existing images */}
                      {editForm.images?.length > 0 &&
                        editForm.newImages?.length === 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {editForm.images.map((img: string, idx: number) => (
                              <div
                                key={idx}
                                className="relative w-20 h-20 rounded border"
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
                                  className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full text-xs"
                                >
                                  X
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                      {/* New images */}
                      <input
                        type="file"
                        multiple
                        className="mt-2"
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            images: [],
                            newImages: [...Array.from(e.target.files || [])],
                          })
                        }
                      />
                    </div>

                    {/* FILES */}
                    <div>
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
                                  className="text-blue-600 underline"
                                  target="_blank"
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

                      <input
                        type="file"
                        multiple
                        className="mt-2"
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            files: [],
                            newFiles: [...Array.from(e.target.files || [])],
                          })
                        }
                      />
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-1"
                      >
                        <SaveIcon className="w-4 h-4" /> Save
                      </button>

                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditForm(null);
                          setSelectedSDGs([]);
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded flex items-center gap-1"
                      >
                        <XIcon className="w-4 h-4" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* DISPLAY MODE */}
                    <div className="flex justify-between mb-2">
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
                          <EditIcon />
                        </button>

                        <button
                          onClick={() => deleteItem(activeTab, item.id)}
                          className="text-red-600"
                        >
                          <XIcon />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-700">{item.description}</p>

                    {/* SDGs */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.sdgGoals?.map((g) => (
                        <span
                          key={g}
                          className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs"
                        >
                          {sdgIcons[g]} SDG {g}
                        </span>
                      ))}
                    </div>

                    {/* YEAR + LINK */}
                    <div className="flex gap-2 mt-3">
                      {item.year && (
                        <span className="inline-block bg-gray-200 px-3 py-1 rounded">
                          {item.year}
                        </span>
                      )}

                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center bg-orange-600 text-white px-3 py-1 rounded ml-2"
                        >
                          <ExternalLinkIcon className="w-4 h-4 mr-1" /> Visit
                        </a>
                      )}
                    </div>

                    {/* IMAGES */}
                    {item.images?.length > 0 && (
                      <div className="flex gap-2 mt-4 flex-wrap">
                        {item.images.map((img) => (
                          <img
                            key={img}
                            src={img}
                            className="w-20 h-20 rounded object-cover"
                          />
                        ))}
                      </div>
                    )}

                    {/* FILES */}
                    {item.files?.length > 0 && (
                      <div className="mt-4">
                        {item.files.map((fileObj: any, idx) => (
                          <a
                            key={idx}
                            href={fileObj.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block text-blue-600 underline"
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

          {/* RIGHT SIDE FORM */}
          <div>
            <ResearchForm
              category="startups"
              subcategory={activeTab}
              showSDGGoals={true}
              selectedSDGs={selectedSDGs}
              setSelectedSDGs={setSelectedSDGs}
              showFilesAndImages={true}
              onSubmit={(item) =>
                editingId ? saveEdit() : addItem(activeTab, item)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
