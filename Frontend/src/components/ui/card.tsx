import * as React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'bordered' | 'elevated'
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl overflow-hidden transition-all duration-300',
        {
          'bg-white shadow-sm hover:shadow-md': variant === 'default',
          'bg-white/85 backdrop-blur-xl border border-white/60 shadow-lg': variant === 'glass',
          'bg-white border border-[#d9e3d9]': variant === 'bordered',
          'bg-white shadow-xl hover:shadow-2xl hover:-translate-y-1': variant === 'elevated',
        },
        className,
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pb-0', className)} {...props} />
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6', className)} {...props} />
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}
