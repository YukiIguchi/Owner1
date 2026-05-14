'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function Modal({ open, onClose, title, description, children, className }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in-0" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
            'bg-dark-card border border-dark-border rounded-2xl shadow-2xl',
            'w-full max-w-md max-h-[90vh] overflow-y-auto',
            'animate-in fade-in-0 zoom-in-95',
            className
          )}
        >
          <div className="flex items-center justify-between p-5 border-b border-dark-border">
            {title && (
              <Dialog.Title className="text-lg font-semibold text-foreground">
                {title}
              </Dialog.Title>
            )}
            {description && (
              <Dialog.Description className="sr-only">{description}</Dialog.Description>
            )}
            <Dialog.Close asChild>
              <button
                onClick={onClose}
                className="ml-auto p-1.5 rounded-lg hover:bg-dark-border transition-colors text-dark-muted hover:text-foreground"
              >
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>
          <div className="p-5">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
