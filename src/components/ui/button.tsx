import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
  const button = event.currentTarget;
  const ripple = document.createElement("span");
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.classList.add("ripple-effect");

  button.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
};

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden hover-shine",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_0_30px_rgba(217,179,112,0.8),0_8px_25px_rgba(0,0,0,0.4)] active:scale-95",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_0_30px_rgba(239,68,68,0.8),0_8px_25px_rgba(0,0,0,0.4)] active:scale-95",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:-translate-y-1 hover:scale-105 hover:shadow-[0_0_25px_rgba(217,179,112,0.6),0_5px_20px_rgba(0,0,0,0.3)] active:scale-95",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_0_25px_rgba(217,179,112,0.6),0_5px_20px_rgba(0,0,0,0.3)] active:scale-95",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:-translate-y-1 hover:scale-105 hover:shadow-[0_0_20px_rgba(217,179,112,0.5)] active:scale-95",
        link: "text-primary underline-offset-4 hover:underline hover:scale-105 hover:drop-shadow-[0_0_12px_rgba(217,179,112,0.6)] active:scale-95",
        "ghost-gold": "border-2 border-primary/30 text-foreground hover:bg-primary/10 hover:border-primary hover:shadow-[0_0_35px_rgba(217,179,112,0.8),0_8px_30px_rgba(217,179,112,0.4)] hover:-translate-y-2 hover:scale-110 active:scale-95 transition-all duration-500",
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
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!asChild) {
        createRipple(e);
      }
      onClick?.(e);
    };
    
    return (
      <Comp 
        className={cn(buttonVariants({ variant, size, className }))} 
        ref={ref} 
        onClick={!asChild ? handleClick : onClick}
        {...props} 
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
