import Image from 'next/image'
import { cn, getAvatarFallback } from '@/lib/utils'

interface AvatarProps {
  src?: string | null
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
}

const imageSizes = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const fallback = getAvatarFallback(name)
  const px = imageSizes[size]

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center',
        'bg-gradient-to-br from-primary/30 to-secondary/30 border border-dark-border',
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          width={px}
          height={px}
          className="object-cover w-full h-full"
        />
      ) : (
        <span className="font-semibold text-foreground">{fallback}</span>
      )}
    </div>
  )
}
