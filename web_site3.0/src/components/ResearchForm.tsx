import React, { useState } from "react";
import { PlusIcon, ImageIcon, FileIcon, XIcon } from "lucide-react";
import { ResearchItem } from "../contexts/ResearchContext";

interface ResearchFormProps {
  onSubmit: (item: Omit<ResearchItem, "id">) => void;
  category: string;
  subcategory: string;
  showSDGGoals?: boolean;
}

interface FileWithLink {
  file: File;
  link: string;
}

export function ResearchForm({
  onSubmit,
  category,
  subcategory,
  showSDGGoals = false,
}: ResearchFormProps) {
  const [formData, setFormData] = useState<Omit<ResearchItem, "id">>({
    title: "",
    description: "",
    year: new Date().getFullYear().toString(),
    status: "active",
    images: [],
    files: [] as FileWithLink[],
    sdgGoals: [],
    link: "",
  });

  const [selectedSDGs, setSelectedSDGs] = useState<number[]>([]);

  const sdgGoals = [
    { number: 1, title: "No Poverty", icon: "🏠" },
    { number: 2, title: "Zero Hunger", icon: "🌾" },
    { number: 3, title: "Good Health", icon: "❤️" },
    { number: 4, title: "Quality Education", icon: "📚" },
    { number: 5, title: "Gender Equality", icon: "⚖️" },
    { number: 6, title: "Clean Water", icon: "💧" },
    { number: 7, title: "Clean Energy", icon: "⚡" },
    { number: 8, title: "Economic Growth", icon: "💼" },
    { number: 9, title: "Innovation", icon: "🏗️" },
    { number: 10, title: "Reduced Inequalities", icon: "🤝" },
    { number: 11, title: "Sustainable Cities", icon: "🏙️" },
    { number: 12, title: "Responsible Consumption", icon: "♻️" },
    { number: 13, title: "Climate Action", icon: "🌍" },
    { number: 14, title: "Life Below Water", icon: "🐠" },
    { number: 15, title: "Life on Land", icon: "🌳" },
    { number: 16, title: "Peace & Justice", icon: "⚖️" },
    { number: 17, title: "Partnerships", icon: "🌐" },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...Array.from(files)],
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles: FileWithLink[] = Array.from(files).map((f) => ({
        file: f,
        link: "",
      }));
      setFormData((prev) => ({
        ...prev,
        files: [...(prev.files || []), ...newFiles],
      }));
    }
  };

  const toggleSDG = (goalNumber: number) => {
    setSelectedSDGs((prev) =>
      prev.includes(goalNumber)
        ? prev.filter((num) => num !== goalNumber)
        : [...prev, goalNumber]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Just pass the actual File objects and images as-is
    onSubmit({
      ...formData,
      files: formData.files.map((f) => f.file), // only the File objects
      sdgGoals: showSDGGoals ? selectedSDGs : undefined,
    });

    // Reset form
    setFormData({
      title: "",
      description: "",
      year: new Date().getFullYear().toString(),
      status: "active",
      images: [],
      files: [],
      sdgGoals: [],
      link: "",
    });
    setSelectedSDGs([]);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Item</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title *"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <textarea
          placeholder="Description *"
          required
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <input
          type="text"
          placeholder="Year"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {showSDGGoals && (
          <>
            <input
              type="url"
              placeholder="Publication Link (URL)"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Related SDG Goals
              </label>
              <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                {sdgGoals.map((goal) => (
                  <button
                    key={goal.number}
                    type="button"
                    onClick={() => toggleSDG(goal.number)}
                    className={`p-2 rounded-lg text-center transition-all ${
                      selectedSDGs.includes(goal.number)
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <div className="text-2xl mb-1">{goal.icon}</div>
                    <div className="text-xs font-semibold">{goal.number}</div>
                  </button>
                ))}
              </div>

              {selectedSDGs.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedSDGs.map((goalNum) => {
                    const goal = sdgGoals.find((g) => g.number === goalNum);
                    return (
                      <span
                        key={goalNum}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium"
                      >
                        <span>{goal?.icon}</span>
                        <span>SDG {goalNum}</span>
                        <button
                          type="button"
                          onClick={() => toggleSDG(goalNum)}
                          className="hover:text-indigo-900"
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        <div>
          <label className="cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors">
            <ImageIcon className="w-6 h-6 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">Upload Images</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <label className="cursor-pointer bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-blue-100 transition-colors">
            <FileIcon className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-sm text-blue-700 font-medium">
              Upload Files
            </span>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xlsx,.xls"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* List of uploaded files with optional link input */}
          {formData.files.length > 0 && (
            <div className="mt-2 space-y-2">
              {formData.files.map((f, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-gray-100 p-2 rounded"
                >
                  <span className="flex-1 text-sm">{f.file.name}</span>

                  <button
                    type="button"
                    onClick={() => {
                      const updatedFiles = [...formData.files];
                      updatedFiles.splice(idx, 1);
                      setFormData((prev) => ({ ...prev, files: updatedFiles }));
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Add Item
        </button>
      </form>
    </div>
  );
}
