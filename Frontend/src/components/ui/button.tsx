import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-[#1a6b35] text-white shadow-lg hover:bg-[#0f4021] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0',
        outline:
          'border-2 border-white text-white hover:bg-white hover:text-[#1a6b35] hover:-translate-y-0.5 active:translate-y-0',
        outlineDark:
          'border-2 border-[#1a6b35] text-[#1a6b35] hover:bg-[#1a6b35] hover:text-white hover:-translate-y-0.5',
        accent:
          'bg-[#8bc34a] text-white shadow-lg hover:bg-[#7cb342] hover:shadow-xl hover:-translate-y-0.5',
        ghost:
          'text-[#1a6b35] hover:bg-[#eef2ee] hover:text-[#0f4021]',
        link: 'text-[#1a6b35] underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-4 text-xs',
        md: 'h-11 px-6',
        lg: 'h-13 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
