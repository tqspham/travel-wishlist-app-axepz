"use client";

import { FormEvent, useEffect, useState } from "react";
import { X } from "lucide-react";

interface Destination {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  visited: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EditDestinationModalProps {
  destination: Destination;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, name: string, description: string) => void;
}

export default function EditDestinationModal({
  destination,
  isOpen,
  onClose,
  onSave,
}: EditDestinationModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; description?: string }>(
    {}
  );

  useEffect(() => {
    if (isOpen) {
      setName(destination.name);
      setDescription(destination.description);
      setErrors({});
    }
  }, [isOpen, destination]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { name?: string; description?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Destination name is required";
    }
    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    try {
      onSave(destination.id, name.trim(), description.trim());
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[var(--color-surface)] rounded-lg shadow-2xl max-w-md w-full border border-[var(--color-border)]">
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          <h2 className="text-2xl font-semibold text-[var(--color-primary)]" style={{ fontFamily: "'Georgia', 'Garamond', serif" }}>Edit Destination</h2>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="text-[var(--color-muted-text)] hover:text-[var(--color-text)] disabled:cursor-not-allowed transition-colors"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Destination Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSaving}
              className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-secondary)] disabled:bg-[var(--color-background)] disabled:cursor-not-allowed bg-[var(--color-surface)] text-[var(--color-text)]"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-[var(--color-danger)]">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSaving}
              rows={4}
              className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-secondary)] disabled:bg-[var(--color-background)] disabled:cursor-not-allowed bg-[var(--color-surface)] text-[var(--color-text)] resize-none"
            />
            {errors.description && (
              <p className="mt-2 text-sm text-[var(--color-danger)]">{errors.description}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 px-4 py-3 bg-[var(--color-border)] text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-background)] disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-3 bg-[var(--color-primary)] text-[var(--color-surface)] rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
