import React, { useState } from "react";
import {
  EditIcon,
  TrashIcon,
  SaveIcon,
  XIcon,
  FileIcon,
  DownloadIcon,
  CalendarIcon,
} from "lucide-react";
import { ResearchItem } from "../contexts/ResearchContext";
interface ResearchItemCardProps {
  item: ResearchItem;
  onUpdate: (item: ResearchItem) => void;
  onDelete: () => void;
}
export function ResearchItemCard({
  item,
  onUpdate,
  onDelete,
}: ResearchItemCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);
  const handleSave = () => {
    onUpdate(editedItem);
    setIsEditing(false);
  };
  const handleCancel = () => {
    setEditedItem(item);
    setIsEditing(false);
  };
  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="space-y-4">
          <input
            type="text"
            value={editedItem.title}
            onChange={(e) =>
              setEditedItem({
                ...editedItem,
                title: e.target.value,
              })
            }
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            placeholder="Title"
          />
          <textarea
            value={editedItem.description}
            onChange={(e) =>
              setEditedItem({
                ...editedItem,
                description: e.target.value,
              })
            }
            rows={4}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
            placeholder="Description"
          />
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              value={editedItem.value || ""}
              onChange={(e) =>
                setEditedItem({
                  ...editedItem,
                  value: e.target.value,
                })
              }
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Value"
            />
            <input
              type="text"
              value={editedItem.unit || ""}
              onChange={(e) =>
                setEditedItem({
                  ...editedItem,
                  unit: e.target.value,
                })
              }
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Unit"
            />
            <input
              type="text"
              value={editedItem.year || ""}
              onChange={(e) =>
                setEditedItem({
                  ...editedItem,
                  year: e.target.value,
                })
              }
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Year"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              <SaveIcon className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <XIcon className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex-1">{item.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            <EditIcon className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-700 transition-colors"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <p className="text-gray-600 mb-4">{item.description}</p>
      {item.images && item.images.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {item.images.map((image, idx) => (
            <img
              key={idx}
              src={image}
              alt={`${item.title} ${idx + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
          ))}
        </div>
      )}
	  
      {item.files && item.files.length > 0 && (
        <div className="space-y-2 mb-4">
          {item.files.map((filePath, idx) => {
            const fileName = filePath.split("/").pop(); // extract filename from path
            return (
              <div
                key={idx}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <FileIcon className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {fileName}
                    </p>
                  </div>
                </div>
                <a
                  href={filePath}
                  download
                  className="text-blue-600 hover:text-blue-700"
                >
                  <DownloadIcon className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {item.value && item.unit && (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {item.value} {item.unit}
          </span>
        )}
        {item.year && (
          <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            {item.year}
          </span>
        )}
        {item.status && (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              item.status === "active"
                ? "bg-green-100 text-green-700"
                : item.status === "completed"
                ? "bg-gray-200 text-gray-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </span>
        )}
      </div>
    </div>
  );
}
