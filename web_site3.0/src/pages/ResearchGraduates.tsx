import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  EyeIcon,
  EditIcon,
  XIcon,
  SaveIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { ResearchForm } from "../components/ResearchForm";

export function ResearchGraduates() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"greenJobs" | "careers">(
    "greenJobs"
  );

  const [items, setItems] = useState({
    greenJobs: [],
    careers: [],
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [selectedSDGs, setSelectedSDGs] = useState<number[]>([]);

  const API_BASE = "http://180.235.121.250:8006/api/research_graduates";

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
    fetchTab("greenJobs");
    fetchTab("careers");
  }, []);

  const addItem = async (type: string, data: any) => {
    const f = new FormData();
    f.append("title", data.title);
    f.append("description", data.description || "");
    f.append("year", data.year || "");
    f.append("link", data.link || "");
    f.append("sdgGoals", JSON.stringify(data.sdgGoals || []));

    data.images?.forEach((img: File) => f.append("images", img));
    data.files?.forEach((file: File) => f.append("files", file));

    await fetch(`${API_BASE}/${type}`, { method: "POST", body: f });
    fetchTab(type);
  };

  const saveEdit = async () => {
    const f = new FormData();
    f.append("title", editForm.title);
    f.append("description", editForm.description || "");
    f.append("year", editForm.year || "");
    f.append("link", editForm.link || "");
    f.append("sdgGoals", JSON.stringify(selectedSDGs || []));

    f.append("oldImages", JSON.stringify(editForm.images || []));
    f.append("oldFiles", JSON.stringify(editForm.files || []));

    editForm.newImages?.forEach((img: File) => f.append("images", img));
    editForm.newFiles?.forEach((file: File) => f.append("files", file));

    await fetch(`${API_BASE}/${editForm.id}`, { method: "PUT", body: f });

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
    setSelectedSDGs((p) =>
      p.includes(n) ? p.filter((x) => x !== n) : [...p, n]
    );
  };

  const tabs = [
    {
      id: "greenJobs",
      label: "Green Job Placements",
      count: items.greenJobs.length,
    },
    {
      id: "careers",
      label: "Career Outcomes",
      count: items.careers.length,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between">
          <button
            onClick={() => navigate("/research")}
            className="text-white flex gap-2"
          >
            <ArrowLeftIcon /> Back to Research Data
          </button>

          <button
            onClick={() => navigate("/research/site")}
            className="bg-white text-emerald-600 px-6 py-3 rounded-lg flex gap-2 shadow"
          >
            <EyeIcon /> Visit Site
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 pb-6">
          <div className="bg-white/20 p-4 rounded-full">
            <BriefcaseIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">Graduate Outcomes</h1>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* TABS */}
        <div className="flex gap-4 mb-8 border-b">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-6 py-3 font-semibold ${
                activeTab === t.id
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-gray-600"
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE LIST */}
          <div className="lg:col-span-2 space-y-6">
            {items[activeTab].map((item: any) => (
              <div key={item.id} className="bg-white p-6 rounded-xl shadow">
                {editingId === item.id ? (
                  <>
                    {/* TITLE */}
                    <input
                      className="w-full border p-2 rounded mb-2"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                    />

                    {/* DESCRIPTION */}
                    <textarea
                      className="w-full border p-2 rounded mb-2"
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
                      className="w-full border p-2 rounded mb-2"
                      value={editForm.year}
                      onChange={(e) =>
                        setEditForm({ ...editForm, year: e.target.value })
                      }
                      placeholder="Year"
                    />

                    {/* LINK */}
                    <input
                      className="w-full border p-2 rounded mb-2"
                      value={editForm.link || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, link: e.target.value })
                      }
                      placeholder="Public Link"
                    />

                    {/* SDGs */}
                    <label className="font-medium mb-2 block">
                      Related SDG Goals
                    </label>

                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto mb-3">
                      {Object.entries(sdgIcons).map(([k, icon]) => (
                        <button
                          key={k}
                          onClick={() => toggleSDG(Number(k))}
                          className={`p-2 rounded text-center ${
                            selectedSDGs.includes(Number(k))
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          <div className="text-xl">{icon}</div>
                          <small>SDG {k}</small>
                        </button>
                      ))}
                    </div>

                    {/* EXISTING IMAGES */}
                    {editForm.images?.length > 0 &&
                      editForm.newImages?.length === 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {editForm.images.map((img: string, idx: number) => (
                            <div
                              key={idx}
                              className="relative w-20 h-20 border rounded"
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

                    {/* NEW IMAGES */}
                    <input
                      type="file"
                      multiple
                      className="mb-3"
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          images: [],
                          newImages: [...Array.from(e.target.files || [])],
                        })
                      }
                    />

                    {/* FILES EXISTING */}
                    {editForm.files?.length > 0 &&
                      editForm.newFiles?.length === 0 && (
                        <ul className="mb-3 space-y-1">
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

                    {/* NEW FILES */}
                    <input
                      type="file"
                      multiple
                      className="mb-3"
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          files: [],
                          newFiles: [...Array.from(e.target.files || [])],
                        })
                      }
                    />

                    <div className="flex gap-2 mt-2">
                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded flex gap-2"
                        onClick={saveEdit}
                      >
                        <SaveIcon /> Save
                      </button>

                      <button
                        className="bg-gray-500 text-white px-4 py-2 rounded flex gap-2"
                        onClick={() => {
                          setEditingId(null);
                          setEditForm(null);
                          setSelectedSDGs([]);
                        }}
                      >
                        <XIcon /> Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between mb-1">
                      <h3 className="text-lg font-bold">{item.title}</h3>

                      <div className="flex gap-2">
                        <button
                          className="text-blue-600"
                          onClick={() => {
                            setEditingId(item.id);
                            setEditForm({
                              ...item,
                              newImages: [],
                              newFiles: [],
                            });
                            setSelectedSDGs(item.sdgGoals || []);
                          }}
                        >
                          <EditIcon />
                        </button>

                        <button
                          className="text-red-600"
                          onClick={() => deleteItem(activeTab, item.id)}
                        >
                          <XIcon />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-700">{item.description}</p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.sdgGoals?.map((sdg: number) => (
                        <span
                          key={sdg}
                          className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                        >
                          {sdgIcons[sdg]} SDG {sdg}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-3">
                      {item.year && (
                        <span className="inline-block bg-gray-200 px-3 py-1 rounded text-sm">
                          {item.year}
                        </span>
                      )}

                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center bg-emerald-600 text-white px-3 py-1 rounded text-sm"
                        >
                          <ExternalLinkIcon className="w-4 h-4 mr-1" /> View
                        </a>
                      )}
                    </div>

                    {/* IMAGES PREVIEW */}
                    {item.images?.length > 0 && (
                      <div className="flex gap-2 flex-wrap mt-4">
                        {item.images.map((img: string) => (
                          <img
                            key={img}
                            src={img}
                            className="w-20 h-20 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}

                    {/* FILES PREVIEW */}
                    {item.files?.length > 0 && (
                      <div className="mt-3">
                        {item.files.map((file: any, idx: number) => (
                          <a
                            key={idx}
                            href={file.url}
                            target="_blank"
                            className="block text-blue-600 underline"
                          >
                            {file.name}
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
              category="graduates"
              subcategory={activeTab}
              showSDGGoals={true}
              selectedSDGs={selectedSDGs}
              setSelectedSDGs={setSelectedSDGs}
              showFilesAndImages={true}
              onSubmit={(d) => (editingId ? saveEdit() : addItem(activeTab, d))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
