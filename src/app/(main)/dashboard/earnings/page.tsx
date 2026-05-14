import { Coins, TrendingUp, Calendar, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils'

const mockTransactions = [
  { id: 't1', amount: 500, from: 'ゆき', audio: '夜の図書館 第1話', is_anonymous: false, created_at: '2024-12-15T10:00:00Z', message: '素晴らしい作品です！' },
  { id: 't2', amount: 100, from: 'Anonymous', audio: '夜の図書館 第2話', is_anonymous: true, created_at: '2024-12-14T20:00:00Z', message: null },
  { id: 't3', amount: 1000, from: 'たかし', audio: '夜の図書館 第1話', is_anonymous: false, created_at: '2024-12-13T15:00:00Z', message: 'いつも応援しています！続きを楽しみにしています' },
  { id: 't4', amount: 50, from: 'はな', audio: '夜の図書館 第2話', is_anonymous: false, created_at: '2024-12-12T09:00:00Z', message: null },
]

export default function EarningsPage() {
  const total = mockTransactions.reduce((s, t) => s + t.amount, 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <DollarSign size={24} className="text-secondary" />
        Earnings
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <div className="text-xs text-dark-muted mb-2 flex items-center gap-1">
              <Coins size={14} className="text-secondary" /> Total Earned
            </div>
            <p className="text-3xl font-bold text-secondary">{total.toLocaleString()}</p>
            <p className="text-xs text-dark-muted mt-1">coins</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-xs text-dark-muted mb-2 flex items-center gap-1">
              <Calendar size={14} className="text-primary" /> This Month
            </div>
            <p className="text-3xl font-bold text-foreground">1,650</p>
            <p className="text-xs text-secondary mt-1">+32% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-xs text-dark-muted mb-2 flex items-center gap-1">
              <TrendingUp size={14} className="text-primary" /> Tips Received
            </div>
            <p className="text-3xl font-bold text-foreground">{mockTransactions.length}</p>
            <p className="text-xs text-dark-muted mt-1">total tips</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tip History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTransactions.map((t) => (
              <div key={t.id} className="flex items-start gap-3 p-3 bg-dark-bg rounded-xl">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Coins size={14} className="text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {t.is_anonymous ? 'Anonymous' : t.from}
                    </span>
                    {t.is_anonymous && <Badge variant="outline">Anon</Badge>}
                    <span className="text-xs text-dark-muted ml-auto">{formatRelativeTime(t.created_at)}</span>
                  </div>
                  <p className="text-xs text-dark-muted">{t.audio}</p>
                  {t.message && (
                    <p className="text-xs text-foreground/70 mt-1 italic">&quot;{t.message}&quot;</p>
                  )}
                </div>
                <span className="text-sm font-bold text-secondary flex-shrink-0">+{t.amount}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="font-semibold text-foreground mb-2">Payout Information</h3>
          <p className="text-sm text-dark-muted">
            Coin payouts are available when you have collected 10,000 coins or more. Contact support to set up your payout method.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
