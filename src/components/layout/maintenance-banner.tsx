'use client'

import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'

interface MaintenanceBannerProps {
  message?: string
}

export function MaintenanceBanner({ message }: MaintenanceBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || !message) return null

  return (
    <div className="bg-yellow-500/10 border-b border-yellow-500/30 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <AlertTriangle size={16} className="text-yellow-400 flex-shrink-0" />
        <p className="text-sm text-yellow-300 flex-1">{message}</p>
        <button
          onClick={() => setDismissed(true)}
          className="text-yellow-400/60 hover:text-yellow-400 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
