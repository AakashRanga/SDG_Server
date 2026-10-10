import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  HandshakeIcon,
  EyeIcon,
  EditIcon,
  XIcon,
  SaveIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { ResearchForm } from "../components/ResearchForm";

export function ResearchCollaborations() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"industry" | "international">(
    "industry"
  );
  const [collaborations, setCollaborations] = useState({
    industry: [],
    international: [],
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [selectedSDGs, setSelectedSDGs] = useState<number[]>([]);

  const API_BASE = "http://180.235.121.250:8006/api/research_collaborations";

  // SDG icons
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

  const fetchItems = async (type: string) => {
    const res = await fetch(`${API_BASE}/${type}`);
    const data = await res.json();

    const parsed = data.map((item: any) => ({
      ...item,
      images: Array.isArray(item.images) ? item.images : [],
      files: Array.isArray(item.files) ? item.files : [],
      sdgGoals: Array.isArray(item.sdgGoals) ? item.sdgGoals : [],
    }));

    setCollaborations((prev) => ({ ...prev, [type]: parsed }));
  };

  useEffect(() => {
    fetchItems("industry");
    fetchItems("international");
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
    fetchItems(type);
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

    await fetch(`${API_BASE}/${editingId}`, { method: "PUT", body: formData });

    fetchItems(activeTab);
    setEditingId(null);
    setEditForm(null);
    setSelectedSDGs([]);
  };

  const deleteItem = async (type: string, id: number) => {
    await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    fetchItems(type);
  };

  const toggleSDG = (goal: number) =>
    setSelectedSDGs((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );

  const tabs = [
    {
      id: "industry",
      label: "Industry Partnerships",
      count: collaborations.industry.length,
    },
    {
      id: "international",
      label: "International Collaborations",
      count: collaborations.international.length,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <button
            onClick={() => navigate("/research")}
            className="flex items-center gap-2 text-white"
          >
            <ArrowLeftIcon className="w-5 h-5" /> Back
          </button>

          <button
            onClick={() => navigate("/research/site")}
            className="flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold shadow-lg"
          >
            <EyeIcon className="w-5 h-5" /> Visit Site
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 py-6">
          <div className="bg-white/20 p-4 rounded-full">
            <HandshakeIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">Research Collaborations</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* TABS */}
        <div className="flex gap-4 mb-8 border-b overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-6 py-3 font-semibold ${
                activeTab === t.id
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600"
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            {collaborations[activeTab].map((item: any) => (
              <div key={item.id} className="bg-white p-6 rounded-xl shadow">
                {editingId === item.id ? (
                  <div className="space-y-4">
                    {/* EDIT MODE */}

                    <input
                      className="w-full p-2 border rounded"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                    />

                    <textarea
                      className="w-full p-2 border rounded"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                    />

                    <input
                      className="w-full p-2 border rounded"
                      value={editForm.year}
                      onChange={(e) =>
                        setEditForm({ ...editForm, year: e.target.value })
                      }
                    />

                    <input
                      className="w-full p-2 border rounded"
                      value={editForm.link || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, link: e.target.value })
                      }
                    />

                    {/* SDGs */}
                    <label className="font-medium block">SDG Goals</label>
                    <div className="grid grid-cols-3 gap-2 border p-2 rounded max-h-64 overflow-y-auto">
                      {Object.entries(sdgIcons).map(([num, icon]) => (
                        <button
                          key={num}
                          onClick={() => toggleSDG(Number(num))}
                          className={`p-2 rounded-lg text-center ${
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

                    {/* IMAGES */}
                    <div className="mt-4">
                      <label className="font-medium">Images</label>

                      {editForm.images?.length > 0 &&
                        editForm.newImages?.length === 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {editForm.images.map((img: string, idx: number) => (
                              <div key={idx} className="relative w-24 h-24 border rounded">
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
                                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 text-xs"
                                >
                                  X
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

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

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={saveEdit}
                        className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-1"
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
                      <h3 className="text-xl font-bold">{item.title}</h3>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(item.id);
                            setEditForm({
                              ...item,
                              year: item.year || "",
                              link: item.link || "",
                              images: item.images || [],
                              files: item.files || [],
                              newImages: [],
                              newFiles: [],
                            });
                            setSelectedSDGs(item.sdgGoals || []);
                          }}
                        >
                          <EditIcon className="w-5 h-5 text-indigo-600" />
                        </button>

                        <button onClick={() => deleteItem(activeTab, item.id)}>
                          <XIcon className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-700 mt-2">{item.description}</p>

                    {/* SDGs */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.sdgGoals?.map((n: number) => (
                        <span
                          key={n}
                          className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs"
                        >
                          {sdgIcons[n]} SDG {n}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-3">
                      {item.year && (
                        <span className="bg-gray-200 px-3 py-1 text-sm rounded-full">
                          {item.year}
                        </span>
                      )}

                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 inline-flex bg-indigo-600 text-white px-3 py-1 rounded text-sm gap-1"
                        >
                          <ExternalLinkIcon className="w-4 h-4" /> View
                        </a>
                      )}
                    </div>

                    {/* IMAGES */}
                    {item.images?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {item.images.map((img: string, idx: number) => (
                          <img
                            key={idx}
                            src={img}
                            className="w-24 h-24 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}

                    {/* FILES */}
                    {item.files?.length > 0 && (
                      <div className="mt-3">
                        {item.files.map((fileObj: any, idx: number) => (
                          <a
                            key={idx}
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

          {/* RIGHT FORM */}
          <div className="lg:col-span-1">
            <ResearchForm
              category="research_collaborations"
              subcategory={activeTab}
              showSDGGoals={true}
              selectedSDGs={selectedSDGs}
              setSelectedSDGs={setSelectedSDGs}
              showFilesAndImages={true}
              onSubmit={(item) => addItem(activeTab, item)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
