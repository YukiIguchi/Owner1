import { HelpCircle, Book, MessageSquare, Mail, ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'How do I upload audio?',
    a: 'To upload audio, you need to register as a creator. Go to Settings → Profile and enable creator mode. Then you can upload from the Dashboard.',
  },
  {
    q: 'What audio formats are supported?',
    a: 'We support MP3, WAV, FLAC, and AAC formats. Maximum file size is 500MB per upload.',
  },
  {
    q: 'How does the coin tipping system work?',
    a: 'Coins are a virtual currency you can use to tip creators. You can purchase coins from the Premium page. Creators can redeem coins once they reach 10,000.',
  },
  {
    q: 'What is Premium membership?',
    a: 'Premium membership (¥980/month) gives you access to premium-only content, extended listening history, no ads, and 100 monthly bonus coins.',
  },
  {
    q: 'Can I download audio for offline listening?',
    a: 'Currently, SoundWave is streaming-only. Offline listening is planned for a future update.',
  },
  {
    q: 'How do I report inappropriate content?',
    a: 'Click the flag icon on any audio, comment, or profile to report it. Our team reviews all reports within 24-48 hours.',
  },
]

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
          <HelpCircle size={28} className="text-primary" />
          Help Center
        </h1>
        <p className="text-dark-muted">Find answers to common questions</p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: <Book size={20} />, label: 'Getting Started', desc: 'New to SoundWave? Start here.' },
          { icon: <MessageSquare size={20} />, label: 'Community Guidelines', desc: 'Rules and expectations.' },
          { icon: <Mail size={20} />, label: 'Contact Support', desc: 'Get help from our team.' },
        ].map((item) => (
          <div key={item.label} className="bg-dark-card border border-dark-border rounded-2xl p-4 hover:border-primary/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-2 mb-2 text-primary">
              {item.icon}
              <span className="font-medium text-foreground">{item.label}</span>
            </div>
            <p className="text-xs text-dark-muted">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* FAQs */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="bg-dark-card border border-dark-border rounded-2xl group">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none">
                <span className="font-medium text-foreground">{faq.q}</span>
                <ChevronDown size={16} className="text-dark-muted group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-5 pb-4">
                <p className="text-sm text-dark-muted leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
