export default function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="px-5 py-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-secondary rounded-full flex-shrink-0"></div>
          <div className="flex-grow min-w-0">
            <div className="h-6 bg-secondary rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-secondary rounded w-1/2"></div>
          </div>
        </div>

        <div className="mt-4 ml-16">
          <div className="flex justify-between items-center">
            <div className="h-3 bg-secondary rounded w-24"></div>
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-6 h-6 bg-secondary rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 bg-muted dark:bg-card border-t flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="h-4 bg-secondary rounded w-16"></div>
          <div className="h-4 bg-secondary rounded w-16"></div>
        </div>

        <div className="flex space-x-2">
          <div className="w-8 h-8 bg-secondary rounded-full"></div>
          <div className="w-8 h-8 bg-secondary rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
