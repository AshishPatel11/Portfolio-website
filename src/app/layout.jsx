import './globals.css';

export const metadata = {
  metadataBase: new URL('https://ashish-patel.dev'),

  title: {
    default: 'Ashish Patel — Full-Stack Engineer',
    template: '%s | Ashish Patel',
  },
  description:
    'Full-stack engineer with 2+ years shipping production SaaS. Built Guidy (WCAG accessibility platform) and Custama (AI chatbot SaaS) end-to-end. React, Next.js, Node.js, TypeScript, AWS. Open to full-stack and backend roles — remote or relocation.',
  keywords: [
    'Ashish Patel',
    'Full-Stack Engineer',
    'React Developer',
    'Next.js Developer',
    'Node.js',
    'TypeScript',
    'AWS',
    'SaaS Developer',
    'WCAG Accessibility',
    'AI Chatbot',
    'Portfolio',
    'Ahmedabad',
    'India',
    'Remote Developer',
    'Backend Engineer',
  ],
  authors: [{ name: 'Ashish Patel', url: 'https://ashish-patel.dev' }],
  creator: 'Ashish Patel',

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ashish-patel.dev',
    siteName: 'Ashish Patel',
    title: 'Ashish Patel — Full-Stack Engineer',
    description:
      'Full-stack engineer with 2+ years shipping production SaaS. React, Next.js, Node.js, TypeScript, AWS. Open to full-stack and backend roles.',
    images: [
      {
        url: '/ashish-patel-OG.png',
        width: 1903,
        height: 907,
        alt: 'Ashish Patel — Full-Stack Engineer Portfolio',
        type: 'image/png',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Ashish Patel — Full-Stack Engineer',
    description:
      'Full-stack engineer with 2+ years shipping production SaaS. React, Next.js, Node.js, TypeScript, AWS.',
    images: ['/ashish-patel-OG.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: 'https://ashish-patel.dev',
  },

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
