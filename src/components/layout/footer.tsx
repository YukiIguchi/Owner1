import Link from 'next/link'
import { SITE_NAME } from '@/lib/constants'

const footerLinks = [
  { label: 'About', href: '/help' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
  { label: 'Contact', href: '/contact' },
  { label: 'Hall of Fame', href: '/hall-of-fame' },
  { label: 'Status', href: '/status' },
]

export function Footer() {
  return (
    <footer className="border-t border-dark-border bg-dark-card mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-xs">SW</span>
            </div>
            <span className="font-bold gradient-text">{SITE_NAME}</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-dark-muted hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <p className="text-xs text-dark-muted">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
