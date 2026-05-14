'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { Coins, MessageSquare, EyeOff } from 'lucide-react'
import { Profile, AudioPost } from '@/lib/database.types'
import { COIN_MAX_TIP_SINGLE, COIN_MIN_TIP } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface TipModalProps {
  open: boolean
  onClose: () => void
  poster: Profile
  audio?: AudioPost
  userBalance?: number
}

const PRESET_AMOUNTS = [10, 50, 100, 500, 1000]

export function TipModal({ open, onClose, poster, audio, userBalance = 0 }: TipModalProps) {
  const [amount, setAmount] = useState<number>(100)
  const [message, setMessage] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (amount < COIN_MIN_TIP || amount > COIN_MAX_TIP_SINGLE) return
    if (amount > userBalance) return
    setSending(true)
    // Tip logic here
    await new Promise((r) => setTimeout(r, 1500))
    setSending(false)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Send a Tip" description="Send coins to support this creator">
      <div className="space-y-5">
        {/* Poster info */}
        <div className="flex items-center gap-3 p-3 bg-dark-bg rounded-xl">
          <Avatar src={poster.avatar_url} name={poster.display_name || poster.username} size="md" />
          <div>
            <p className="font-medium text-foreground">{poster.display_name || poster.username}</p>
            {audio && <p className="text-xs text-dark-muted truncate max-w-[200px]">{audio.title}</p>}
          </div>
        </div>

        {/* Balance */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-dark-muted">Your balance</span>
          <span className="flex items-center gap-1 text-secondary font-semibold">
            <Coins size={14} />
            {userBalance.toLocaleString()} coins
          </span>
        </div>

        {/* Preset amounts */}
        <div className="grid grid-cols-5 gap-2">
          {PRESET_AMOUNTS.map((preset) => (
            <button
              key={preset}
              onClick={() => setAmount(preset)}
              className={cn(
                'py-2 rounded-xl text-sm font-medium transition-colors',
                amount === preset
                  ? 'bg-primary text-white'
                  : 'bg-dark-bg border border-dark-border text-dark-muted hover:border-primary hover:text-foreground'
              )}
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Custom amount */}
        <Input
          label="Custom amount"
          type="number"
          min={COIN_MIN_TIP}
          max={COIN_MAX_TIP_SINGLE}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          icon={<Coins size={14} />}
        />

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground/80 flex items-center gap-1.5">
            <MessageSquare size={14} />
            Message (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message to the creator..."
            rows={2}
            maxLength={200}
            className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-dark-muted resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>

        {/* Anonymous */}
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
          <EyeOff size={14} className="text-dark-muted" />
          <span className="text-sm text-foreground group-hover:text-primary transition-colors">Send anonymously</span>
        </label>

        {/* Warning */}
        {amount > userBalance && (
          <p className="text-xs text-red-400 bg-red-400/10 rounded-lg p-2">
            Insufficient balance. Please purchase more coins.
          </p>
        )}

        <Button
          onClick={handleSend}
          isLoading={sending}
          disabled={amount < COIN_MIN_TIP || amount > userBalance}
          className="w-full"
          size="lg"
        >
          <Coins size={16} />
          Send {amount.toLocaleString()} coins
        </Button>
      </div>
    </Modal>
  )
}
