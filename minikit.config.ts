// Конфигурация для Base Mini App
// Обновите ROOT_URL после деплоя на Vercel
const ROOT_URL = 'https://three-in-a-row-nine.vercel.app';

export const minikitConfig = {
  accountAssociation: {
    "header": "eyJmaWQiOjExMDg2NzUsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg4OGJlRDE3NzI1ZkViMDA1Yzk5OTFmNzc1QkYxMWE5MEM2RUNmMWU4In0",
    "payload": "eyJkb21haW4iOiJ0aHJlZS1pbi1hLXJvdy1uaW5lLnZlcmNlbC5hcHAifQ",
    "signature": "PU4BCk1/OZRMJ/1tvrNCdDcMEkOPdRKSQt1FKN8R8rwF9IMI9Hj1Ujj5MI2BWtrT09Q5ohQC5ZRsF6d+VDcQvhw="
  },
  miniapp: {
    version: "1",
    name: "Три в ряд", 
    subtitle: "Классическая игра-головоломка", 
    description: "Увлекательная игра три в ряд для Base app! Собирайте камни в ряды, набирайте очки и соревнуйтесь с друзьями. Каскадные совпадения, красивая графика и плавная анимация ждут вас!",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.svg`],
    iconUrl: `${ROOT_URL}/icon.svg`,
    splashImageUrl: `${ROOT_URL}/splash.svg`,
    splashBackgroundColor: "#4c1d95",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "games",
    tags: ["games", "puzzle", "match3", "web3", "base", "entertainment"],
    heroImageUrl: `${ROOT_URL}/hero.svg`, 
    tagline: "Собери три в ряд и победи!",
    ogTitle: "Три в ряд - Игра для Base app",
    ogDescription: "Классическая игра три в ряд с современной графикой и плавной анимацией. Играйте прямо в Base app!",
    ogImageUrl: `${ROOT_URL}/og-image.svg`,
  },
} as const;

