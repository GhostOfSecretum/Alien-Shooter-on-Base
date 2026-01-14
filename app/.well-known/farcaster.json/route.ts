import { NextResponse } from 'next/server';
import { minikitConfig } from '@/minikit.config';

// Генерирует manifest для Base Mini App
export async function GET() {
  const manifest = {
    accountAssociation: minikitConfig.accountAssociation,
    // Обязательные поля (в правильном порядке)
    version: minikitConfig.miniapp.version,
    name: minikitConfig.miniapp.name,
    iconUrl: minikitConfig.miniapp.iconUrl,
    homeUrl: minikitConfig.miniapp.homeUrl,
    splashImageUrl: minikitConfig.miniapp.splashImageUrl,
    splashBackgroundColor: minikitConfig.miniapp.splashBackgroundColor,
    primaryCategory: minikitConfig.miniapp.primaryCategory,
    tags: minikitConfig.miniapp.tags,
    // Дополнительные поля
    subtitle: minikitConfig.miniapp.subtitle,
    description: minikitConfig.miniapp.description,
    screenshotUrls: minikitConfig.miniapp.screenshotUrls,
    webhookUrl: minikitConfig.miniapp.webhookUrl,
    heroImageUrl: minikitConfig.miniapp.heroImageUrl,
    tagline: minikitConfig.miniapp.tagline,
    ogTitle: minikitConfig.miniapp.ogTitle,
    ogDescription: minikitConfig.miniapp.ogDescription,
    ogImageUrl: minikitConfig.miniapp.ogImageUrl,
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

