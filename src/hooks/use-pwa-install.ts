import { useCallback, useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

const DISMISS_KEY = 'maaltrack:install-dismissed'

function isStandalone() {
  const navigatorWithStandalone = window.navigator as Navigator & {
    standalone?: boolean
  }

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    navigatorWithStandalone.standalone === true
  )
}

function readDismissed() {
  try {
    return window.localStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return false
  }
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(isStandalone)
  const [isDismissed, setIsDismissed] = useState(readDismissed)

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
    }

    const onInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    const displayMode = window.matchMedia('(display-mode: standalone)')
    const onDisplayModeChange = () => setIsInstalled(isStandalone())

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onInstalled)
    displayMode.addEventListener('change', onDisplayModeChange)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onInstalled)
      displayMode.removeEventListener('change', onDisplayModeChange)
    }
  }, [])

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false

    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    setDeferredPrompt(null)

    return outcome === 'accepted'
  }, [deferredPrompt])

  const dismiss = useCallback(() => {
    try {
      window.localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      // Storage can be unavailable in private browsing; dismissing still works.
    }
    setIsDismissed(true)
  }, [])

  return {
    canInstall: deferredPrompt !== null && !isInstalled && !isDismissed,
    isInstalled,
    isDismissed,
    promptInstall,
    dismiss,
  }
}
