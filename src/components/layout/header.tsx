'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Coins, Bell, Search, Upload, LayoutDashboard, Settings, LogOut, User as UserIcon } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem, DropdownSeparator } from '@/components/ui/dropdown'
import { NAV_LINKS } from '@/lib/constants'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export function Header() {
  const { user, profile, loading, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`)
      setSearchValue('')
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-bold text-sm">SW</span>
          </div>
          <span className="font-bold text-lg gradient-text hidden sm:block">SoundWave</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 ml-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded-xl text-sm text-dark-muted hover:text-foreground hover:bg-dark-card transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search - Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm mx-auto">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" />
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search audio, creators..."
              className="w-full bg-dark-card border border-dark-border rounded-full pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-dark-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </form>

        {/* Right Side */}
        <div className="ml-auto flex items-center gap-2">
          {!loading && (
            <>
              {user && profile ? (
                <>
                  {/* Coin balance */}
                  <Link
                    href="/settings?tab=coins"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-dark-card border border-dark-border rounded-full text-sm hover:border-secondary transition-colors"
                  >
                    <Coins size={14} className="text-secondary" />
                    <span className="text-secondary font-medium">0</span>
                  </Link>

                  {/* Notification Bell */}
                  <Link
                    href="/settings?tab=notifications"
                    className="relative p-2 rounded-xl hover:bg-dark-card transition-colors"
                  >
                    <Bell size={18} className="text-dark-muted" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                  </Link>

                  {/* Avatar Dropdown */}
                  <Dropdown>
                    <DropdownTrigger asChild>
                      <button className="rounded-full ring-2 ring-transparent hover:ring-primary transition-all">
                        <Avatar
                          src={profile.avatar_url}
                          name={profile.display_name || profile.username}
                          size="sm"
                        />
                      </button>
                    </DropdownTrigger>
                    <DropdownContent>
                      <div className="px-3 py-2 border-b border-dark-border mb-1">
                        <p className="text-sm font-medium text-foreground">
                          {profile.display_name || profile.username}
                        </p>
                        <p className="text-xs text-dark-muted">@{profile.username}</p>
                      </div>
                      <DropdownItem
                        icon={<UserIcon size={14} />}
                        onClick={() => router.push(`/profile/${profile.username}`)}
                      >
                        My Profile
                      </DropdownItem>
                      {profile.is_poster && (
                        <DropdownItem
                          icon={<LayoutDashboard size={14} />}
                          onClick={() => router.push('/dashboard')}
                        >
                          Dashboard
                        </DropdownItem>
                      )}
                      <DropdownItem
                        icon={<Upload size={14} />}
                        onClick={() => router.push('/dashboard/posts/new')}
                      >
                        Upload Audio
                      </DropdownItem>
                      <DropdownItem
                        icon={<Settings size={14} />}
                        onClick={() => router.push('/settings')}
                      >
                        Settings
                      </DropdownItem>
                      <DropdownSeparator />
                      <DropdownItem
                        icon={<LogOut size={14} />}
                        onClick={signOut}
                        destructive
                      >
                        Sign Out
                      </DropdownItem>
                    </DropdownContent>
                  </Dropdown>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>
                    Login
                  </Button>
                  <Button size="sm" onClick={() => router.push('/register')}>
                    Sign Up
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-dark-card transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden border-t border-dark-border bg-dark-bg/95 backdrop-blur-sm',
          mobileOpen ? 'block' : 'hidden'
        )}
      >
        <div className="px-4 py-3">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" />
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search..."
                className="w-full bg-dark-card border border-dark-border rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </form>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm text-dark-muted hover:text-foreground hover:bg-dark-card transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
