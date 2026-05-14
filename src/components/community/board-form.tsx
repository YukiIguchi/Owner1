'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { COMMUNITY_CATEGORIES } from '@/lib/constants'

interface BoardFormProps {
  onSubmit?: (content: string, category: string) => void
}

export function BoardForm({ onSubmit }: BoardFormProps) {
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('general')
  const [posting, setPosting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setPosting(true)
    await onSubmit?.(content, category)
    setContent('')
    setPosting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-dark-card border border-dark-border rounded-2xl p-4 space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share something with the community..."
        rows={3}
        maxLength={500}
        className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-dark-muted resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
      />
      <div className="flex items-center gap-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {COMMUNITY_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <span className="text-xs text-dark-muted ml-auto">{content.length}/500</span>
        <Button type="submit" size="sm" isLoading={posting} disabled={!content.trim()}>
          Post
        </Button>
      </div>
    </form>
  )
}
