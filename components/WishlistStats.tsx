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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <p className="text-gray-600 text-sm font-medium">Total Destinations</p>
        <p className="text-3xl font-bold text-blue-600 mt-1">{totalCount}</p>
      </div>
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <p className="text-gray-600 text-sm font-medium">Visited</p>
        <p className="text-3xl font-bold text-green-600 mt-1">{visitedCount}</p>
      </div>
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <p className="text-gray-600 text-sm font-medium">To Visit</p>
        <p className="text-3xl font-bold text-yellow-600 mt-1">
          {unvisitedCount}
        </p>
      </div>
    </div>
  );
}
