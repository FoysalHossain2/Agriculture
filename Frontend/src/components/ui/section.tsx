import { cn } from '@/lib/utils'

interface SectionLabelProps {
  text: string
  className?: string
}

export function SectionLabel({ text, className }: SectionLabelProps) {
  return (
    <span className={cn('section-label', className)}>
      {text}
    </span>
  )
}

interface SectionHeadingProps {
  children: React.ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3'
}

export function SectionHeading({ children, className, as: Tag = 'h2' }: SectionHeadingProps) {
  return (
    <Tag
      className={cn(
        'font-display font-bold text-[#1e2d1e] leading-tight tracking-tight',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

interface SectionProps {
  id?: string
  className?: string
  children: React.ReactNode
}

export function Section({ id, className, children }: SectionProps) {
  return (
    <section
      id={id}
      className={cn('py-20 lg:py-28', className)}
    >
      {children}
    </section>
  )
}

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  )
}
