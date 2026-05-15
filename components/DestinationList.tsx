"use client";

import { useState } from "react";
import DestinationCard from "./DestinationCard";
import EditDestinationModal from "./EditDestinationModal";

interface Destination {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  visited: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DestinationListProps {
  destinations: Destination[];
  filter: string;
  isLoading: boolean;
  onVisitedToggle: (id: string, visited: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, name: string, description: string) => void;
}

export default function DestinationList({
  destinations,
  filter,
  isLoading,
  onVisitedToggle,
  onDelete,
  onEdit,
}: DestinationListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingDestination = destinations.find((d) => d.id === editingId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse rounded-full h-12 w-12 bg-[var(--color-secondary)] opacity-50"></div>
      </div>
    );
  }

  if (destinations.length === 0) {
    return (
      <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-12 text-center border border-[var(--color-border)]">
        <p className="text-[var(--color-muted-text)] text-base mb-4">
          No destinations yet! Start planning your next adventure by adding your
          first destination above.
        </p>
        <p className="text-2xl">✈️</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((destination) => (
          <DestinationCard
            key={destination.id}
            destination={destination}
            onVisitedToggle={onVisitedToggle}
            onDelete={onDelete}
            onEdit={setEditingId}
          />
        ))}
      </div>

      {editingDestination && (
        <EditDestinationModal
          destination={editingDestination}
          isOpen={editingId !== null}
          onClose={() => setEditingId(null)}
          onSave={(id, name, description) => {
            onEdit(id, name, description);
            setEditingId(null);
          }}
        />
      )}
    </>
  );
}
