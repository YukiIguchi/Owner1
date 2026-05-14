'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  defaultValue?: string
  className?: string
  autoFocus?: boolean
}

export function SearchBar({ defaultValue = '', className, autoFocus }: SearchBarProps) {
  const [value, setValue] = useState(defaultValue)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by title, creator, tag..."
        autoFocus={autoFocus}
        className="w-full bg-dark-card border border-dark-border rounded-2xl pl-12 pr-10 py-3 text-foreground placeholder:text-dark-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-muted hover:text-foreground"
        >
          <X size={16} />
        </button>
      )}
    </form>
  )
}
