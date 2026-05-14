import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Headphones } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
        <Headphones size={40} className="text-primary opacity-60" />
      </div>
      <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
      <h2 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h2>
      <p className="text-dark-muted mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist. Maybe it was deleted or you mistyped the URL.
      </p>
      <div className="flex gap-3">
        <Link href="/">
          <Button size="lg">Go Home</Button>
        </Link>
        <Link href="/search">
          <Button variant="outline" size="lg">Discover Audio</Button>
        </Link>
      </div>
    </div>
  )
}
