import type { Metadata } from 'next';
import { minikitConfig } from '@/minikit.config';
import './globals.css';

export const metadata: Metadata = {
  title: minikitConfig.miniapp.name,
  description: minikitConfig.miniapp.description,
  openGraph: {
    title: minikitConfig.miniapp.ogTitle || minikitConfig.miniapp.name,
    description: minikitConfig.miniapp.ogDescription || minikitConfig.miniapp.description,
    images: [minikitConfig.miniapp.ogImageUrl],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const embedMetadata = {
    version: "next",
    imageUrl: minikitConfig.miniapp.ogImageUrl,
    button: {
      title: "Открыть игру",
      action: {
        type: "launch_frame" as const,
        url: minikitConfig.miniapp.homeUrl,
        name: minikitConfig.miniapp.name,
        splashImageUrl: minikitConfig.miniapp.splashImageUrl,
        splashBackgroundColor: minikitConfig.miniapp.splashBackgroundColor,
      },
    },
  };

  return (
    <html lang="ru">
      <head>
        <meta
          name="fc:miniapp"
          content={JSON.stringify(embedMetadata)}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

