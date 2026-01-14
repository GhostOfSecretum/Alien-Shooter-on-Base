// Скрипт для проверки embed metadata
// Запустите после деплоя: node scripts/check-embed-meta.js

const https = require('https');
const { minikitConfig } = require('../minikit.config.ts');

const URL = 'https://three-in-a-row-nine.vercel.app';

console.log('🔍 Проверка embed metadata для Base app...\n');

// Проверяем что embed metadata правильно настроен
const expectedEmbedMeta = {
  version: "next",
  imageUrl: minikitConfig.miniapp.ogImageUrl,
  button: {
    title: "Открыть игру",
    action: {
      type: "launch_frame",
      url: minikitConfig.miniapp.homeUrl,
      name: minikitConfig.miniapp.name,
      splashImageUrl: minikitConfig.miniapp.splashImageUrl,
      splashBackgroundColor: minikitConfig.miniapp.splashBackgroundColor,
    },
  },
};

console.log('✅ Ожидаемый embed metadata:');
console.log(JSON.stringify(expectedEmbedMeta, null, 2));
console.log('\n📋 Инструкция для проверки в браузере:');
console.log('1. Откройте:', URL);
console.log('2. Откройте консоль браузера (F12)');
console.log('3. Выполните:');
console.log('   document.querySelector(\'meta[name="fc:miniapp"]\')');
console.log('\n4. Должен вернуться meta тег с content:');
console.log(JSON.stringify(expectedEmbedMeta));

