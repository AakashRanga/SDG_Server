import React, { useState } from "react";
import { PlusIcon, UploadIcon, XIcon } from "lucide-react";
import { InfrastructureItem } from "../contexts/InfrastructureContext";

interface InfrastructureFormProps {
  onSubmit: (item: Omit<InfrastructureItem, "id">) => void;
  category: string;
  subcategory: string;
}

export function InfrastructureForm({
  onSubmit,
  category,
  subcategory,
}: InfrastructureFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    value: "",
    unit: "",
    year: new Date().getFullYear().toString(),
    status: "active" as "active" | "planned" | "completed",
    images: [] as File[],         // ← STORE REAL FILES
    videos: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      images: formData.images,     // files will be sent from parent using FormData
      videoLink: formData.videos,
    } as any);

    setFormData({
      title: "",
      description: "",
      value: "",
      unit: "",
      year: new Date().getFullYear().toString(),
      status: "active",
      images: [],
      videos: [],
    });
  };

  const handleVideoAdd = () => {
    const url = prompt("Enter video URL (YouTube, Vimeo, etc.):");
    if (url) {
      setFormData({
        ...formData,
        videos: [...formData.videos, url],
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const removeVideo = (index: number) => {
    setFormData({
      ...formData,
      videos: formData.videos.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Add New Item</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg resize-none"
            required
          />
        </div>

        {/* Value & Unit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
            <input
              type="text"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg"
              placeholder="e.g., acres, sq ft"
            />
          </div>
        </div>

        {/* Year & Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <input
              type="text"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg"
            >
              <option value="active">Active</option>
              <option value="planned">Planned</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>

          {/* Hidden File Input */}
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (!e.target.files) return;
              const selectedFiles = Array.from(e.target.files);
              setFormData({
                ...formData,
                images: [...formData.images, ...selectedFiles],
              });
            }}
          />

          <button
            type="button"
            onClick={() => document.getElementById("imageUpload")?.click()}
            className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg 
              hover:border-blue-500 transition-colors flex items-center justify-center gap-2 
              text-gray-600 hover:text-blue-600"
          >
            <UploadIcon className="w-5 h-5" /> Upload Images
          </button>

          {/* Image Preview */}
          {formData.images.length > 0 && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {formData.images.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="w-full h-20 object-cover rounded-lg"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 
                      opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Videos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Videos</label>

          <button
            type="button"
            onClick={handleVideoAdd}
            className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg 
               hover:border-blue-500 transition-colors flex items-center justify-center 
               gap-2 text-gray-600 hover:text-blue-600"
          >
            <UploadIcon className="w-5 h-5" /> Add Video URL
          </button>

          {formData.videos.length > 0 && (
            <div className="mt-2 space-y-2">
              {formData.videos.map((video, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                  <span className="text-sm text-gray-600 truncate">{video}</span>
                  <button
                    type="button"
                    onClick={() => removeVideo(index)}
                    className="text-red-500 hover:text-red-700"
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
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 
            rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all 
            flex items-center justify-center gap-2 shadow-lg"
        >
          <PlusIcon className="w-5 h-5" /> Add Item
        </button>
      </form>
    </div>
  );
}
