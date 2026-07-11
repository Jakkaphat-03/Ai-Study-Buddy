import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
interface AvatarProps extends HTMLAttributes<HTMLDivElement> { initials?: string; }
const Avatar = forwardRef<HTMLDivElement, AvatarProps>(({ className, initials = "AS", ...props }, ref) => <div ref={ref} className={cn("grid size-9 shrink-0 place-items-center rounded-full border border-emerald-300/25 bg-emerald-300/10 text-xs font-bold text-emerald-100", className)} {...props}>{initials}</div>);
Avatar.displayName = "Avatar";
export { Avatar };
