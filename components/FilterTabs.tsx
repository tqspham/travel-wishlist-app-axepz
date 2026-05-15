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
          className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
            activeFilter === filter.id
              ? "bg-[var(--color-primary)] text-[var(--color-surface)]"
              : "bg-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-border)] hover:bg-opacity-80"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
