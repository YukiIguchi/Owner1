'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { SearchBar } from '@/components/search/search-bar'
import { SearchFilters } from '@/components/search/search-filters'
import { AudioGrid } from '@/components/audio/audio-grid'
import { mockAudioPosts } from '@/lib/mock-data'
import { AudioPost } from '@/lib/database.types'
import { Search } from 'lucide-react'

export function SearchPageContent() {
  const params = useSearchParams()
  const query = params.get('q') || ''
  const initialCategory = params.get('category') || ''

  const [category, setCategory] = useState(initialCategory)
  const [sortBy, setSortBy] = useState('relevance')
  const [results, setResults] = useState<AudioPost[]>([])

  useEffect(() => {
    let filtered = mockAudioPosts

    if (query) {
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.description?.toLowerCase().includes(query.toLowerCase()) ||
          a.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())) ||
          a.poster?.username.toLowerCase().includes(query.toLowerCase()) ||
          a.poster?.display_name?.toLowerCase().includes(query.toLowerCase())
      )
    }

    if (category) {
      filtered = filtered.filter((a) => a.category === category)
    }

    switch (sortBy) {
      case 'newest':
        filtered = [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'popular':
        filtered = [...filtered].sort((a, b) => b.play_count - a.play_count)
        break
      case 'liked':
        filtered = [...filtered].sort((a, b) => b.like_count - a.like_count)
        break
    }

    setResults(filtered)
  }, [query, category, sortBy])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Search size={24} className="text-primary" />
          {query ? `Results for "${query}"` : 'Discover Audio'}
        </h1>
        <SearchBar defaultValue={query} className="max-w-2xl" />
      </div>

      <SearchFilters
        selectedCategory={category}
        sortBy={sortBy}
        onCategoryChange={setCategory}
        onSortChange={setSortBy}
      />

      <div>
        <p className="text-sm text-dark-muted mb-4">
          {results.length} result{results.length !== 1 ? 's' : ''} found
        </p>
        <AudioGrid audios={results} columns={4} />
      </div>
    </div>
  )
}
