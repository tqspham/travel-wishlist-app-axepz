interface WishlistStatsProps {
  totalCount: number;
  visitedCount: number;
}

export default function WishlistStats({
  totalCount,
  visitedCount,
}: WishlistStatsProps) {
  const unvisitedCount = totalCount - visitedCount;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="bg-[var(--color-background)] rounded-lg p-6 border border-[var(--color-border)]">
        <p className="text-[var(--color-muted-text)] text-sm font-medium">Total Destinations</p>
        <p className="text-3xl font-bold text-[var(--color-primary)] mt-2" style={{ fontFamily: "'Georgia', 'Garamond', serif" }}>{totalCount}</p>
      </div>
      <div className="bg-[var(--color-background)] rounded-lg p-6 border border-[var(--color-border)]">
        <p className="text-[var(--color-muted-text)] text-sm font-medium">Visited</p>
        <p className="text-3xl font-bold text-[var(--color-success)] mt-2" style={{ fontFamily: "'Georgia', 'Garamond', serif" }}>{visitedCount}</p>
      </div>
      <div className="bg-[var(--color-background)] rounded-lg p-6 border border-[var(--color-border)]">
        <p className="text-[var(--color-muted-text)] text-sm font-medium">To Visit</p>
        <p className="text-3xl font-bold text-[var(--color-accent)] mt-2" style={{ fontFamily: "'Georgia', 'Garamond', serif" }}>
          {unvisitedCount}
        </p>
      </div>
    </div>
  );
}
