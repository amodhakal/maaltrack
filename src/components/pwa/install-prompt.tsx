"use client";

import { Download, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePwaInstall } from '@/hooks/use-pwa-install'

function InstallPrompt() {
  const { canInstall, promptInstall, dismiss } = usePwaInstall()

  if (!canInstall) return null

  return (
    <aside className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md border bg-background p-4 shadow-lg ring-1 ring-foreground/10">
      <div className="flex items-start gap-3">
        <img
          src="/pwa-192x192.png"
          alt=""
          className="size-11 shrink-0 rounded-md"
          width={44}
          height={44}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="font-heading text-sm font-semibold tracking-wider uppercase">
              Install MaalTrack
            </p>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Dismiss install prompt"
              onClick={dismiss}
            >
              <X />
            </Button>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Keep your cards and points one tap away — even offline.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Button size="sm" onClick={() => void promptInstall()}>
              <Download data-icon="inline-start" />
              Install app
            </Button>
            <Button size="sm" variant="ghost" onClick={dismiss}>
              Not now
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}

export { InstallPrompt }
