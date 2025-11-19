import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden hover-shine",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(217,179,112,0.5),0_5px_15px_rgba(0,0,0,0.3)]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(239,68,68,0.5),0_5px_15px_rgba(0,0,0,0.3)]",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(217,179,112,0.3),0_5px_15px_rgba(0,0,0,0.2)]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(217,179,112,0.4),0_5px_15px_rgba(0,0,0,0.2)]",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(217,179,112,0.3)]",
        link: "text-primary underline-offset-4 hover:underline hover:shadow-[0_0_10px_rgba(217,179,112,0.4)]",
        "ghost-gold": "border-2 border-primary/30 text-foreground hover:bg-primary/5 hover:border-primary hover:shadow-[0_0_25px_rgba(217,179,112,0.6),0_5px_20px_rgba(217,179,112,0.3)] hover:-translate-y-1 transition-all duration-500",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const magneticRef = useMagneticEffect(0.3);
    
    const combinedRef = React.useCallback(
      (node: HTMLButtonElement) => {
        // @ts-ignore
        magneticRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref, magneticRef]
    );
    
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={combinedRef} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
