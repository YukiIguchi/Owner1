import Link from 'next/link'
import { Users, Music, Flag, BarChart2, ArrowRight, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const adminSections = [
  { href: '/admin/users', label: 'User Management', desc: 'View, ban, and manage users', icon: <Users size={20} /> },
  { href: '/admin/content', label: 'Content Moderation', desc: 'Review reported content', icon: <Flag size={20} /> },
  { href: '/dashboard/analytics', label: 'Platform Analytics', desc: 'Overall platform statistics', icon: <BarChart2 size={20} /> },
  { href: '/admin', label: 'Music Library', desc: 'Manage audio content', icon: <Music size={20} /> },
]

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="border-b border-dark-border bg-dark-card px-6 py-4 flex items-center gap-3">
        <Shield size={20} className="text-primary" />
        <h1 className="font-bold text-foreground text-lg">Admin Panel</h1>
        <Link href="/" className="ml-auto text-sm text-dark-muted hover:text-foreground">← Back to site</Link>
      </div>

      <div className="max-w-4xl mx-auto p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {adminSections.map((s) => (
            <Link key={s.href} href={s.href}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                <CardContent>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-primary">{s.icon}</div>
                    <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors">{s.label}</h2>
                    <ArrowRight size={14} className="ml-auto text-dark-muted" />
                  </div>
                  <p className="text-sm text-dark-muted">{s.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: '24,891' },
            { label: 'Total Audio', value: '8,234' },
            { label: 'Active Today', value: '1,203' },
            { label: 'Open Reports', value: '12' },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-dark-muted mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
