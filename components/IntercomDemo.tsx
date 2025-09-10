'use client'

import { useState, useEffect } from 'react'

interface IntercomMessage {
  timestamp: string
  type: 'info' | 'error' | 'action'
  message: string
  data?: unknown
}

/**
 * Demo component showing Intercom SDK integration
 */
export default function IntercomDemo() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [messages, setMessages] = useState<IntercomMessage[]>([])
  const [userMode, setUserMode] = useState<'anonymous' | 'authenticated'>(
    'anonymous'
  )

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
        addMessage('info', 'Intercom SDK loaded successfully')
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
  }, [])

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

  const updateUser = () => {
    if (window.Intercom) {
      const userData = {
        name: 'Demo User',
        email: 'demo@fcu.edu',
        user_id: 'demo_user_123',
        created_at: Math.floor(Date.now() / 1000),
        custom_attributes: {
          role: 'Student',
          department: 'Computer Science',
        },
      }

      window.Intercom('update', userData)
      addMessage('action', 'User data updated', userData)
      setUserMode('authenticated')
    }
  }

  const shutdown = () => {
    if (window.Intercom) {
      window.Intercom('shutdown')
      addMessage('action', 'Intercom shutdown')
      setUserMode('anonymous')
    }
  }

  return (
    <div className='space-y-6 p-6 bg-gray-50 rounded-lg'>
      <div className='text-center'>
        <h2 className='text-2xl font-bold mb-2 text-fcu-primary-500'>
          FCU Intercom Integration Test
        </h2>
        <p className='text-fcu-secondary-300'>
          Official Intercom Messenger SDK Integration
        </p>
      </div>

      {/* Status Section */}
      <div className='p-4 bg-white rounded-xl shadow-sm border'>
        <div className='flex justify-between items-center mb-3'>
          <h3 className='font-semibold text-fcu-primary-500'>
            Integration Status
          </h3>
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
            <span className='ml-2 font-medium text-black'>
              @intercom/messenger-js-sdk
            </span>
          </div>
          <div>
            <span className='text-gray-500'>User Mode:</span>
            <span
              className={`ml-2 font-medium ${
                userMode === 'authenticated' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              {userMode === 'authenticated' ? 'Authenticated' : 'Anonymous'}
            </span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      {isLoaded && (
        <div className='p-4 bg-white rounded-xl shadow-sm border'>
          <h3 className='font-semibold mb-4 text-gray-800'>
            🎛️ Messenger Controls
          </h3>

          <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
            <button
              onClick={showMessenger}
              className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors text-sm cursor-pointer hover:shadow-2xl'
            >
              Show Messenger
            </button>

            <button
              onClick={hideMessenger}
              className='px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition-colors text-sm cursor-pointer hover:shadow-2xl'
            >
              Hide Messenger
            </button>

            <button
              onClick={showMessages}
              className='px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors text-sm cursor-pointer hover:shadow-2xl'
            >
              Show Messages
            </button>

            <button
              onClick={() => showNewMessage('Hello! I need help with...')}
              className='px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full transition-colors text-sm cursor-pointer hover:shadow-2xl'
            >
              New Message
            </button>

            <button
              onClick={updateUser}
              className='px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors text-sm cursor-pointer hover:shadow-2xl'
            >
              Login as Demo User
            </button>

            <button
              onClick={shutdown}
              className='px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors text-sm cursor-pointer hover:shadow-2xl'
            >
              Shutdown
            </button>
          </div>
        </div>
      )}

      {/* Activity Log */}
      <div className='p-4 bg-white rounded-xl shadow-sm border'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='font-semibold text-gray-800'>
            📋 Activity Log ({messages.length})
          </h3>
          <button
            onClick={() => setMessages([])}
            className='px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 transition-colors'
          >
            Clear
          </button>
        </div>

        <div className='max-h-64 overflow-y-auto space-y-2'>
          {messages.length === 0 ? (
            <p className='text-sm text-gray-500 italic text-center py-4'>
              No activity yet. Try using the controls above.
            </p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg text-sm border-1 mb-2 ${
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
                  <span className='text-gray-500 text-xs'>{msg.timestamp}</span>
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
      </div>

      {/* Instructions */}
      <div className='p-4 bg-blue-50 rounded-xl border border-blue-200'>
        <h3 className='font-semibold mb-2 text-blue-800'>💡 Instructions</h3>
        <ul className='text-sm text-blue-700 space-y-1 list-disc list-inside'>
          <li>
            The Intercom messenger should appear in the bottom-right corner
          </li>
          <li>Use the controls above to interact with the messenger</li>
          <li>Try logging in as a demo user to see authenticated features</li>
          <li>
            Check the activity log to see what actions are being performed
          </li>
        </ul>
      </div>
    </div>
  )
}
