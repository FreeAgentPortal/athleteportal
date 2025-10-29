import type { Metadata } from 'next';
import { Roboto_Condensed } from 'next/font/google';
import './globals.css';
import '@/styles/imageViewerModal.css';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import '@ant-design/v5-patch-for-react-19';
import AppWrapper from '@/layout/appWrapper/AppWrapper';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Suspense } from 'react';

const roboto = Roboto_Condensed({
  variable: '--font-roboto',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Athlete | Free Agent Portal',
  description: 'Athlete portal',
  openGraph: {
    title: 'Athlete | Free Agent Portal',
    description: 'Log in or register to access your profile on the Free Agent Portal.',
    url: 'https://athlete.freeagentportal.com',
    siteName: 'Free Agent Portal',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Free Agent Portal Auth',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Athlete | Free Agent Portal',
    description: 'Log in or sign up for the Free Agent Portal.',
    images: ['/images/og-default.jpg'],
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <ReactQueryProvider>
            <AppWrapper>
              <AntdRegistry>{children}</AntdRegistry>
            </AppWrapper>
          </ReactQueryProvider>
        </Suspense>
      </body>
    </html>
  );
}
