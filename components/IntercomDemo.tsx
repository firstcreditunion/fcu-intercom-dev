'use client'

import { useIntercom } from '../hooks/useIntercom'

/**
 * Demo component showing how to interact with Intercom programmatically
 */
export default function IntercomDemo() {
  const { isLoaded, show, hide, showMessages, showNewMessage, boot, shutdown } =
    useIntercom()

  const handleBootWithUser = () => {
    // Example of booting Intercom with user data
    boot({
      api_base: 'https://api-iam.au.intercom.io',
      app_id: process.env.NEXT_PUBLIC_INTERCOM_WORKSPACE_ID || '',
      user_id: 'demo-user-123',
      name: 'Demo User',
      email: 'demo@example.com',
      created_at: Math.floor(Date.now() / 1000), // Current timestamp
    })
  }

  const handleShowNewMessageWithText = () => {
    showNewMessage('Hello! I have a question about your service.')
  }

  return (
    <div className='space-y-4 p-6 bg-gray-50 rounded-lg'>
      <h2 className='text-xl font-bold mb-4'>Intercom Integration Demo</h2>

      <div className='mb-4'>
        <p className='text-sm text-gray-600'>
          Status:{' '}
          <span
            className={`font-semibold ${
              isLoaded ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isLoaded ? 'Loaded' : 'Loading...'}
          </span>
        </p>
      </div>

      <div className='grid grid-cols-2 gap-3'>
        <button
          onClick={show}
          disabled={!isLoaded}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50'
        >
          Show Widget
        </button>

        <button
          onClick={hide}
          disabled={!isLoaded}
          className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50'
        >
          Hide Widget
        </button>

        <button
          onClick={showMessages}
          disabled={!isLoaded}
          className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50'
        >
          Show Messages
        </button>

        <button
          onClick={handleShowNewMessageWithText}
          disabled={!isLoaded}
          className='px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50'
        >
          New Message
        </button>

        <button
          onClick={handleBootWithUser}
          disabled={!isLoaded}
          className='px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50'
        >
          Boot with User
        </button>

        <button
          onClick={shutdown}
          disabled={!isLoaded}
          className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50'
        >
          Shutdown
        </button>
      </div>

      <div className='mt-6 p-4 bg-blue-50 rounded'>
        <h3 className='font-semibold mb-2'>Instructions:</h3>
        <ol className='text-sm space-y-1 list-decimal list-inside'>
          <li>Look for the Intercom widget in the bottom-right corner</li>
          <li>Use the buttons above to control the widget</li>
          <li>Try sending a test message</li>
          <li>Check the browser console for any errors</li>
        </ol>
      </div>

      <div className='mt-4 p-4 bg-yellow-50 rounded'>
        <h3 className='font-semibold mb-2'>⚠️ Setup Required:</h3>
        <p className='text-sm'>
          Make sure to create a{' '}
          <code className='bg-gray-200 px-1 rounded'>.env.local</code> file with
          your Intercom Workspace ID. See{' '}
          <code className='bg-gray-200 px-1 rounded'>INTERCOM_SETUP.md</code>{' '}
          for details.
        </p>
      </div>
    </div>
  )
}
