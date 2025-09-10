import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import IntercomWrapper from '../components/IntercomWrapper'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Intercom | FCU Chatbot Dev',
  description: 'Intercom | FCU Chatbot Dev',
}

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${poppins.className} antialiased`}>
        <Header />
        <IntercomWrapper>{children}</IntercomWrapper>
      </body>
    </html>
  )
}
