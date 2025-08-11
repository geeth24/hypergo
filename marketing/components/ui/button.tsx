import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'relative overflow-hidden text-primary-foreground border rounded-md bg-gradient-to-b from-[color-mix(in_oklab,var(--color-primary),white_14%)] to-[color-mix(in_oklab,var(--color-primary),black_6%)] border-[color-mix(in_oklab,var(--color-primary),black_25%)] [box-shadow:inset_0_1.5px_0_0_color-mix(in_oklab,var(--color-primary),white_35%),inset_0_-1.5px_0_0_color-mix(in_oklab,var(--color-primary),black_18%),0_1px_2px_hsl(0_0%_0%_/_0.25)] hover:from-[color-mix(in_oklab,var(--color-primary),white_20%)] hover:to-[color-mix(in_oklab,var(--color-primary),black_10%)] active:[box-shadow:inset_0_2px_0_0_color-mix(in_oklab,var(--color-primary),black_10%),inset_0_-2px_0_0_color-mix(in_oklab,var(--color-primary),black_25%),0_1px_1px_hsl(0_0%_0%_/_0.15)] active:translate-y-[0.5px]',
        destructive:
          'relative overflow-hidden text-destructive-foreground border rounded-md bg-gradient-to-b from-[color-mix(in_oklab,var(--color-destructive),white_14%)] to-[color-mix(in_oklab,var(--color-destructive),black_6%)] border-[color-mix(in_oklab,var(--color-destructive),black_25%)] [box-shadow:inset_0_1.5px_0_0_color-mix(in_oklab,var(--color-destructive),white_35%),inset_0_-1.5px_0_0_color-mix(in_oklab,var(--color-destructive),black_18%),0_1px_2px_hsl(0_0%_0%_/_0.25)] hover:from-[color-mix(in_oklab,var(--color-destructive),white_20%)] hover:to-[color-mix(in_oklab,var(--color-destructive),black_10%)] active:[box-shadow:inset_0_2px_0_0_color-mix(in_oklab,var(--color-destructive),black_10%),inset_0_-2px_0_0_color-mix(in_oklab,var(--color-destructive),black_25%),0_1px_1px_hsl(0_0%_0%_/_0.15)] active:translate-y-[0.5px]',
        outline:
          'relative overflow-hidden border bg-gradient-to-b from-[color-mix(in_oklab,var(--color-accent),white_10%)] to-[color-mix(in_oklab,var(--color-accent),black_6%)] border-[color-mix(in_oklab,var(--color-accent),black_20%)] text-accent-foreground [box-shadow:inset_0_1px_0_0_color-mix(in_oklab,var(--color-accent),white_30%),inset_0_-1px_0_0_color-mix(in_oklab,var(--color-accent),black_12%)] hover:from-[color-mix(in_oklab,var(--color-accent),white_16%)] hover:to-[color-mix(in_oklab,var(--color-accent),black_10%)]',
        secondary:
          'relative overflow-hidden text-secondary-foreground border rounded-md bg-gradient-to-b from-[color-mix(in_oklab,var(--color-secondary),white_14%)] to-[color-mix(in_oklab,var(--color-secondary),black_6%)] border-[color-mix(in_oklab,var(--color-secondary),black_18%)] [box-shadow:inset_0_1.5px_0_0_color-mix(in_oklab,var(--color-secondary),white_35%),inset_0_-1.5px_0_0_color-mix(in_oklab,var(--color-secondary),black_12%),0_1px_2px_hsl(0_0%_0%_/_0.20)] hover:from-[color-mix(in_oklab,var(--color-secondary),white_20%)] hover:to-[color-mix(in_oklab,var(--color-secondary),black_10%)] active:[box-shadow:inset_0_2px_0_0_color-mix(in_oklab,var(--color-secondary),black_10%),inset_0_-2px_0_0_color-mix(in_oklab,var(--color-secondary),black_20%),0_1px_1px_hsl(0_0%_0%_/_0.12)] active:translate-y-[0.5px]',
        ghost:
          'hover:bg-gradient-to-b hover:from-[color-mix(in_oklab,var(--color-accent),white_10%)] hover:to-[color-mix(in_oklab,var(--color-accent),black_6%)] hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
