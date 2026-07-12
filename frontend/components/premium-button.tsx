'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  `
    inline-flex items-center justify-center gap-2 whitespace-nowrap
    rounded-lg font-semibold text-sm transition-all duration-300
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    disabled:pointer-events-none disabled:opacity-50
    relative overflow-hidden group
  `,
  {
    variants: {
      variant: {
        primary: `
          bg-gradient-to-r from-blue-600 to-blue-700
          text-white shadow-lg hover:shadow-2xl
          hover:scale-105 active:scale-95
          before:absolute before:inset-0 before:bg-white/20 before:opacity-0
          before:transition-opacity before:duration-300 hover:before:opacity-100
        `,

        secondary: `
          bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800
          text-slate-900 dark:text-white shadow-md hover:shadow-lg
          hover:scale-105 active:scale-95
          border border-slate-300 dark:border-slate-600
        `,

        success: `
          bg-gradient-to-r from-green-600 to-emerald-600
          text-white shadow-lg hover:shadow-2xl
          hover:scale-105 active:scale-95
          before:absolute before:inset-0 before:bg-white/20 before:opacity-0
          before:transition-opacity before:duration-300 hover:before:opacity-100
        `,

        danger: `
          bg-gradient-to-r from-red-600 to-rose-600
          text-white shadow-lg hover:shadow-2xl
          hover:scale-105 active:scale-95
          before:absolute before:inset-0 before:bg-white/20 before:opacity-0
          before:transition-opacity before:duration-300 hover:before:opacity-100
        `,

        warning: `
          bg-gradient-to-r from-yellow-500 to-amber-600
          text-white shadow-lg hover:shadow-2xl
          hover:scale-105 active:scale-95
          before:absolute before:inset-0 before:bg-white/20 before:opacity-0
          before:transition-opacity before:duration-300 hover:before:opacity-100
        `,

        outline: `
          border-2 border-slate-300 dark:border-slate-600
          text-slate-900 dark:text-white
          hover:bg-slate-100 dark:hover:bg-slate-900
          hover:scale-105 active:scale-95
          transition-all duration-300
        `,

        ghost: `
          text-slate-900 dark:text-white
          hover:bg-slate-100 dark:hover:bg-slate-900
          hover:scale-105 active:scale-95
        `,
      },

      size: {
        xs: 'h-8 px-3 text-xs',
        sm: 'h-9 px-4 text-sm',
        md: 'h-10 px-6 text-base',
        lg: 'h-12 px-8 text-lg',
        xl: 'h-14 px-10 text-xl',
      },
    },

    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

interface PremiumButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  icon?: React.ReactNode
}

const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, icon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {children}
          </>
        ) : (
          <>
            {icon && <span className="flex items-center">{icon}</span>}
            {children}
          </>
        )}
      </Comp>
    )
  }
)

PremiumButton.displayName = 'PremiumButton'

export { PremiumButton, buttonVariants }
