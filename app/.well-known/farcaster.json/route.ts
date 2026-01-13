import { NextResponse } from 'next/server';
import { minikitConfig } from '@/minikit.config';

// Генерирует manifest для Base Mini App
export async function GET() {
  const manifest = {
    accountAssociation: minikitConfig.accountAssociation,
    ...minikitConfig.miniapp,
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

