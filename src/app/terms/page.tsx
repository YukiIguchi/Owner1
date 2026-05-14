import { FileText } from 'lucide-react'

export const metadata = { title: 'Terms of Service' }

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2 mb-1">
          <FileText size={28} className="text-primary" /> Terms of Service
        </h1>
        <p className="text-dark-muted text-sm">Last updated: December 15, 2024</p>
      </div>

      {[
        { title: '1. Acceptance of Terms', content: 'By accessing or using SoundWave, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.' },
        { title: '2. User Accounts', content: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. You must be at least 13 years old to use our services.' },
        { title: '3. Content Guidelines', content: 'You retain ownership of content you upload. By uploading, you grant SoundWave a license to display and distribute your content on our platform.\n\nYou agree not to upload:\n• Content that infringes on intellectual property rights\n• Explicit content without proper age restriction labels\n• Spam or misleading content\n• Content that violates any applicable laws' },
        { title: '4. Premium Subscriptions', content: 'Premium subscriptions are billed monthly or annually. Refunds are not available for partial subscription periods. You may cancel at any time, and your access will continue until the end of the billing period.' },
        { title: '5. Coin System', content: 'Coins are virtual currency with no cash value until redeemed. Coin purchases are final and non-refundable unless required by law. We reserve the right to modify coin values and exchange rates.' },
        { title: '6. Termination', content: 'We reserve the right to terminate or suspend accounts that violate these terms. Upon termination, your right to use the service will immediately cease.' },
        { title: '7. Changes to Terms', content: 'We may modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.' },
      ].map((section) => (
        <div key={section.title}>
          <h2 className="text-lg font-semibold text-foreground mb-3">{section.title}</h2>
          <p className="text-dark-muted text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
        </div>
      ))}
    </div>
  )
}
