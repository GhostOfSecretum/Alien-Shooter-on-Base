'use client';

import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export default function BaseMeta() {
  useEffect(() => {
    // Вызываем ready() чтобы скрыть splash screen и показать приложение
    // Это обязательно согласно документации Base
    sdk.actions.ready().catch((error) => {
      // Игнорируем ошибки если SDK не загружен (например, при локальной разработке)
      if (process.env.NODE_ENV === 'development') {
        console.log('SDK not available in development mode');
      }
    });
  }, []);

  return null;
}

