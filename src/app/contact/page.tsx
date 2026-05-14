'use client'

import { useState } from 'react'
import { Mail, MessageSquare, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    await new Promise((r) => setTimeout(r, 1500))
    setSent(true)
    setSending(false)
  }

  if (sent) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
          <Send size={28} className="text-secondary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Message Sent!</h2>
        <p className="text-dark-muted">We&apos;ll get back to you within 1-2 business days.</p>
        <Button onClick={() => setSent(false)} variant="outline">Send another</Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2 mb-1">
          <Mail size={28} className="text-primary" /> Contact Us
        </h1>
        <p className="text-dark-muted">We&apos;d love to hear from you</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[
          { icon: <Mail size={20} />, label: 'General Inquiries', desc: 'support@soundwave.app' },
          { icon: <MessageSquare size={20} />, label: 'Press & Partnerships', desc: 'press@soundwave.app' },
        ].map((item) => (
          <div key={item.label} className="bg-dark-card border border-dark-border rounded-2xl p-4 flex items-center gap-3">
            <div className="text-primary">{item.icon}</div>
            <div>
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-dark-muted">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-dark-card border border-dark-border rounded-3xl p-8 space-y-5">
        <h2 className="text-xl font-semibold text-foreground">Send us a message</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Your Name" placeholder="John Doe" required />
          <Input label="Email" type="email" placeholder="you@example.com" required />
        </div>
        <Input label="Subject" placeholder="What&apos;s this about?" required />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground/80">Message</label>
          <textarea
            required
            rows={5}
            placeholder="Tell us how we can help..."
            className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-dark-muted resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
        <Button type="submit" size="lg" isLoading={sending} className="w-full">
          <Send size={16} /> Send Message
        </Button>
      </form>
    </div>
  )
}
