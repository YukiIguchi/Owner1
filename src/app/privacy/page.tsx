import { Shield } from 'lucide-react'
import { SITE_NAME } from '@/lib/constants'

export const metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2 mb-1">
          <Shield size={28} className="text-primary" /> Privacy Policy
        </h1>
        <p className="text-dark-muted text-sm">Last updated: December 15, 2024</p>
      </div>

      {[
        { title: '1. Information We Collect', content: 'We collect information you provide directly to us, such as when you create an account, upload content, or contact us for support. This includes your email address, username, and any content you upload or share.\n\nWe also automatically collect certain information when you use our services, including usage data, device information, and cookies.' },
        { title: '2. How We Use Your Information', content: 'We use the information we collect to:\n• Provide, maintain, and improve our services\n• Process transactions and send related information\n• Send promotional communications (with your consent)\n• Monitor and analyze usage patterns\n• Detect and prevent fraudulent activity' },
        { title: '3. Information Sharing', content: 'We do not sell, trade, or rent your personal information to third parties. We may share your information with:\n• Service providers who assist in our operations\n• Legal authorities when required by law\n• Business partners with your explicit consent' },
        { title: '4. Data Retention', content: 'We retain your information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time through Settings.' },
        { title: '5. Security', content: 'We implement industry-standard security measures to protect your information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.' },
        { title: '6. Contact Us', content: `If you have questions about this Privacy Policy, please contact us at privacy@${SITE_NAME.toLowerCase()}.app` },
      ].map((section) => (
        <div key={section.title}>
          <h2 className="text-lg font-semibold text-foreground mb-3">{section.title}</h2>
          <div className="text-dark-muted text-sm leading-relaxed whitespace-pre-line">{section.content}</div>
        </div>
      ))}
    </div>
  )
}
