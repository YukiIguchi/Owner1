import { Check, Star, Zap, Headphones, Coins, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PLAN_MONTHLY_PRICE, PLAN_YEARLY_PRICE, COIN_PACKAGES } from '@/lib/constants'
import Link from 'next/link'

const features = [
  { icon: <Headphones size={18} />, title: 'Unlimited listening history', desc: 'Keep up to 120 plays in history (vs 30 free)' },
  { icon: <Lock size={18} />, title: 'Access premium-only audio', desc: 'Unlock exclusive content from top creators' },
  { icon: <Star size={18} />, title: 'High quality audio', desc: 'Stream in the best available quality' },
  { icon: <Zap size={18} />, title: 'No ads', desc: 'Enjoy uninterrupted listening' },
  { icon: <Coins size={18} />, title: 'Monthly coin bonus', desc: '100 free coins every month to tip creators' },
  { icon: <Star size={18} />, title: 'Premium badge', desc: 'Show your support with a special badge' },
]

export default function PremiumPage() {
  const yearlyMonthly = Math.floor(PLAN_YEARLY_PRICE / 12)
  const savings = PLAN_MONTHLY_PRICE * 12 - PLAN_YEARLY_PRICE

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      {/* Hero */}
      <div className="text-center">
        <Badge variant="premium" className="mb-4 text-sm px-4 py-1">
          <Star size={14} /> SoundWave Premium
        </Badge>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Support Creators,{' '}
          <span className="gradient-text">Unlock More</span>
        </h1>
        <p className="text-dark-muted text-lg max-w-xl mx-auto">
          Get unlimited access to premium audio content and help your favorite creators continue making great content.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly */}
        <div className="bg-dark-card border border-dark-border rounded-3xl p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Monthly</h2>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-4xl font-bold text-foreground">¥{PLAN_MONTHLY_PRICE}</span>
              <span className="text-dark-muted">/month</span>
            </div>
          </div>
          <p className="text-sm text-dark-muted">Billed monthly, cancel anytime</p>
          <Button variant="outline" size="lg" className="w-full">
            Get Monthly
          </Button>
        </div>

        {/* Yearly - highlighted */}
        <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/40 rounded-3xl p-6 space-y-4">
          <div className="absolute -top-3 right-6">
            <Badge variant="secondary">Save ¥{savings}</Badge>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Yearly</h2>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-4xl font-bold gradient-text">¥{yearlyMonthly}</span>
              <span className="text-dark-muted">/month</span>
            </div>
            <p className="text-sm text-dark-muted">¥{PLAN_YEARLY_PRICE}/year</p>
          </div>
          <p className="text-sm text-dark-muted">Billed annually, best value</p>
          <Button size="lg" className="w-full">
            Get Yearly — Best Value
          </Button>
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-6 text-center">What&apos;s included</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <div key={i} className="flex gap-3 p-4 bg-dark-card border border-dark-border rounded-2xl">
              <div className="w-9 h-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{f.title}</p>
                <p className="text-xs text-dark-muted mt-0.5">{f.desc}</p>
              </div>
              <Check size={16} className="text-secondary ml-auto flex-shrink-0 mt-1" />
            </div>
          ))}
        </div>
      </div>

      {/* Coins */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Coins size={20} className="text-secondary" />
          Buy Coins
        </h2>
        <p className="text-dark-muted text-sm mb-6">Send tips to your favorite creators</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {COIN_PACKAGES.map((pkg) => (
            <div
              key={pkg.coins}
              className="bg-dark-card border border-dark-border rounded-2xl p-4 text-center hover:border-secondary transition-colors cursor-pointer"
            >
              <div className="text-2xl font-bold text-secondary mb-1">{pkg.coins}</div>
              <div className="text-xs text-dark-muted mb-3">coins</div>
              <div className="font-semibold text-foreground">¥{pkg.price}</div>
              <Button size="sm" variant="secondary" className="w-full mt-3">Buy</Button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.' },
            { q: 'What payment methods are accepted?', a: 'We accept all major credit cards and debit cards through our secure payment provider, Stripe.' },
            { q: 'Do coins expire?', a: 'Coins purchased do not expire. Monthly bonus coins for premium members expire at the end of each month.' },
            { q: 'Can I use premium on multiple devices?', a: 'Yes, your premium subscription works across all your devices.' },
          ].map((faq, i) => (
            <div key={i} className="bg-dark-card border border-dark-border rounded-2xl p-4">
              <h3 className="font-medium text-foreground mb-2">{faq.q}</h3>
              <p className="text-sm text-dark-muted">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
