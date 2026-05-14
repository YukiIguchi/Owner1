import { Cookie } from 'lucide-react'

export const metadata = { title: 'Cookie Policy' }

export default function CookiePolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2 mb-1">
          <Cookie size={28} className="text-primary" /> Cookie Policy
        </h1>
        <p className="text-dark-muted text-sm">Last updated: December 15, 2024</p>
      </div>

      <p className="text-dark-muted text-sm leading-relaxed">
        This Cookie Policy explains how SoundWave uses cookies and similar technologies when you visit our platform.
      </p>

      {[
        { title: 'Essential Cookies', desc: 'These cookies are necessary for the website to function. They include session management and authentication cookies.', examples: ['supabase-auth-token', 'session-id'] },
        { title: 'Analytics Cookies', desc: 'We use analytics cookies to understand how visitors interact with our platform and improve the user experience.', examples: ['_ga', '_gid'] },
        { title: 'Preference Cookies', desc: 'These cookies remember your preferences such as volume settings and theme choices.', examples: ['volume', 'player-state'] },
        { title: 'Marketing Cookies', desc: 'With your consent, we may use marketing cookies to show relevant advertisements on third-party platforms.', examples: ['_fbp', 'ads-id'] },
      ].map((section) => (
        <div key={section.title} className="bg-dark-card border border-dark-border rounded-2xl p-5">
          <h2 className="text-base font-semibold text-foreground mb-2">{section.title}</h2>
          <p className="text-sm text-dark-muted mb-3">{section.desc}</p>
          <div className="flex flex-wrap gap-2">
            {section.examples.map((ex) => (
              <code key={ex} className="text-xs bg-dark-bg border border-dark-border rounded-lg px-2 py-1 text-primary">
                {ex}
              </code>
            ))}
          </div>
        </div>
      ))}

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Managing Cookies</h2>
        <p className="text-dark-muted text-sm">
          You can control cookies through your browser settings or through our Cookie Preference banner. Note that disabling certain cookies may affect the functionality of our platform.
        </p>
      </div>
    </div>
  )
}
