import type { Metadata } from 'next';
import { minikitConfig } from '@/minikit.config';
import BaseMeta from './components/BaseMeta';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: minikitConfig.miniapp.name,
    description: minikitConfig.miniapp.description,
    openGraph: {
      title: minikitConfig.miniapp.ogTitle || minikitConfig.miniapp.name,
      description: minikitConfig.miniapp.ogDescription || minikitConfig.miniapp.description,
      images: [minikitConfig.miniapp.ogImageUrl],
    },
    other: {
      'fc:miniapp': JSON.stringify({
        version: 'next',
        imageUrl: minikitConfig.miniapp.ogImageUrl,
        button: {
          title: `Открыть ${minikitConfig.miniapp.name}`,
          action: {
            type: 'launch_miniapp',
            name: minikitConfig.miniapp.name,
            url: minikitConfig.miniapp.homeUrl,
            splashImageUrl: minikitConfig.miniapp.splashImageUrl,
            splashBackgroundColor: minikitConfig.miniapp.splashBackgroundColor,
          },
        },
      }),
      'base:app_id': '69669e6abc744612f97d61d4',
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <BaseMeta />
        {children}
      </body>
    </html>
  );
}

