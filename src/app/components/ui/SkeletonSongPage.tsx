export default function SkeletonSongPage() {
  return (
    <div className="container mx-auto py-6 animate-pulse">
      <div className="mb-8">
        <div className="h-8 bg-secondary rounded-md w-2/3 mb-2"></div>
        <div className="h-6 bg-secondary rounded-md w-1/3"></div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <div className="h-6 bg-secondary rounded-full w-24"></div>
        <div className="h-6 bg-secondary rounded-full w-20"></div>
        <div className="h-6 bg-secondary rounded-full w-28"></div>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
        <div className="space-y-3">
          {Array.from({ length: 15 }).map((_, index) => (
            <div
              key={index}
              className="h-4 bg-secondary rounded"
              style={{ width: `${Math.floor(Math.random() * 60) + 40}%` }}
            ></div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div className="h-6 bg-secondary rounded w-40 mb-4"></div>
        <div className="flex space-x-2 mb-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="w-10 h-10 bg-secondary rounded-full"></div>
          ))}
        </div>
      </div>

      <div className="flex space-x-3 mt-6">
        <div className="h-10 bg-secondary rounded-md w-24"></div>
        <div className="h-10 bg-secondary rounded-md w-24"></div>
      </div>
    </div>
  )
}
