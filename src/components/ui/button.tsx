import type { ButtonHTMLAttributes } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | "light";
  size?: "default" | "sm" | "icon";
};

const buttonVariants = cva("button", {
  variants: {
    variant: {
      default: "button-default",
      outline: "button-outline",
      ghost: "button-ghost",
      light: "button-light"
    },
    size: {
      default: "button-size-default",
      sm: "button-size-sm",
      icon: "button-size-icon"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});

export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
