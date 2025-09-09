import IntercomDemo from '../components/IntercomDemo'

export default function Home() {
  return (
    <div className='font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-center mb-8'>
          FCU Chatbot Test Environment
        </h1>

        <div className='mb-8'>
          <IntercomDemo />
        </div>

        <div className='text-center text-gray-600'>
          <p>
            The Intercom widget should appear in the bottom-right corner of your
            screen.
          </p>
          <p className='mt-2'>
            If you don&apos;t see it, check the setup instructions in
            INTERCOM_SETUP.md
          </p>
        </div>
      </div>
    </div>
  )
}
