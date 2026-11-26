import { useEffect } from 'react'
import { toast } from 'sonner'
import { useRegisterSW } from 'virtual:pwa-register/react'

function PwaUpdateToast() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  useEffect(() => {
    if (!needRefresh) return

    const toastId = toast('A new version of MaalTrack is ready', {
      description: 'Reload to pick up the latest changes.',
      duration: Number.POSITIVE_INFINITY,
      action: {
        label: 'Reload',
        onClick: () => void updateServiceWorker(true),
      },
      onDismiss: () => setNeedRefresh(false),
    })

    return () => {
      toast.dismiss(toastId)
    }
  }, [needRefresh, setNeedRefresh, updateServiceWorker])

  return null
}

export { PwaUpdateToast }
