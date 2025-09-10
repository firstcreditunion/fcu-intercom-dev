'use client'

import { useEffect } from 'react'
import Intercom from '@intercom/messenger-js-sdk'

interface IntercomConfig {
  app_id: string
  user_id?: string
  name?: string
  email?: string
  created_at?: number
}

interface IntercomProviderProps {
  children: React.ReactNode
  appId?: string
  userId?: string
  userName?: string
  userEmail?: string
  userCreatedAt?: number
}

export default function IntercomProvider({
  children,
  appId = process.env.NEXT_PUBLIC_INTERCOM_APP_ID || 'a30t2fvp', // Default from docs
  userId,
  userName,
  userEmail,
  userCreatedAt,
}: IntercomProviderProps) {
  useEffect(() => {
    // Don't initialize if no app ID is provided
    if (!appId) {
      console.warn(
        'Intercom app ID not provided. Skipping Intercom initialization.'
      )
      return
    }

    // Initialize Intercom with user data if provided, otherwise anonymous
    const initializeIntercom = () => {
      const intercomConfig: IntercomConfig = {
        app_id: appId,
      }

      // Add user data if provided (for authenticated users)
      if (userId) {
        intercomConfig.user_id = userId
      }
      if (userName) {
        intercomConfig.name = userName
      }
      if (userEmail) {
        intercomConfig.email = userEmail
      }
      if (userCreatedAt) {
        intercomConfig.created_at = userCreatedAt
      }

      try {
        Intercom(intercomConfig)
        console.log('Intercom initialized successfully')
      } catch (error) {
        console.error('Failed to initialize Intercom:', error)
      }
    }

    // Initialize Intercom
    initializeIntercom()

    // Cleanup function
    return () => {
      try {
        // Intercom SDK handles cleanup automatically
        console.log('Intercom cleanup completed')
      } catch (error) {
        console.error('Error during Intercom cleanup:', error)
      }
    }
  }, [appId, userId, userName, userEmail, userCreatedAt])

  return <>{children}</>
}
