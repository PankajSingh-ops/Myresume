import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'MyResume – AI-Powered Resume Builder',
    template: '%s | MyResume',
  },
  description:
    'Build professional, ATS-friendly resumes with AI-powered suggestions. Export polished PDFs in minutes.',
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: 'MyResume – AI-Powered Resume Builder',
    description:
      'Create ATS-friendly resumes with AI suggestions. Beautiful templates, PDF export, and public sharing.',
    type: 'website',
    siteName: 'MyResume',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyResume – AI-Powered Resume Builder',
    description:
      'Create ATS-friendly resumes with AI suggestions. Beautiful templates, PDF export, and public sharing.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
