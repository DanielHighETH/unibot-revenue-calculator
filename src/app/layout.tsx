import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from './components/navbar'
import Footer from './components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Unibot Revenue Calculator',
  description: 'The Unibot Revenue Calculator, created by DanielHigh, is a powerful tool that is calculating potential revenue from $Unibot. Uncover your earning potential today.',
  keywords: ['Unibot', 'Revenue Calculator', 'Profit Optimization', '$Unibot', 'Financial Management', 'Income Prediction'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="mx-auto flex h-full min-h-screen max-w-6xl flex-col px-4 py-8 dark:bg-black dark:text-zinc-200 md:px-8">
      <Navbar /> 
        {children}
      <Footer />
        </body>
    </html>
  )
}
