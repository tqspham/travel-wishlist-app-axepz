"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WishlistStats from "@/components/WishlistStats";
import FilterTabs from "@/components/FilterTabs";
import AddDestinationForm from "@/components/AddDestinationForm";
import DestinationList from "@/components/DestinationList";
import LogoutButton from "@/components/LogoutButton";

interface Destination {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  visited: boolean;
  createdAt: string;
  updatedAt: string;
}

type FilterType = "all" | "visited" | "unvisited";
type SortType = "name" | "date";

export default function Home() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("date");
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          router.push("/auth/login");
        }
      } catch {
        router.push("/auth/login");
      }
    };
    checkSession();
  }, [router]);

  const fetchDestinations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (sort === "name") {
        params.append("sort", "name");
      } else {
        params.append("sort", "date");
      }
      const response = await fetch(`/api/destinations?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch destinations");
      }
      const data = await response.json();
      setDestinations(data.destinations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDestinations();
    }
  }, [sort, isAuthenticated]);

  const handleVisitedToggle = async (id: string, visited: boolean) => {
    try {
      const response = await fetch(`/api/destinations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visited }),
      });
      if (!response.ok) {
        throw new Error("Failed to update destination");
      }
      const data = await response.json();
      setDestinations(
        destinations.map((d) => (d.id === id ? data.destination : d))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/destinations/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete destination");
      }
      setDestinations(destinations.filter((d) => d.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleEdit = async (
    id: string,
    name: string,
    description: string
  ) => {
    try {
      const response = await fetch(`/api/destinations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      if (!response.ok) {
        throw new Error("Failed to update destination");
      }
      const data = await response.json();
      setDestinations(
        destinations.map((d) => (d.id === id ? data.destination : d))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const filteredDestinations = destinations.filter((d) => {
    if (filter === "visited") return d.visited;
    if (filter === "unvisited") return !d.visited;
    return true;
  });

  const totalCount = destinations.length;
  const visitedCount = destinations.filter((d) => d.visited).length;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
              Travel Wishlist
            </h1>
            <p className="text-gray-600 text-lg">
              Plan your next adventure and track your travels
            </p>
          </div>
          <LogoutButton />
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <WishlistStats totalCount={totalCount} visitedCount={visitedCount} />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Add New Destination
          </h2>
          <AddDestinationForm onSuccess={fetchDestinations} />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              My Destinations
            </h2>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortType)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Sort by Date Added</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
          <FilterTabs
            activeFilter={filter}
            onFilterChange={(f) => setFilter(f as FilterType)}
          />
        </div>

        <DestinationList
          destinations={filteredDestinations}
          filter={filter}
          isLoading={isLoading}
          onVisitedToggle={handleVisitedToggle}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}
