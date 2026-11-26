import { WifiOff } from 'lucide-react'
import { useOnlineStatus } from '@/hooks/use-online-status'

function OfflineIndicator() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div
      role="status"
      className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-primary px-3 py-2 text-xs font-semibold tracking-widest text-primary-foreground uppercase shadow-lg"
    >
      <WifiOff className="size-3.5" />
      Offline — showing saved data
    </div>
  )
}

export { OfflineIndicator }
