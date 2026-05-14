'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Cookie } from 'lucide-react'
import Link from 'next/link'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50">
      <div className="bg-dark-card border border-dark-border rounded-2xl p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Cookie size={18} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground mb-1">Cookie Preferences</p>
            <p className="text-xs text-dark-muted">
              We use cookies to improve your experience.{' '}
              <Link href="/cookie-policy" className="text-primary hover:underline">
                Learn more
              </Link>
            </p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={accept}>Accept</Button>
              <Button size="sm" variant="outline" onClick={decline}>Decline</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
