import { Coins } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CoinBalanceProps {
  balance: number
  className?: string
  showLabel?: boolean
}

export function CoinBalance({ balance, className, showLabel }: CoinBalanceProps) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <Coins size={16} className="text-secondary" />
      <span className="font-semibold text-secondary">{balance.toLocaleString()}</span>
      {showLabel && <span className="text-dark-muted text-sm">coins</span>}
    </div>
  )
}
