interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function FilterTabs({
  activeFilter,
  onFilterChange,
}: FilterTabsProps) {
  const filters = [
    { id: "all", label: "All Destinations" },
    { id: "visited", label: "Visited" },
    { id: "unvisited", label: "To Visit" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeFilter === filter.id
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
