import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
const Separator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => <div ref={ref} role="separator" className={cn("h-px w-full bg-white/10", className)} {...props} />);
Separator.displayName = "Separator";
export { Separator };
