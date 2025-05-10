import LoadingSpinner from './LoadingSpinner'

export default function PageSuspense() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card p-6 rounded-lg shadow-lg flex flex-col items-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <div className="text-foreground font-medium">Đang tải...</div>
        <div className="text-muted-foreground text-sm mt-1">Vui lòng đợi trong giây lát</div>
      </div>
    </div>
  )
}
