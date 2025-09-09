'use client'

import { useEffect } from 'react'

// Extend the Window interface to include Intercom
interface IntercomFunction {
  (method: string, ...args: unknown[]): void
  c?: (args: unknown) => void
  q?: unknown[]
}

declare global {
  interface Window {
    Intercom: IntercomFunction | undefined
    intercomSettings: Record<string, unknown>
    attachEvent?: (event: string, listener: EventListener) => void
  }
}

interface IntercomProviderProps {
  children: React.ReactNode
  workspaceId?: string
  apiBase?: string
}

export default function IntercomProvider({
  children,
  workspaceId = process.env.NEXT_PUBLIC_INTERCOM_WORKSPACE_ID,
  apiBase = 'https://api-iam.au.intercom.io', // Australian API base
}: IntercomProviderProps) {
  useEffect(() => {
    // Don't initialize if no workspace ID is provided
    if (!workspaceId) {
      console.warn(
        'Intercom workspace ID not provided. Skipping Intercom initialization.'
      )
      return
    }

    // Set up Intercom settings
    window.intercomSettings = {
      api_base: apiBase,
      app_id: workspaceId,
    }

    // Intercom initialization script (Single-Page App method from documentation)
    const initIntercom = () => {
      const w = window
      const ic = w.Intercom

      if (typeof ic === 'function') {
        ic('update', w.intercomSettings)
      } else {
        const d = document
        const i = function (...args: unknown[]) {
          if (i.c) {
            i.c(args)
          }
        } as IntercomFunction
        i.q = []
        i.c = function (args: unknown) {
          if (i.q) {
            i.q.push(args)
          }
        }
        w.Intercom = i

        const l = function () {
          const s = d.createElement('script')
          s.type = 'text/javascript'
          s.async = true
          s.src = `https://widget.intercom.io/widget/${workspaceId}`
          const x = d.getElementsByTagName('script')[0]
          if (x && x.parentNode) {
            x.parentNode.insertBefore(s, x)
          }
        }

        if (document.readyState === 'complete') {
          l()
        } else if (w.attachEvent) {
          w.attachEvent('onload', l)
        } else {
          w.addEventListener('load', l, false)
        }
      }
    }

    // Initialize Intercom
    initIntercom()

    // Boot Intercom for anonymous users
    const bootIntercom = () => {
      if (window.Intercom && typeof window.Intercom === 'function') {
        window.Intercom('boot', {
          api_base: apiBase,
          app_id: workspaceId,
        })
      }
    }

    // Small delay to ensure Intercom is loaded
    const timer = setTimeout(bootIntercom, 1000)

    // Cleanup function
    return () => {
      clearTimeout(timer)
      if (window.Intercom && typeof window.Intercom === 'function') {
        window.Intercom('shutdown')
      }
    }
  }, [workspaceId, apiBase])

  return <>{children}</>
}
