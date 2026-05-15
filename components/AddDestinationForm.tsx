"use client";

import { FormEvent, useState } from "react";

interface AddDestinationFormProps {
  onSuccess: () => void;
}

export default function AddDestinationForm({
  onSuccess,
}: AddDestinationFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; description?: string }>(
    {}
  );

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

    setIsLoading(true);
    setErrors({});

    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        ...(imageUrl ? { imageUrl } : {}),
      };

      const response = await fetch("/api/destinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error) {
          setErrors({ name: data.error });
        } else {
          throw new Error("Failed to add destination");
        }
        return;
      }

      setName("");
      setDescription("");
      setImageUrl("");
      onSuccess();
    } catch (err) {
      setErrors({
        name: err instanceof Error ? err.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
          Destination Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Paris, Tokyo, Bali"
          disabled={isLoading}
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
          placeholder="What would you like to do there? What's special about this place?"
          disabled={isLoading}
          rows={4}
          className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-secondary)] disabled:bg-[var(--color-background)] disabled:cursor-not-allowed bg-[var(--color-surface)] text-[var(--color-text)] resize-none"
        />
        {errors.description && (
          <p className="mt-2 text-sm text-[var(--color-danger)]">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
          Image URL (Optional)
        </label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          disabled={isLoading}
          className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-secondary)] disabled:bg-[var(--color-background)] disabled:cursor-not-allowed bg-[var(--color-surface)] text-[var(--color-text)]"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-3 bg-[var(--color-primary)] text-[var(--color-surface)] rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all text-center"
      >
        {isLoading ? "Adding..." : "Add Destination"}
      </button>
    </form>
  );
}
