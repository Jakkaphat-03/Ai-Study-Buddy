import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50", { variants: { variant: { primary: "bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/15 hover:bg-emerald-300", secondary: "border border-white/10 bg-white/[0.05] text-slate-100 hover:border-cyan-300/35 hover:bg-white/[0.08]", ghost: "text-slate-300 hover:bg-white/[0.06] hover:text-white" }, size: { default: "h-10 px-4 py-2", sm: "h-9 px-3", icon: "size-10" } }, defaultVariants: { variant: "primary", size: "default" } });
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />);
Button.displayName = "Button";
export { Button, buttonVariants };
