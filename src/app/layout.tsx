import "@theme/globals.css";

import { Inter } from 'next/font/google'
import { TensorFlowProvider } from '@providers/tensorflow';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Body tracking app',
  description: 'Aplicação de rastreamento corporal usando TensorFlow.js e PoseNet',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <TensorFlowProvider>
          {children}
        </TensorFlowProvider>
      </body>
    </html>
  )
}
