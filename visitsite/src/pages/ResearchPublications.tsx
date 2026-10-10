// FINAL UPDATED COMPONENT (Remove-existing feature enabled)
// ----------------------------------------------------------

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  BookOpenIcon,
  EyeIcon,
  XIcon,
  ExternalLinkIcon,
  EditIcon,
  SaveIcon,
} from "lucide-react";
import { ResearchForm } from "../components/ResearchForm";

export function ResearchPublications() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    "journals" | "conferences" | "books"
  >("journals");

  const [publications, setPublications] = useState({
    journals: [] as any[],
    conferences: [] as any[],
    books: [] as any[],
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [selectedSDGs, setSelectedSDGs] = useState<number[]>([]);

  const API_BASE = "http://180.235.121.250:8006/api/publications";

  const sdgGoals = [
    { number: 1, icon: "🏠" },
    { number: 2, icon: "🌾" },
    { number: 3, icon: "❤️" },
    { number: 4, icon: "📚" },
    { number: 5, icon: "⚖️" },
    { number: 6, icon: "💧" },
    { number: 7, icon: "⚡" },
    { number: 8, icon: "💼" },
    { number: 9, icon: "🏗️" },
    { number: 10, icon: "🤝" },
    { number: 11, icon: "🏙️" },
    { number: 12, icon: "♻️" },
    { number: 13, icon: "🌍" },
    { number: 14, icon: "🐠" },
    { number: 15, icon: "🌳" },
    { number: 16, icon: "⚖️" },
    { number: 17, icon: "🌐" },
  ];

  // Fetch publications by type
  const fetchTab = async (type: string) => {
    const res = await fetch(`${API_BASE}/${type}`);
    const data = await res.json();

    const parsed = data.map((item: any) => ({
      ...item,
      images: Array.isArray(item.images) ? item.images : [],
      files: Array.isArray(item.files) ? item.files : [],
      sdgGoals: Array.isArray(item.sdgGoals)
        ? item.sdgGoals.map((g: any) => Number(g))
        : [],
    }));

    setPublications((prev) => ({ ...prev, [type]: parsed }));
  };

  useEffect(() => {
    fetchTab("journals");
    fetchTab("conferences");
    fetchTab("books");
  }, []);

  // Add new item
  const addItem = async (type: string, item: any) => {
    const formData = new FormData();

    formData.append("title", item.title);
    formData.append("description", item.description || "");
    formData.append("year", item.year || "");
    formData.append("status", item.status || "active");
    formData.append("link", item.link || "");
    formData.append("sdgGoals", JSON.stringify(item.sdgGoals || []));

    item.images?.forEach((img: File) => formData.append("images", img));
    item.files?.forEach((file: File) => formData.append("files", file));

    await fetch(`${API_BASE}/${type}`, { method: "POST", body: formData });
    fetchTab(type);
  };

  // Delete item
  const deleteItem = async (type: string, id: number) => {
    await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    fetchTab(type);
  };

  // Save edit
  const saveEdit = async () => {
    if (!editForm) return;

    const formData = new FormData();
    formData.append("title", editForm.title);
    formData.append("description", editForm.description || "");
    formData.append("year", editForm.year || "");
    formData.append("status", editForm.status || "active");
    formData.append("link", editForm.link || "");
    formData.append("sdgGoals", JSON.stringify(selectedSDGs));

    formData.append("oldImages", JSON.stringify(editForm.images));
    formData.append("oldFiles", JSON.stringify(editForm.files));

    editForm.newImages?.forEach((f: File) => formData.append("images", f));
    editForm.newFiles?.forEach((f: File) => formData.append("files", f));

    await fetch(`${API_BASE}/${editForm.id}`, {
      method: "PUT",
      body: formData,
    });

    fetchTab(activeTab);
    setEditingId(null);
    setEditForm(null);
  };

  const toggleSDG = (num: number) => {
    setSelectedSDGs((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  const tabs = [
    { id: "journals", label: "Journal Publications", count: publications.journals.length },
    { id: "conferences", label: "Conference Papers", count: publications.conferences.length },
    { id: "books", label: "Books & Chapters", count: publications.books.length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/research")}
              className="flex items-center gap-2 text-white hover:text-blue-100"
            >
              <ArrowLeftIcon className="w-5 h-5" /> Back to Research Data
            </button>

            <button
              onClick={() => navigate("/research/site")}
              className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50"
            >
              <EyeIcon className="w-5 h-5" /> Visit Site
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="bg-white/20 p-4 rounded-full">
              <BookOpenIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              Publications & Scholarly Output
            </h1>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-6 py-3 font-semibold ${
                activeTab === t.id ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            {publications[activeTab].map((item) => (
              <div key={item.id} className="bg-white p-6 shadow rounded-xl">
                {editingId === item.id ? (
                  <>
                    {/* EDIT MODE */}

                    <input
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
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
                      value={editForm.year}
                      onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                      className="w-full p-2 border rounded mb-3"
                    />

                    <input
                      value={editForm.link}
                      onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                      className="w-full p-2 border rounded mb-3"
                    />

                    {/* SDG GOALS */}
                    <div className="mt-3">
                      <label className="text-sm font-semibold">SDG Goals</label>

                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {sdgGoals.map((g) => (
                          <button
                            key={g.number}
                            onClick={() => toggleSDG(g.number)}
                            type="button"
                            className={`p-2 rounded text-center ${
                              selectedSDGs.includes(g.number)
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100"
                            }`}
                          >
                            <div className="text-2xl">{g.icon}</div>
                            <div>{g.number}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* IMAGES */}
                    <div className="mt-4">
                      <label className="font-semibold text-sm">Images</label>

                      {/* DO NOT SHOW OLD IMAGES IF NEW IMAGES ARE SELECTED */}
                      {editForm.images.length > 0 && editForm.newImages?.length === 0 && (
                        <div className="flex flex-wrap gap-3 mt-2">
                          {editForm.images.map((img: string, idx: number) => (
                            <div key={idx} className="relative w-24 h-24">
                              <img src={img} className="w-full h-full object-cover rounded" />
                              <button
                                onClick={() =>
                                  setEditForm({
                                    ...editForm,
                                    images: editForm.images.filter((_: any, i: number) => i !== idx),
                                  })
                                }
                                className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full text-xs"
                              >
                                X
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* NEW IMAGES REMOVE OLD IMAGES */}
                      <input
                        type="file"
                        multiple
                        className="mt-2"
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            images: [], // REMOVE OLD IMAGES
                            newImages: [...Array.from(e.target.files || [])],
                          })
                        }
                      />
                    </div>

                    {/* FILES */}
                    <div className="mt-4">
                      <label className="font-semibold text-sm">Files</label>

                      {/* SHOW OLD FILES ONLY IF NO NEW FILES */}
                      {editForm.files.length > 0 && editForm.newFiles?.length === 0 && (
                        <ul className="mt-2 space-y-2">
                          {editForm.files.map((file: any, idx: number) => (
                            <li key={idx} className="bg-gray-100 p-2 rounded flex justify-between">
                              <a href={file.url} target="_blank" className="text-blue-600 underline">
                                {file.name}
                              </a>
                              <button
                                onClick={() =>
                                  setEditForm({
                                    ...editForm,
                                    files: editForm.files.filter((_: any, i: number) => i !== idx),
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

                      {/* NEW FILES REMOVE OLD FILES */}
                      <input
                        type="file"
                        multiple
                        className="mt-2"
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            files: [], // REMOVE OLD FILES
                            newFiles: [...Array.from(e.target.files || [])],
                          })
                        }
                      />
                    </div>

                    <div className="flex gap-2 mt-4">
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
                        }}
                        className="bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-1"
                      >
                        <XIcon className="w-4 h-4" /> Cancel
                      </button>
                    </div>
                  </>
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
                              newImages: [],
                              newFiles: [],
                            });
                            setSelectedSDGs(item.sdgGoals);
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

                    <p className="text-gray-700 mt-2">{item.description}</p>

                    {/* IMAGES */}
                    {item.images?.length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-3">
                        {item.images.map((img: string, idx: number) => (
                          <img key={idx} src={img} className="w-24 h-24 rounded object-cover" />
                        ))}
                      </div>
                    )}

                    {/* FILES */}
                    {item.files?.length > 0 && (
                      <ul className="bg-gray-100 p-3 rounded mt-3">
                        {item.files.map((f: any, idx: number) => (
                          <li key={idx}>
                            <a href={f.url} target="_blank" className="text-blue-600 underline">
                              {f.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* SDGs */}
                    {item.sdgGoals?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {item.sdgGoals.map((n: number) => {
                          const goal = sdgGoals.find((g) => g.number === n);
                          return (
                            <span
                              key={n}
                              className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full flex items-center gap-1"
                            >
                              {goal?.icon} SDG {n}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    <div className="mt-3 flex gap-3">
                      {item.year && (
                        <span className="px-3 py-1 bg-gray-200 rounded-full">{item.year}</span>
                      )}

                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          className="flex items-center px-3 py-1 bg-blue-600 rounded text-white"
                        >
                          <ExternalLinkIcon className="w-4 h-4" /> View
                        </a>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="lg:col-span-1">
            <ResearchForm
              category="publications"
              subcategory={activeTab}
              showSDGGoals={true}
              selectedSDGs={selectedSDGs}
              onToggleSDG={toggleSDG}
              onSubmit={(item) => {
                addItem(activeTab, item);
                setSelectedSDGs([]);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
