import { Suspense } from 'react'
import { SearchPageContent } from './search-content'
import { Search } from 'lucide-react'

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-dark-card rounded-xl w-64" />
          <div className="h-12 bg-dark-card rounded-2xl" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-56 bg-dark-card rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
}
