"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function PwaUpdateToast() {
  const refreshing = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    let registration: ServiceWorkerRegistration | undefined;

    const onControllerChange = () => {
      if (refreshing.current) return;
      refreshing.current = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    const promptUpdate = (worker: ServiceWorker) => {
      const toastId = toast("A new version of MaalTrack is ready", {
        description: "Reload to pick up the latest changes.",
        duration: Number.POSITIVE_INFINITY,
        action: {
          label: "Reload",
          onClick: () => {
            worker.postMessage({ type: "SKIP_WAITING" });
            toast.dismiss(toastId);
          },
        },
      });
    };

    const watchRegistration = (reg: ServiceWorkerRegistration) => {
      registration = reg;
      if (reg.waiting) {
        promptUpdate(reg.waiting);
      }
      reg.addEventListener("updatefound", () => {
        const installing = reg.installing;
        if (!installing) return;
        installing.addEventListener("statechange", () => {
          if (installing.state === "installed" && navigator.serviceWorker.controller) {
            promptUpdate(installing);
          }
        });
      });
    };

    navigator.serviceWorker.register("/sw.js").then(watchRegistration).catch(() => {
      // SW registration failure should not break the app.
    });

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange,
      );
      if (registration) {
        // no-op: listeners are on registration/worker objects
      }
    };
  }, []);

  return null;
}
