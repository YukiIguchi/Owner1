'use client'

import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '@/lib/utils'

interface SliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  className?: string
  trackClassName?: string
  thumbClassName?: string
}

export function Slider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className,
  trackClassName,
  thumbClassName,
}: SliderProps) {
  return (
    <SliderPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      min={min}
      max={max}
      step={step}
      className={cn('relative flex items-center select-none touch-none w-full h-5', className)}
    >
      <SliderPrimitive.Track
        className={cn(
          'relative h-1 grow rounded-full bg-dark-border overflow-hidden',
          trackClassName
        )}
      >
        <SliderPrimitive.Range className="absolute h-full bg-primary rounded-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          'block w-3 h-3 rounded-full bg-primary shadow-md shadow-primary/40',
          'focus:outline-none focus:ring-2 focus:ring-primary/50',
          'hover:scale-125 transition-transform',
          thumbClassName
        )}
      />
    </SliderPrimitive.Root>
  )
}
