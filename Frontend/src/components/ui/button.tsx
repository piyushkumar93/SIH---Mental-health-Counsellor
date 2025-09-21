import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // Primary - stronger fill + clearer hover for dark backgrounds
        default:
          'bg-primary text-primary-foreground hover:bg-primary-dark/95 shadow-gentle hover:shadow-soft transform hover:scale-[1.02]',
        // Destructive - deeper red fill and brighter hover
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive-dark shadow-gentle hover:shadow-soft',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-gentle hover:shadow-soft',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-gentle hover:shadow-soft',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        // Calming uses a clearer solid fallback in dark mode and retains gradient in light
        calming:
          'bg-gradient-calm text-primary-foreground hover:shadow-soft transform hover:scale-[1.02] border-0 dark:bg-primary dark:text-primary-foreground',
        success:
          'bg-gradient-success text-success-foreground hover:shadow-soft transform hover:scale-[1.02]',
        soft: 'bg-accent-light text-accent-foreground hover:bg-accent hover:shadow-soft transform hover:scale-[1.02]',
        chat: 'bg-gradient-primary text-primary-foreground hover:shadow-soft transform hover:scale-[1.02] rounded-full'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-12 rounded-lg px-8',
        icon: 'h-10 w-10',
        chat: 'h-8 px-3 py-1 text-xs'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'default', size, asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    // Add a semantic variant class we can target from CSS (eg. btn-variant-calming)
    const variantClass = `btn-variant-${variant}`
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          variantClass
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
