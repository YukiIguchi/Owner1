import { Flag, Shield, CheckCircle, X, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils'
import Link from 'next/link'

const mockReports = [
  { id: 'r1', target: '雨の日のASMR', type: 'audio', reason: 'inappropriate_content', status: 'pending', created_at: '2024-12-15T10:00:00Z' },
  { id: 'r2', target: 'user_badname', type: 'user', reason: 'spam', status: 'pending', created_at: '2024-12-14T18:00:00Z' },
  { id: 'r3', target: 'Some comment...', type: 'comment', reason: 'harassment', status: 'resolved', created_at: '2024-12-13T09:00:00Z' },
]

export default function AdminContentPage() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="border-b border-dark-border bg-dark-card px-6 py-4 flex items-center gap-3">
        <Shield size={20} className="text-primary" />
        <span className="text-dark-muted text-sm">
          <Link href="/admin" className="hover:text-foreground">Admin</Link> / Content
        </span>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Flag size={20} className="text-red-400" />
          Content Reports
        </h1>

        <div className="flex gap-2">
          {['All', 'Pending', 'Resolved'].map((f) => (
            <button
              key={f}
              className={`px-4 py-1.5 rounded-full text-sm ${f === 'All' ? 'bg-primary text-white' : 'bg-dark-card border border-dark-border text-dark-muted'}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {mockReports.map((report) => (
            <div key={report.id} className="bg-dark-card border border-dark-border rounded-2xl p-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline">{report.type}</Badge>
                  <span className="text-sm font-medium text-foreground">{report.target}</span>
                  <Badge variant={report.status === 'pending' ? 'primary' : 'secondary'}>
                    {report.status}
                  </Badge>
                </div>
                <p className="text-xs text-dark-muted">
                  Reason: {report.reason.replace('_', ' ')} · {formatRelativeTime(report.created_at)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" title="View">
                  <Eye size={14} />
                </Button>
                <Button variant="ghost" size="icon" title="Dismiss">
                  <CheckCircle size={14} className="text-secondary" />
                </Button>
                <Button variant="ghost" size="icon" title="Remove content">
                  <X size={14} className="text-red-400" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
