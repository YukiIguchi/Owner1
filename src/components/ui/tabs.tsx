'use client'

import * as RadixTabs from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

export const Tabs = RadixTabs.Root

interface TabsListProps {
  children: React.ReactNode
  className?: string
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <RadixTabs.List
      className={cn(
        'flex items-center gap-1 bg-dark-card border border-dark-border rounded-xl p-1',
        className
      )}
    >
      {children}
    </RadixTabs.List>
  )
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  return (
    <RadixTabs.Trigger
      value={value}
      className={cn(
        'flex-1 px-4 py-2 text-sm font-medium rounded-lg text-dark-muted',
        'data-[state=active]:bg-primary data-[state=active]:text-white',
        'hover:text-foreground transition-all',
        className
      )}
    >
      {children}
    </RadixTabs.Trigger>
  )
}

export const TabsContent = RadixTabs.Content
