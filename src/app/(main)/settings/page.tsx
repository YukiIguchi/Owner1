'use client'

import { useState } from 'react'
import { User, Bell, Shield, Coins, CreditCard, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSaving(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6 flex-wrap h-auto">
          <TabsTrigger value="profile">
            <User size={14} /> Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell size={14} /> Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Shield size={14} /> Privacy
          </TabsTrigger>
          <TabsTrigger value="coins">
            <Coins size={14} /> Coins
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard size={14} /> Billing
          </TabsTrigger>
        </TabsList>

        {/* Profile tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-2xl font-bold text-foreground">
                  A
                </div>
                <Button variant="outline" size="sm">Change Avatar</Button>
              </div>
              <Input label="Display Name" defaultValue="My Display Name" />
              <Input label="Username" defaultValue="my_username" />
              <Textarea label="Bio" defaultValue="Tell people about yourself..." rows={3} />
              <Input label="Twitter / X URL" placeholder="https://twitter.com/..." />
              <Input label="Custom Profile URL" placeholder="soundwave.app/u/your-name" />
              <div className="flex justify-end">
                <Button onClick={save} isLoading={saving}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: 'new_follower', label: 'New followers', desc: 'When someone follows you' },
                { id: 'new_like', label: 'Likes', desc: 'When someone likes your audio' },
                { id: 'new_comment', label: 'Comments', desc: 'When someone comments on your audio' },
                { id: 'new_tip', label: 'Tips', desc: 'When you receive a coin tip' },
                { id: 'series_update', label: 'Series updates', desc: 'When creators you follow post new episodes' },
                { id: 'newsletter', label: 'Newsletter', desc: 'Weekly highlights and recommendations' },
              ].map((notif) => (
                <label key={notif.id} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{notif.label}</p>
                    <p className="text-xs text-dark-muted">{notif.desc}</p>
                  </div>
                </label>
              ))}
              <div className="flex justify-end">
                <Button onClick={save} isLoading={saving}>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy tab */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: 'show_activity', label: 'Show listening activity', desc: 'Others can see what you\'re listening to' },
                { id: 'show_liked', label: 'Show liked audio', desc: 'Your liked audio is visible on your profile' },
                { id: 'allow_tips', label: 'Allow tips', desc: 'Receive coin tips from other users' },
                { id: 'searchable', label: 'Appear in search', desc: 'Your profile appears in user search results' },
              ].map((item) => (
                <label key={item.id} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-dark-muted">{item.desc}</p>
                  </div>
                </label>
              ))}
              <div className="border-t border-dark-border pt-4 mt-4">
                <h3 className="text-sm font-semibold text-red-400 mb-2">Danger Zone</h3>
                <Button variant="danger" size="sm">
                  <Trash2 size={14} /> Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Coins tab */}
        <TabsContent value="coins">
          <Card>
            <CardHeader>
              <CardTitle>Coin Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <div className="text-5xl font-bold text-secondary mb-2">0</div>
                <p className="text-dark-muted text-sm">coins available</p>
              </div>
              <Button className="w-full" size="lg">
                <Coins size={18} /> Buy Coins
              </Button>
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">Recent transactions</h3>
                <p className="text-sm text-dark-muted text-center py-4">No transactions yet</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing tab */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-dark-bg rounded-2xl border border-dark-border">
                <p className="text-sm font-medium text-foreground">Current plan: Free</p>
                <p className="text-xs text-dark-muted mt-1">Upgrade to Premium to unlock all features</p>
              </div>
              <Button className="w-full" size="lg">
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
