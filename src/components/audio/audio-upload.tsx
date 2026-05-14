'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, Music, Image as ImageIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CATEGORIES } from '@/lib/constants'
import { cn } from '@/lib/utils'

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(2000).optional(),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).max(10),
  visibility: z.enum(['public', 'private', 'followers_only']),
  is_premium_only: z.boolean(),
  age_restricted: z.boolean(),
})

type FormValues = z.infer<typeof schema>

export function AudioUpload() {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const thumbInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      tags: [],
      visibility: 'public',
      is_premium_only: false,
      age_restricted: false,
    },
  })

  const tags = watch('tags')

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setAudioFile(file)
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailFile(file)
      const url = URL.createObjectURL(file)
      setThumbnailPreview(url)
    }
  }

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && tags.length < 10 && !tags.includes(tag)) {
      setValue('tags', [...tags, tag])
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setValue('tags', tags.filter((t) => t !== tag))
  }

  const onSubmit = async (data: FormValues) => {
    if (!audioFile) return
    setUploading(true)
    // Upload logic would go here with Supabase Storage / R2
    console.log('Upload:', data, audioFile, thumbnailFile)
    await new Promise((r) => setTimeout(r, 2000)) // Simulate upload
    setUploading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Audio file drop zone */}
      <div
        onClick={() => audioInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed border-dark-border rounded-2xl p-8 text-center cursor-pointer',
          'hover:border-primary transition-colors',
          audioFile && 'border-secondary bg-secondary/5'
        )}
      >
        <input
          ref={audioInputRef}
          type="file"
          accept="audio/*"
          onChange={handleAudioChange}
          className="hidden"
        />
        {audioFile ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
              <Music size={24} className="text-secondary" />
            </div>
            <p className="font-medium text-foreground">{audioFile.name}</p>
            <p className="text-sm text-dark-muted">
              {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-dark-border flex items-center justify-center">
              <Upload size={24} className="text-dark-muted" />
            </div>
            <p className="font-medium text-foreground">Drop audio file here or click to browse</p>
            <p className="text-sm text-dark-muted">MP3, WAV, FLAC, AAC up to 500MB</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          <Input
            label="Title"
            placeholder="Enter audio title..."
            error={errors.title?.message}
            {...register('title')}
          />

          <Textarea
            label="Description"
            placeholder="Describe your audio..."
            rows={4}
            {...register('description')}
          />

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground/80">Category</label>
            <select
              {...register('category')}
              className="bg-dark-card border border-dark-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="">Select category...</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground/80">Tags</label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tag..."
                className="flex-1 bg-dark-card border border-dark-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
              <Button type="button" variant="outline" size="md" onClick={addTag}>Add</Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {tags.map((tag) => (
                  <Badge key={tag} variant="primary" className="gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X size={10} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Thumbnail */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground/80">Thumbnail</label>
            <div
              onClick={() => thumbInputRef.current?.click()}
              className="aspect-square max-h-48 border-2 border-dashed border-dark-border rounded-2xl cursor-pointer hover:border-primary transition-colors overflow-hidden relative"
            >
              <input
                ref={thumbInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
              {thumbnailPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-dark-muted">
                  <ImageIcon size={32} />
                  <span className="text-sm">Upload thumbnail</span>
                </div>
              )}
            </div>
          </div>

          {/* Visibility */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground/80">Visibility</label>
            <select
              {...register('visibility')}
              className="bg-dark-card border border-dark-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="followers_only">Followers Only</option>
            </select>
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            {[
              { name: 'is_premium_only', label: 'Premium only', desc: 'Only premium subscribers can listen' },
              { name: 'age_restricted', label: 'Age restricted (18+)', desc: 'Contains mature content' },
            ].map(({ name, label, desc }) => (
              <label key={name} className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register(name as keyof FormValues)}
                  className="mt-0.5 w-4 h-4 accent-primary"
                />
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{label}</p>
                  <p className="text-xs text-dark-muted">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        isLoading={uploading}
        disabled={!audioFile}
        className="w-full"
      >
        {uploading ? 'Uploading...' : 'Publish Audio'}
      </Button>
    </form>
  )
}
