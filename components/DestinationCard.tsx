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
      className={`bg-[var(--color-surface)] rounded-lg shadow-lg overflow-hidden transition-all border border-[var(--color-border)] flex flex-col h-full ${
        destination.visited ? "opacity-75" : ""
      }`}
    >
      {destination.imageUrl ? (
        <div className="relative h-48 bg-[var(--color-background)] overflow-hidden">
          <img
            src={destination.imageUrl}
            alt={destination.name}
            className={`w-full h-full object-cover ${
              destination.visited ? "grayscale" : ""
            }`}
          />
          {destination.visited && (
            <div className="absolute inset-0 bg-[var(--color-success)] bg-opacity-20 flex items-center justify-center">
              <span className="bg-[var(--color-success)] text-[var(--color-surface)] px-3 py-1 rounded-lg text-sm font-medium">
                Visited ✓
              </span>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`h-48 bg-[var(--color-border)] flex items-center justify-center ${
            destination.visited ? "opacity-50" : ""
          }`}
        >
          <MapPin size={48} className="text-[var(--color-secondary)]" strokeWidth={1} />
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        <h3
          className={`text-lg font-semibold text-[var(--color-primary)] mb-2 ${
            destination.visited ? "line-through text-[var(--color-muted-text)]" : ""
          }`}
        >
          {destination.name}
        </h3>

        <p className="text-[var(--color-muted-text)] text-sm mb-4 line-clamp-2 flex-1">
          {destination.description}
        </p>

        <div className="flex items-center gap-2 mb-4 pt-2 border-t border-[var(--color-border)]">
          <input
            type="checkbox"
            checked={destination.visited}
            onChange={(e) => onVisitedToggle(destination.id, e.target.checked)}
            className="w-4 h-4 rounded cursor-pointer accent-[var(--color-success)]"
          />
          <label className="text-sm text-[var(--color-text)] cursor-pointer font-medium">
            Mark as visited
          </label>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(destination.id)}
            className="flex-1 px-3 py-2 bg-[var(--color-border)] text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-secondary)] hover:bg-opacity-20 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Edit2 size={16} strokeWidth={1.5} />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-3 py-2 bg-[var(--color-danger)] bg-opacity-10 text-[var(--color-danger)] rounded-lg hover:bg-opacity-20 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Trash2 size={16} strokeWidth={1.5} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
