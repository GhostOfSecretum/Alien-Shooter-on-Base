// Скрипт для создания placeholder изображений
// Использует canvas для генерации простых изображений

const fs = require('fs');
const path = require('path');

// Создаем простые SVG изображения как placeholder
const publicDir = path.join(__dirname, '..', 'public');

// Создаем директорию если её нет
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Иконка приложения (512x512)
const iconSvg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#EC4899;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="url(#iconGrad)"/>
  <text x="256" y="300" font-family="Arial" font-size="200" font-weight="bold" text-anchor="middle" fill="white">🎮</text>
</svg>`;

// Hero изображение (1200x630)
const heroSvg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#7C3AED;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#EC4899;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#heroGrad)"/>
  <text x="600" y="300" font-family="Arial" font-size="120" font-weight="bold" text-anchor="middle" fill="white">Три в ряд</text>
  <text x="600" y="380" font-family="Arial" font-size="40" text-anchor="middle" fill="rgba(255,255,255,0.9)">Классическая игра для Base app</text>
</svg>`;

// Splash screen (1080x1920)
const splashSvg = `<svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="splashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1E1B4B;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#581C87;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1080" height="1920" fill="url(#splashGrad)"/>
  <text x="540" y="900" font-family="Arial" font-size="200" font-weight="bold" text-anchor="middle" fill="white">🎮</text>
  <text x="540" y="1100" font-family="Arial" font-size="80" font-weight="bold" text-anchor="middle" fill="white">Три в ряд</text>
</svg>`;

// Screenshot (1080x1920)
const screenshotSvg = `<svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <rect width="1080" height="1920" fill="#1F2937"/>
  <text x="540" y="960" font-family="Arial" font-size="60" text-anchor="middle" fill="white">Игровое поле</text>
  <text x="540" y="1050" font-family="Arial" font-size="40" text-anchor="middle" fill="rgba(255,255,255,0.7)">Скриншот игры</text>
</svg>`;

// OG Image (1200x630)
const ogImageSvg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ogGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366F1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#EC4899;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#ogGrad)"/>
  <text x="600" y="280" font-family="Arial" font-size="100" font-weight="bold" text-anchor="middle" fill="white">🎮 Три в ряд</text>
  <text x="600" y="360" font-family="Arial" font-size="35" text-anchor="middle" fill="rgba(255,255,255,0.9)">Классическая игра-головоломка для Base app</text>
</svg>`;

// Сохраняем файлы
console.log('📸 Создаем placeholder изображения...');

fs.writeFileSync(path.join(publicDir, 'icon.svg'), iconSvg);
fs.writeFileSync(path.join(publicDir, 'hero.svg'), heroSvg);
fs.writeFileSync(path.join(publicDir, 'splash.svg'), splashSvg);
fs.writeFileSync(path.join(publicDir, 'screenshot-portrait.svg'), screenshotSvg);
fs.writeFileSync(path.join(publicDir, 'og-image.svg'), ogImageSvg);

console.log('✅ Placeholder изображения созданы!');
console.log('📝 Примечание: SVG файлы созданы как временные. Замените их на PNG/JPG изображения перед финальным деплоем.');

