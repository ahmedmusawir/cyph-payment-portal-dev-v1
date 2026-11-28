import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// ABM007_FINAL brand contract 4.2: Title Case, Inter Regular 16px, at least 44px
// high, 8px radius, flat. Hover uses --primary-hover (never bg-primary/90);
// disabled uses the --disabled tokens (never opacity-50). Focus: the shared
// 2px outline with 2px offset from globals (navy, or white inside .pb-on-dark).

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-normal transition-colors disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-transparent disabled:bg-disabled disabled:text-disabled-foreground",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-card text-heading hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground",
        ghost: "text-heading hover:bg-accent hover:text-accent-foreground",
        "destructive-outline":
          "border border-destructive bg-card text-destructive hover:bg-destructive/10",
        link: "text-primary underline underline-offset-4 hover:decoration-2",
      },
      size: {
        default: "h-11 px-4 py-2.5",
        sm: "h-11 px-3",
        lg: "h-14 px-12",
        xl: "h-16 px-24",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
