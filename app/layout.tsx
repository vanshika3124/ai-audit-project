import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Credex AI Audit | Recover 40% of AI Spend',
  description: 'Calculate your AI tool leakage and optimize your stack in 2 minutes.',
  openGraph: {
    title: 'Credex AI Audit',
    description: 'I just optimized my AI stack. Can you?',
    images: ['/favicon.ico'], 
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}