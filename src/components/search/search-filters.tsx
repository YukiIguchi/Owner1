'use client'

import { CATEGORIES } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface SearchFiltersProps {
  selectedCategory?: string
  sortBy?: string
  onCategoryChange: (cat: string) => void
  onSortChange: (sort: string) => void
}

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Played' },
  { value: 'liked', label: 'Most Liked' },
]

export function SearchFilters({ selectedCategory, sortBy = 'relevance', onCategoryChange, onSortChange }: SearchFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange('')}
          className={cn(
            'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
            !selectedCategory
              ? 'bg-primary text-white'
              : 'bg-dark-card border border-dark-border text-dark-muted hover:text-foreground hover:border-primary'
          )}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
              selectedCategory === cat
                ? 'bg-primary text-white'
                : 'bg-dark-card border border-dark-border text-dark-muted hover:text-foreground hover:border-primary'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-dark-muted">Sort by:</span>
        <div className="flex gap-1">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSortChange(opt.value)}
              className={cn(
                'px-3 py-1 rounded-lg text-sm transition-colors',
                sortBy === opt.value
                  ? 'bg-dark-card border border-primary text-primary'
                  : 'text-dark-muted hover:text-foreground'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
