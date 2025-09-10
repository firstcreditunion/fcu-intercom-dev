import IntercomDemo from '../components/IntercomDemo'

export default function Home() {
  return (
    <div className='font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-white'>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-8'>
          <IntercomDemo />
        </div>
      </div>
    </div>
  )
}
