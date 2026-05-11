"use client";

import { Trash2, Edit2, MapPin } from "lucide-react";

interface Destination {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  visited: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DestinationCardProps {
  destination: Destination;
  onVisitedToggle: (id: string, visited: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function DestinationCard({
  destination,
  onVisitedToggle,
  onDelete,
  onEdit,
}: DestinationCardProps) {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to remove ${destination.name}?`)) {
      onDelete(destination.id);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all ${
        destination.visited ? "opacity-75" : ""
      }`}
    >
      {destination.imageUrl ? (
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          <img
            src={destination.imageUrl}
            alt={destination.name}
            className={`w-full h-full object-cover ${
              destination.visited ? "grayscale" : ""
            }`}
          />
          {destination.visited && (
            <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Visited ✓
              </span>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`h-48 bg-gradient-to-br from-blue-200 to-indigo-200 flex items-center justify-center ${
            destination.visited ? "opacity-50" : ""
          }`}
        >
          <MapPin size={48} className="text-blue-400" />
        </div>
      )}

      <div className="p-4">
        <h3
          className={`text-lg font-semibold text-gray-900 mb-1 ${
            destination.visited ? "line-through text-gray-500" : ""
          }`}
        >
          {destination.name}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {destination.description}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={destination.visited}
            onChange={(e) => onVisitedToggle(destination.id, e.target.checked)}
            className="w-5 h-5 text-green-500 rounded focus:ring-2 focus:ring-green-500 cursor-pointer"
          />
          <label className="text-sm text-gray-700 cursor-pointer">
            Mark as visited
          </label>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(destination.id)}
            className="flex-1 px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Edit2 size={16} />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
