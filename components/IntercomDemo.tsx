'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface IntercomMessage {
  timestamp: string
  type: 'info' | 'error' | 'action'
  message: string
  data?: unknown
}

interface UserData {
  userId: string
  userName: string
  userEmail: string
  userCreatedAt: number
}

/**
 * Demo component showing Intercom SDK integration with Anonymous/Authenticated toggle
 */
export default function IntercomDemo() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasLoggedSuccess, setHasLoggedSuccess] = useState(false)
  const [messages, setMessages] = useState<IntercomMessage[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState<UserData>({
    userId: generateRandomUserId(),
    userName: '',
    userEmail: '',
    userCreatedAt: Math.floor(Date.now() / 1000),
  })

  // Generate random alphanumeric user ID
  function generateRandomUserId(): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = 'user_'
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const addMessage = (
    type: IntercomMessage['type'],
    message: string,
    data?: unknown
  ) => {
    const newMessage: IntercomMessage = {
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      data,
    }
    setMessages((prev) => [newMessage, ...prev].slice(0, 15)) // Keep last 15 messages
  }

  useEffect(() => {
    // Check if Intercom is loaded
    const checkIntercomLoaded = () => {
      if (typeof window !== 'undefined' && window.Intercom) {
        setIsLoaded(true)
        if (!hasLoggedSuccess) {
          addMessage('info', 'Intercom SDK loaded successfully')
          setHasLoggedSuccess(true)
        }
      }
    }

    // Check immediately
    checkIntercomLoaded()

    // Set up interval to check for Intercom loading
    const interval = setInterval(checkIntercomLoaded, 500)

    // Clean up interval after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval)
    }, 10000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [hasLoggedSuccess])

  // Intercom API methods
  const showMessenger = () => {
    if (window.Intercom) {
      window.Intercom('show')
      addMessage('action', 'Messenger shown')
    }
  }

  const hideMessenger = () => {
    if (window.Intercom) {
      window.Intercom('hide')
      addMessage('action', 'Messenger hidden')
    }
  }

  const showMessages = () => {
    if (window.Intercom) {
      window.Intercom('showMessages')
      addMessage('action', 'Messages view opened')
    }
  }

  const showNewMessage = (prefilledMessage?: string) => {
    if (window.Intercom) {
      window.Intercom('showNewMessage', prefilledMessage)
      addMessage('action', 'New message composer opened', { prefilledMessage })
    }
  }

  const showHomepage = () => {
    if (window.Intercom) {
      window.Intercom('showSpace', 'home')
      addMessage('action', 'Intercom homepage displayed')
    }
  }

  const shutdown = () => {
    if (window.Intercom) {
      window.Intercom('shutdown')
      addMessage('action', 'Intercom shutdown')
    }
  }

  const clearIntercomCookies = () => {
    // Clear all Intercom-related cookies
    const intercomCookies = document.cookie
      .split(';')
      .filter(
        (cookie) =>
          cookie.trim().toLowerCase().includes('intercom') ||
          cookie.trim().toLowerCase().includes('visitor_id') ||
          cookie.trim().toLowerCase().includes('session')
      )

    let clearedCount = 0

    // Clear each Intercom-related cookie
    intercomCookies.forEach((cookie) => {
      const cookieName = cookie.split('=')[0].trim()

      // Clear for current domain
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`

      clearedCount++
    })

    // Also clear localStorage items that might be Intercom-related
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (
        key &&
        (key.toLowerCase().includes('intercom') ||
          key.toLowerCase().includes('visitor'))
      ) {
        keysToRemove.push(key)
      }
    }

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key)
      clearedCount++
    })

    // Clear sessionStorage as well
    const sessionKeysToRemove = []
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (
        key &&
        (key.toLowerCase().includes('intercom') ||
          key.toLowerCase().includes('visitor'))
      ) {
        sessionKeysToRemove.push(key)
      }
    }

    sessionKeysToRemove.forEach((key) => {
      sessionStorage.removeItem(key)
      clearedCount++
    })

    addMessage(
      'action',
      `Cleared ${clearedCount} Intercom-related cookies/storage items`,
      {
        cookies: intercomCookies.length,
        localStorage: keysToRemove.length,
        sessionStorage: sessionKeysToRemove.length,
      }
    )

    // Recommend page refresh for complete reset
    if (clearedCount > 0) {
      addMessage(
        'info',
        'Cookies cleared. Consider refreshing the page for a complete anonymous session reset.'
      )
    } else {
      addMessage('info', 'No Intercom cookies found to clear.')
    }
  }

  const clearLocalStorage = () => {
    // Clear only localStorage items with "intercom" in the key
    const keysToRemove = []

    // Scan all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.toLowerCase().includes('intercom')) {
        keysToRemove.push(key)
      }
    }

    // Remove the identified keys
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key)
    })

    // Log the action
    addMessage(
      'action',
      `Cleared ${keysToRemove.length} localStorage items with "intercom" key`,
      {
        clearedKeys: keysToRemove,
        totalLocalStorageItems: localStorage.length,
      }
    )

    if (keysToRemove.length > 0) {
      addMessage(
        'info',
        `Removed localStorage keys: ${keysToRemove.join(', ')}`
      )
    } else {
      addMessage('info', 'No localStorage items with "intercom" key found.')
    }
  }

  const handleModeToggle = (checked: boolean) => {
    setIsAuthenticated(checked)
    if (checked) {
      addMessage('info', 'Switched to Authenticated mode')
    } else {
      addMessage('info', 'Switched to Anonymous mode')
    }
  }

  const handleUserDataChange = (
    field: keyof UserData,
    value: string | number
  ) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const testAuthenticatedSetup = () => {
    if (!userData.userName || !userData.userEmail) {
      addMessage('error', 'Please fill in all required fields (Name and Email)')
      return
    }

    if (window.Intercom) {
      const updateData = {
        user_id: userData.userId,
        name: userData.userName,
        email: userData.userEmail,
        created_at: userData.userCreatedAt,
        custom_attributes: {
          test_user: true,
          integration_mode: 'authenticated',
        },
      }

      window.Intercom('update', updateData)
      addMessage('action', 'Authenticated user data applied', updateData)
    }
  }

  const regenerateUserId = () => {
    const newUserId = generateRandomUserId()
    setUserData((prev) => ({
      ...prev,
      userId: newUserId,
    }))
    addMessage('info', `Generated new User ID: ${newUserId}`)
  }

  return (
    <div className='space-y-6 p-6 bg-gray-50 rounded-lg'>
      <div className='text-center'>
        <h2 className='text-2xl font-bold mb-2 text-fcu-primary-500'>
          FCU Intercom Integration
        </h2>
        <p className='text-fcu-secondary-300'>
          Intercom Messenger SDK Integration
        </p>
      </div>

      {/* Mode Toggle Section */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Mode</CardTitle>
          <CardDescription>
            Toggle between anonymous and authenticated user sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-center space-x-2'>
            <Label htmlFor='auth-mode'>Anonymous</Label>
            <Switch
              id='auth-mode'
              checked={isAuthenticated}
              onCheckedChange={handleModeToggle}
            />
            <Label htmlFor='auth-mode'>Authenticated</Label>
          </div>

          <div className='mt-4 p-3 bg-blue-50 rounded-md'>
            <p className='text-sm text-blue-800'>
              <strong>Current Mode:</strong>{' '}
              {isAuthenticated ? 'Authenticated' : 'Anonymous'}
            </p>
            <p className='text-xs text-blue-600 mt-1'>
              {isAuthenticated
                ? 'User data will be sent to Intercom for personalized experience'
                : 'No user data will be sent - anonymous session only'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Authenticated User Form */}
      {isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Provide user details for authenticated Intercom session
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='userId'>User ID</Label>
                <div className='flex space-x-2'>
                  <Input
                    id='userId'
                    value={userData.userId}
                    onChange={(e) =>
                      handleUserDataChange('userId', e.target.value)
                    }
                    placeholder='user_12345'
                  />
                  <Button
                    onClick={regenerateUserId}
                    size='sm'
                    className='rounded-full cursor-pointer shadow-2xl bg-cyan-500 hover:bg-cyan-600 text-white border-0'
                  >
                    Generate
                  </Button>
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='userName'>Name *</Label>
                <Input
                  id='userName'
                  value={userData.userName}
                  onChange={(e) =>
                    handleUserDataChange('userName', e.target.value)
                  }
                  placeholder='John Doe'
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='userEmail'>Email *</Label>
                <Input
                  id='userEmail'
                  type='email'
                  value={userData.userEmail}
                  onChange={(e) =>
                    handleUserDataChange('userEmail', e.target.value)
                  }
                  placeholder='john@fcu.edu'
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='userCreatedAt'>
                  Created At (Unix timestamp)
                </Label>
                <Input
                  id='userCreatedAt'
                  type='number'
                  value={userData.userCreatedAt}
                  disabled
                  className='bg-gray-100'
                />
              </div>
            </div>

            <Button
              onClick={testAuthenticatedSetup}
              className='w-full rounded-full cursor-pointer shadow-2xl bg-emerald-500 hover:bg-emerald-600 text-white border-0 disabled:bg-gray-400 disabled:cursor-not-allowed'
              disabled={!userData.userName || !userData.userEmail}
            >
              Test Authenticated User Setup
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Status Section */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex justify-between items-center mb-3'>
            <span className='text-sm text-gray-600'>Connection Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isLoaded
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {isLoaded ? 'Connected' : 'Loading...'}
            </span>
          </div>

          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <span className='text-gray-500'>SDK Version:</span>
              <span className='ml-2 font-medium'>
                @intercom/messenger-js-sdk
              </span>
            </div>
            <div>
              <span className='text-gray-500'>User Mode:</span>
              <span
                className={`ml-2 font-medium ${
                  isAuthenticated ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                {isAuthenticated ? 'Authenticated' : 'Anonymous'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Control Buttons */}
      {isLoaded && (
        <Card>
          <CardHeader>
            <CardTitle>🎛️ Messenger Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
              <Button
                onClick={showMessenger}
                className='rounded-full cursor-pointer shadow-2xl bg-blue-500 hover:bg-blue-600 text-white border-0'
              >
                Show Messenger
              </Button>

              <Button
                onClick={hideMessenger}
                className='rounded-full cursor-pointer shadow-2xl bg-gray-500 hover:bg-gray-600 text-white border-0'
              >
                Hide Messenger
              </Button>

              <Button
                onClick={showMessages}
                className='rounded-full cursor-pointer shadow-2xl bg-green-500 hover:bg-green-600 text-white border-0'
              >
                Show Messages
              </Button>

              <Button
                onClick={() => showNewMessage(undefined)}
                className='rounded-full cursor-pointer shadow-2xl bg-purple-500 hover:bg-purple-600 text-white border-0'
              >
                New Message
              </Button>

              <Button
                onClick={showHomepage}
                className='rounded-full cursor-pointer shadow-2xl bg-indigo-500 hover:bg-indigo-600 text-white border-0'
              >
                Show Homepage
              </Button>

              <Button
                onClick={shutdown}
                className='rounded-full cursor-pointer shadow-2xl bg-red-500 hover:bg-red-600 text-white border-0'
              >
                Shutdown
              </Button>

              <Button
                onClick={clearIntercomCookies}
                className='rounded-full cursor-pointer shadow-2xl bg-orange-500 hover:bg-orange-600 text-white border-0'
              >
                Clear Cookies
              </Button>

              <Button
                onClick={clearLocalStorage}
                className='rounded-full cursor-pointer shadow-2xl bg-teal-500 hover:bg-teal-600 text-white border-0'
              >
                Clear Local Storage
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <div className='flex justify-between items-center'>
            <CardTitle>📋 Activity Log ({messages.length})</CardTitle>
            <Button
              onClick={() => setMessages([])}
              size='sm'
              className='rounded-full cursor-pointer shadow-2xl bg-rose-500 hover:bg-rose-600 text-white border-0'
            >
              Clear
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className='max-h-64 overflow-y-auto space-y-2'>
            {messages.length === 0 ? (
              <p className='text-sm text-gray-500 italic text-center py-4'>
                No activity yet. Try using the controls above.
              </p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg text-sm border-l-4 ${
                    msg.type === 'error'
                      ? 'bg-red-50 border-red-400 text-red-800'
                      : msg.type === 'action'
                      ? 'bg-blue-50 border-blue-400 text-blue-800'
                      : 'bg-green-50 border-green-400 text-green-800'
                  }`}
                >
                  <div className='flex justify-between items-start mb-1'>
                    <span className='font-semibold uppercase tracking-wide text-xs'>
                      {msg.type}
                    </span>
                    <span className='text-gray-500 text-xs'>
                      {msg.timestamp}
                    </span>
                  </div>
                  <div className='mb-1'>{msg.message}</div>
                  {msg.data !== undefined && msg.data !== null && (
                    <div className='font-mono text-xs bg-gray-100 p-2 rounded mt-2'>
                      <pre className='whitespace-pre-wrap break-words'>
                        {String(
                          typeof msg.data === 'string'
                            ? msg.data
                            : JSON.stringify(msg.data, null, 2)
                        )}
                      </pre>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className='text-sm text-gray-700 space-y-1 list-disc list-inside'>
            <li>
              The Intercom messenger should appear in the bottom-right corner
            </li>
            <li>
              Toggle between Anonymous and Authenticated modes using the switch
              above
            </li>
            <li>
              In Authenticated mode, fill in user details and test the setup
            </li>
            <li>Use the controls to interact with the messenger</li>
            <li>
              <strong>For true anonymous testing:</strong> Click &quot;Clear
              Cookies&quot; then refresh the page
            </li>
            <li>
              <strong>Clear Local Storage:</strong> Remove only localStorage
              items with &quot;intercom&quot; keys
            </li>
            <li>
              Check the activity log to see what actions are being performed
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
