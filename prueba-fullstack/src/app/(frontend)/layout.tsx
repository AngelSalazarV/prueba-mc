import React from 'react'
import './styles.css'
import { SessionProvider } from './lib/useSession'

export const metadata = {
  description: 'App Fullstack con Payload CMS',
  title: 'Prueba Fullstack',
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>
          <SessionProvider>
            {children}
          </SessionProvider>
        </main>
      </body>
    </html>
  )
}