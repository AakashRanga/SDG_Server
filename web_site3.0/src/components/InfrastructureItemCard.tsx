import React, { useState } from "react";
import {
  EditIcon,
  TrashIcon,
  SaveIcon,
  XIcon,
  CalendarIcon,
  UploadIcon,
} from "lucide-react";
import { InfrastructureItem } from "../contexts/InfrastructureContext";

interface InfrastructureItemCardProps {
  item: InfrastructureItem;
  onUpdate: (item: InfrastructureItem) => void;
  onDelete: () => void;
}

export function InfrastructureItemCard({
  item,
  onUpdate,
  onDelete,
}: InfrastructureItemCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Normalize arrays
  const normalize = (val: any) => (val ? (Array.isArray(val) ? val : [val]) : []);

  const [editedItem, setEditedItem] = useState({
    ...item,
    imageLink: normalize(item.imageLink || item.images),
    videoLink: normalize(item.videoLink || item.videos),
    newImages: [] as File[], // new files to upload
  });

  const removeImage = (index: number) => {
    setEditedItem((prev) => ({
      ...prev,
      imageLink: prev.imageLink.filter((_: any, i: number) => i !== index),
    }));
  };

  const removeVideo = (index: number) => {
    setEditedItem((prev) => ({
      ...prev,
      videoLink: prev.videoLink.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleSave = async () => {
  try {
    const formData = new FormData();

    formData.append("title", editedItem.title || "");
    formData.append("description", editedItem.description || "");
    formData.append("value", editedItem.value || "");
    formData.append("unit", editedItem.unit || "");
    formData.append("year", editedItem.year || "");
    formData.append("status", editedItem.status || "");

    // Send existing images
    formData.append(
      "oldImages",
      JSON.stringify(editedItem.imageLink || [])
    );

    // New uploaded images
    editedItem.newImages.forEach((file) => {
      formData.append("images", file);
    });

    // Send videos
    formData.append(
      "videos",
      JSON.stringify(editedItem.videoLink || [])
    );

    // IMPORTANT: Must match backend base URL
    const res = await fetch(
      `http://180.235.121.250:8006/api/infrastructure/${item.id}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (!res.ok)
      throw new Error("Failed to update item. Status: " + res.status);

    const updatedItem = await res.json();
    onUpdate(updatedItem);
    setIsEditing(false);
  } catch (error) {
    console.error("Failed to save infrastructure item:", error);
    alert("Update failed. Check console for details.");
  }

};



  const handleCancel = () => {
    setEditedItem({
      ...item,
      imageLink: normalize(item.imageLink || item.images),
      videoLink: normalize(item.videoLink || item.videos),
      newImages: [],
    });
    setIsEditing(false);
  };

  const getVideoEmbedUrl = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const id = url.includes("youtu.be")
        ? url.split("youtu.be/")[1]
        : url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
        {/* Title */}
        <input
          type="text"
          value={editedItem.title}
          onChange={(e) =>
            setEditedItem({ ...editedItem, title: e.target.value })
          }
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Title"
        />

        {/* Description */}
        <textarea
          value={editedItem.description}
          onChange={(e) =>
            setEditedItem({ ...editedItem, description: e.target.value })
          }
          rows={3}
          className="w-full px-4 py-2 border rounded-lg"
        />

        {/* VALUE / UNIT / YEAR */}
        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            value={editedItem.value || ""}
            onChange={(e) =>
              setEditedItem({ ...editedItem, value: e.target.value })
            }
            className="px-4 py-2 border rounded-lg"
            placeholder="Value"
          />
          <input
            type="text"
            value={editedItem.unit || ""}
            onChange={(e) =>
              setEditedItem({ ...editedItem, unit: e.target.value })
            }
            className="px-4 py-2 border rounded-lg"
            placeholder="Unit"
          />
          <input
            type="text"
            value={editedItem.year || ""}
            onChange={(e) =>
              setEditedItem({ ...editedItem, year: e.target.value })
            }
            className="px-4 py-2 border rounded-lg"
            placeholder="Year"
          />
        </div>

        {/* STATUS DROPDOWN */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={editedItem.status}
            onChange={(e) =>
              setEditedItem({ ...editedItem, status: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="active">Active</option>
            <option value="planned">Planned</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* IMAGE UPLOAD */}
        {/* IMAGE UPLOAD */}
        <div>
          <label className="block text-sm font-medium mb-2">Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                const filesArray = Array.from(e.target.files);
                setEditedItem((prev) => ({
                  ...prev,
                  newImages: [...prev.newImages, ...filesArray],
                }));
              }
            }}
            className="mb-2"
          />

          {/* Show existing and new images as thumbnails */}
          <div className="flex flex-wrap gap-2">
            {/* Existing images */}
            {editedItem.imageLink.map((img: string, i: number) => (
              <div
                key={i}
                className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-50"
              >
                <img
                  src={img}
                  alt={`Image ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow text-red-600 hover:bg-red-100"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Newly selected images */}
            {editedItem.newImages.map((file: File, i: number) => (
              <div
                key={`new-${i}`}
                className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() =>
                    setEditedItem((prev) => ({
                      ...prev,
                      newImages: prev.newImages.filter((_: File, idx) => idx !== i),
                    }))
                  }
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow text-red-600 hover:bg-red-100"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>


        {/* VIDEO URLS */}
        <div>
          <label className="block text-sm font-medium mb-2">Videos</label>
          <button
            type="button"
            onClick={() => {
              const url = prompt("Enter video URL:");
              if (url) {
                setEditedItem((prev) => ({
                  ...prev,
                  videoLink: [...prev.videoLink, url],
                }));
              }
            }}
            className="flex items-center gap-2 text-blue-600 mb-2"
          >
            <UploadIcon className="w-4 h-4" /> Add Video URL
          </button>

          <div className="space-y-2">
            {editedItem.videoLink.map((vid: string, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
              >
                <span className="truncate flex-1">{vid}</span>
                <button onClick={() => removeVideo(i)} className="text-red-600">
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            <SaveIcon className="w-4 h-4" /> Save
          </button>

          <button
            onClick={handleCancel}
            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            <XIcon className="w-4 h-4" /> Cancel
          </button>
        </div>
      </div>
    );
  }

  /* ---------- VIEW MODE ---------- */
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between mb-4">
        <h3 className="text-xl font-bold">{item.title}</h3>
        <div className="flex gap-2">
          <button onClick={() => setIsEditing(true)} className="text-blue-600">
            <EditIcon className="w-5 h-5" />
          </button>

          <button onClick={onDelete} className="text-red-600">
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <p className="text-gray-700 mb-4">{item.description}</p>

      {/* IMAGES */}
      {normalize(item.imageLink).length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {normalize(item.imageLink).map((img: string, i: number) => (
            <img
              key={i}
              src={img}
              className="w-full h-32 object-cover rounded-lg"
            />
          ))}
        </div>
      )}

      {/* VIDEOS */}
      {normalize(item.videoLink).length > 0 && (
        <div className="space-y-3 mb-4">
          {normalize(item.videoLink).map((v: string, i: number) => (
            <div key={i} className="aspect-video rounded overflow-hidden">
              <iframe
                src={getVideoEmbedUrl(v)}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          ))}
        </div>
      )}

      {/* TAGS */}
      <div className="flex flex-wrap gap-2 mt-3">
        {item.value && item.unit && (
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            {item.value} {item.unit}
          </span>
        )}

        {item.year && (
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" /> {item.year}
          </span>
        )}

        {item.status && (
          <span
            className={`px-3 py-1 rounded-full text-sm ${item.status === "active"
                ? "bg-green-100 text-green-700"
                : item.status === "planned"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-200 text-gray-700"
              }`}
          >
            {item.status}
          </span>
        )}
      </div>
    </div>
  );
}
