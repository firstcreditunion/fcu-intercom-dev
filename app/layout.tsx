import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import IntercomWrapper from '../components/IntercomWrapper'
import Header from '@/components/Header'
import Script from 'next/script'

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(c,o,v,i,e,w){c[v]=c[v]||function(){(c[v].a=c[v].a||[]).push(arguments)};var s=o.createElement(i);s.src=e;s.async=1;var h=o.getElementsByTagName(i)[0];h.parentNode.insertBefore(s,h);c.addEventListener('error',function(err){c[v]('error',err)});c.addEventListener('message',function(msg){c[v]('message',msg)})})(window,document,'coview','script','https://cdn.coview.com/coview.js');
coview('start', {
  projectKey:'7r6Bv56bi6A'
});
            `,
          }}
        />
      </head>
      <body className={`${poppins.className} antialiased`}>
        <Header />
        <IntercomWrapper>{children}</IntercomWrapper>
      </body>
    </html>
  )
}
