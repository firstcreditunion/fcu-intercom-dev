'use client'

import { useCallback, useEffect, useState } from 'react'
import { IntercomBootOptions } from '../types/intercom'

/**
 * Custom hook for interacting with Intercom
 * Provides methods to control the Intercom widget programmatically
 */
export function useIntercom() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check if Intercom is loaded
    const checkIntercomLoaded = () => {
      if (typeof window !== 'undefined' && window.Intercom) {
        setIsLoaded(true)
      }
    }

    // Check immediately
    checkIntercomLoaded()

    // Set up interval to check for Intercom loading
    const interval = setInterval(checkIntercomLoaded, 100)

    // Clean up interval after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval)
    }, 10000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  /**
   * Boot Intercom with user data (for authenticated users)
   */
  const boot = useCallback((options: IntercomBootOptions) => {
    if (typeof window !== 'undefined' && window.Intercom) {
      window.Intercom('boot', options)
    }
  }, [])

  /**
   * Update Intercom with new data
   */
  const update = useCallback((options?: Partial<IntercomBootOptions>) => {
    if (typeof window !== 'undefined' && window.Intercom) {
      window.Intercom('update', options)
    }
  }, [])

  /**
   * Shutdown Intercom (useful for logout)
   */
  const shutdown = useCallback(() => {
    if (typeof window !== 'undefined' && window.Intercom) {
      window.Intercom('shutdown')
    }
  }, [])

  /**
   * Show the Intercom widget
   */
  const show = useCallback(() => {
    if (typeof window !== 'undefined' && window.Intercom) {
      window.Intercom('show')
    }
  }, [])

  /**
   * Hide the Intercom widget
   */
  const hide = useCallback(() => {
    if (typeof window !== 'undefined' && window.Intercom) {
      window.Intercom('hide')
    }
  }, [])

  /**
   * Show the message list
   */
  const showMessages = useCallback(() => {
    if (typeof window !== 'undefined' && window.Intercom) {
      window.Intercom('showMessages')
    }
  }, [])

  /**
   * Show the new message composer with optional pre-filled message
   */
  const showNewMessage = useCallback((message?: string) => {
    if (typeof window !== 'undefined' && window.Intercom) {
      window.Intercom('showNewMessage', message)
    }
  }, [])

  return {
    isLoaded,
    boot,
    update,
    shutdown,
    show,
    hide,
    showMessages,
    showNewMessage,
  }
}
