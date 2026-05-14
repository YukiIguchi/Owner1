import { CheckCircle, AlertCircle, Clock } from 'lucide-react'

const services = [
  { name: 'Web App', status: 'operational' },
  { name: 'Audio Streaming', status: 'operational' },
  { name: 'Upload Service', status: 'operational' },
  { name: 'Authentication', status: 'operational' },
  { name: 'Payment Processing', status: 'operational' },
  { name: 'Search', status: 'degraded' },
  { name: 'Notifications', status: 'operational' },
  { name: 'CDN', status: 'operational' },
]

const statusConfig = {
  operational: { label: 'Operational', color: 'text-green-400', bg: 'bg-green-400', icon: <CheckCircle size={16} className="text-green-400" /> },
  degraded: { label: 'Degraded', color: 'text-yellow-400', bg: 'bg-yellow-400', icon: <AlertCircle size={16} className="text-yellow-400" /> },
  outage: { label: 'Outage', color: 'text-red-400', bg: 'bg-red-400', icon: <AlertCircle size={16} className="text-red-400" /> },
}

export default function StatusPage() {
  const allOperational = services.every((s) => s.status === 'operational')

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">System Status</h1>
        <p className="text-dark-muted">Current status of SoundWave services</p>
      </div>

      {/* Overall status */}
      <div className={`rounded-2xl p-6 flex items-center gap-4 ${allOperational ? 'bg-green-400/10 border border-green-400/20' : 'bg-yellow-400/10 border border-yellow-400/20'}`}>
        {allOperational ? (
          <CheckCircle size={32} className="text-green-400" />
        ) : (
          <AlertCircle size={32} className="text-yellow-400" />
        )}
        <div>
          <p className={`font-bold text-lg ${allOperational ? 'text-green-400' : 'text-yellow-400'}`}>
            {allOperational ? 'All Systems Operational' : 'Some Services Degraded'}
          </p>
          <p className="text-dark-muted text-sm">Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>

      {/* Services */}
      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
        {services.map((service, i) => {
          const config = statusConfig[service.status as keyof typeof statusConfig]
          return (
            <div
              key={service.name}
              className={`flex items-center justify-between px-5 py-4 ${i < services.length - 1 ? 'border-b border-dark-border' : ''}`}
            >
              <span className="text-sm font-medium text-foreground">{service.name}</span>
              <div className="flex items-center gap-2">
                {config.icon}
                <span className={`text-sm ${config.color}`}>{config.label}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Incidents */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Incidents</h2>
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Clock size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Search Service Degraded</p>
              <p className="text-xs text-dark-muted mt-1">Dec 15, 2024 - 10:00 UTC · Ongoing</p>
              <p className="text-sm text-dark-muted mt-2">Search results may be slower than normal. Our team is investigating.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
