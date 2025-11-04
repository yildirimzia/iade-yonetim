import './globals.css'

export const metadata = {
  title: 'İade Yönetim Sistemi',
  description: 'Bulgaristan merkezli iade ve kargo yönetim platformu',
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
