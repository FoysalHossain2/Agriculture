import * as React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'accent' | 'outline'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold',
        {
          'bg-[#1a6b35] text-white': variant === 'default',
          'bg-[#d4edda] text-[#1a6b35]': variant === 'success',
          'bg-amber-100 text-amber-700': variant === 'warning',
          'bg-[#8bc34a] text-white': variant === 'accent',
          'border border-[#1a6b35] text-[#1a6b35] bg-transparent': variant === 'outline',
        },
        className,
      )}
      {...props}
    />
  )
}
