"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "cn"

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-input bg-secondary transition-colors outline-none after:absolute after:-inset-x-2 after:-inset-y-2.5 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:border-destructive data-[size=default]:h-8 data-[size=default]:w-14 data-[size=sm]:h-7 data-[size=sm]:w-12 data-checked:border-primary data-checked:bg-primary data-disabled:cursor-not-allowed data-disabled:opacity-40",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full bg-foreground/70 transition-transform group-data-[size=default]/switch:size-6 group-data-[size=sm]/switch:size-5 group-data-[size=default]/switch:translate-x-1 group-data-[size=sm]/switch:translate-x-1 data-checked:translate-x-6 data-checked:bg-primary-foreground group-data-[size=sm]/switch:data-checked:translate-x-5"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
