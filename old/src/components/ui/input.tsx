import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-md border border-input bg-secondary/40 px-3 py-2 text-base text-foreground transition-[color,background-color,border-color] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:bg-secondary/60 focus-visible:ring-2 focus-visible:ring-ring/25 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/25",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
