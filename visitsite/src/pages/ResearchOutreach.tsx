import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  UsersIcon,
  EyeIcon,
  EditIcon,
  XIcon,
  SaveIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { ResearchForm } from "../components/ResearchForm";

export function ResearchOutreach() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"community" | "service">(
    "community"
  );

  const [items, setItems] = useState({ community: [], service: [] });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [selectedSDGs, setSelectedSDGs] = useState<number[]>([]);

  const API_BASE = "http://180.235.121.250:8006/api/research_outreach";

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
    const r = await fetch(`${API_BASE}/${type}`);
    const d = await r.json();

    const parsed = d.map((x: any) => ({
      ...x,
      images: Array.isArray(x.images) ? x.images : [],
      files: Array.isArray(x.files) ? x.files : [],
      sdgGoals: Array.isArray(x.sdgGoals) ? x.sdgGoals : [],
    }));

    setItems((p) => ({ ...p, [type]: parsed }));
  };

  useEffect(() => {
    fetchTab("community");
    fetchTab("service");
  }, []);

  const addItem = async (type: string, data: any) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description || "");
    formData.append("year", data.year || "");
    formData.append("link", data.link || "");
    formData.append("sdgGoals", JSON.stringify(data.sdgGoals || []));

    data.images?.forEach((img: File) => formData.append("images", img));
    data.files?.forEach((file: File) => formData.append("files", file));

    await fetch(`${API_BASE}/${type}`, { method: "POST", body: formData });
    fetchTab(type);
  };

  const saveEdit = async () => {
    const formData = new FormData();

    formData.append("title", editForm.title);
    formData.append("description", editForm.description);
    formData.append("year", editForm.year);
    formData.append("link", editForm.link || "");
    formData.append("sdgGoals", JSON.stringify(selectedSDGs));

    formData.append("oldImages", JSON.stringify(editForm.images || []));
    formData.append("oldFiles", JSON.stringify(editForm.files || []));

    editForm.newImages?.forEach((img: File) => formData.append("images", img));
    editForm.newFiles?.forEach((file: File) => formData.append("files", file));

    await fetch(`${API_BASE}/${editingId}`, {
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

  const toggleSDG = (n: number) => {
    setSelectedSDGs((prev) =>
      prev.includes(n) ? prev.filter((g) => g !== n) : [...prev, n]
    );
  };

  const tabs = [
    {
      id: "community",
      label: "Community Programs",
      count: items.community.length,
    },
    {
      id: "service",
      label: "Service Initiatives",
      count: items.service.length,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 p-6 shadow">
        <div className="max-w-7xl mx-auto flex justify-between">
          <button
            onClick={() => navigate("/research")}
            className="text-white flex items-center gap-2"
          >
            <ArrowLeftIcon className="w-5 h-5" /> Back
          </button>

          <button
            onClick={() => navigate("/research/site")}
            className="bg-white text-teal-600 px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <EyeIcon className="w-5 h-5" /> Visit Site
          </button>
        </div>

        <div className="flex justify-center gap-3 mt-5">
          <div className="bg-white/20 p-4 rounded-full">
            <UsersIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Community Outreach</h1>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto p-6">
        {/* TABS */}
        <div className="flex gap-4 mb-6 border-b">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-6 py-3 font-semibold ${
                activeTab === t.id
                  ? "text-teal-600 border-b-2 border-teal-600"
                  : "text-gray-600"
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT LIST */}
          <div className="lg:col-span-2 space-y-6">
            {items[activeTab].map((item: any) => (
              <div key={item.id} className="bg-white p-6 rounded-xl shadow">
                {editingId === item.id ? (
                  <div className="space-y-4">
                    {/* TITLE */}
                    <input
                      className="w-full border p-2"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                    />

                    {/* DESCRIPTION */}
                    <textarea
                      className="w-full border p-2"
                      rows={3}
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                    />

                    {/* YEAR */}
                    <input
                      className="w-full border p-2"
                      value={editForm.year}
                      onChange={(e) =>
                        setEditForm({ ...editForm, year: e.target.value })
                      }
                    />

                    {/* LINK */}
                    <input
                      className="w-full border p-2"
                      value={editForm.link || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, link: e.target.value })
                      }
                      placeholder="Public Link"
                    />

                    {/* SDGs */}
                    <label className="font-semibold block">SDG Goals</label>
                    <div className="grid grid-cols-3 gap-2 border p-2 rounded max-h-48 overflow-y-auto">
                      {Object.entries(sdgIcons).map(([num, icon]) => (
                        <button
                          key={num}
                          onClick={() => toggleSDG(Number(num))}
                          className={`p-2 rounded ${
                            selectedSDGs.includes(Number(num))
                              ? "bg-teal-600 text-white"
                              : "bg-gray-100"
                          }`}
                        >
                          <div className="text-xl">{icon}</div>
                          <div className="text-xs font-semibold">SDG {num}</div>
                        </button>
                      ))}
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
                                  className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 text-xs rounded-full"
                                >
                                  X
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                      {/* Upload new images */}
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
                    {/* VIEW MODE */}
                    <div className="flex justify-between">
                      <h3 className="font-bold text-lg">{item.title}</h3>

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
                          className="text-teal-600"
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

                    <p className="mt-1 text-gray-700">{item.description}</p>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.sdgGoals?.map((g: number) => (
                        <span
                          key={g}
                          className="bg-teal-100 text-teal-700 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                        >
                          {sdgIcons[g]} SDG {g}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-3">
                      {item.year && (
                        <span className="bg-gray-200 px-3 py-1 rounded">
                          {item.year}
                        </span>
                      )}

                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          className="bg-teal-600 text-white px-3 py-1 rounded flex items-center gap-1"
                        >
                          <ExternalLinkIcon className="w-4 h-4" /> View
                        </a>
                      )}
                    </div>

                    {/* IMAGES */}
                    {item.images?.length > 0 && (
                      <div className="flex gap-2 flex-wrap mt-3">
                        {item.images.map((img: string) => (
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
                      <div className="mt-3">
                        {item.files.map((f: any, idx: number) => (
                          <a
                            key={idx}
                            href={f.url}
                            target="_blank"
                            className="text-blue-600 underline block"
                          >
                            {f.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* RIGHT — Form */}
          <div>
            <ResearchForm
              category="outreach"
              subcategory={activeTab}
              showSDGGoals={true}
              selectedSDGs={selectedSDGs}
              setSelectedSDGs={setSelectedSDGs}
              showFilesAndImages={true}
              onSubmit={(d) =>
                editingId ? saveEdit() : addItem(activeTab, d)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
