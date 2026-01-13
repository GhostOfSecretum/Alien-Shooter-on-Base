# 🚀 Автоматический деплой - Пошаговая инструкция

## Шаг 1: Инициализация Git (если еще не сделано)

```bash
cd my-project
git init
git add .
git commit -m "Initial commit: Base Mini App - Три в ряд"
```

## Шаг 2: Создание GitHub репозитория

1. Перейдите на [github.com](https://github.com) и войдите в аккаунт
2. Нажмите "New repository"
3. Название: `base-mini-app-match3` (или любое другое)
4. **НЕ** создавайте README, .gitignore или license (они уже есть)
5. Нажмите "Create repository"

## Шаг 3: Подключение к GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**Замените `YOUR_USERNAME` и `YOUR_REPO_NAME` на ваши данные!**

## Шаг 4: Деплой на Vercel

1. Перейдите на [vercel.com](https://vercel.com) и войдите (можно через GitHub)
2. Нажмите "Add New" → "Project"
3. Импортируйте ваш репозиторий
4. Настройки:
   - Framework Preset: **Next.js** (определится автоматически)
   - Root Directory: `./` (по умолчанию)
   - Build Command: `npm run build` (по умолчанию)
   - Output Directory: `.next` (по умолчанию)
5. Нажмите "Deploy"

## Шаг 5: Настройка переменных окружения

После деплоя:

1. В настройках проекта Vercel перейдите в **Settings** → **Environment Variables**
2. Добавьте переменную:
   - **Name**: `NEXT_PUBLIC_ROOT_URL`
   - **Value**: `https://your-app-name.vercel.app` (ваш URL из Vercel)
3. Нажмите "Save"
4. Перейдите в **Deployments** и нажмите "Redeploy" для последнего деплоя

## Шаг 6: Отключение Deployment Protection

1. В настройках проекта Vercel: **Settings** → **Deployment Protection**
2. Отключите "Vercel Authentication"
3. Сохраните изменения

## Шаг 7: Обновление конфигурации

После получения URL от Vercel, обновите `minikit.config.ts`:

```typescript
const ROOT_URL = process.env.NEXT_PUBLIC_ROOT_URL || 'https://your-app-name.vercel.app';
```

Запушьте изменения:

```bash
git add minikit.config.ts
git commit -m "Update ROOT_URL"
git push
```

## Шаг 8: Account Association

1. Перейдите на [base.org/build/account-association](https://base.org/build/account-association)
2. Вставьте ваш домен (например: `your-app-name.vercel.app`)
3. Нажмите "Submit"
4. Нажмите "Verify" и следуйте инструкциям
5. Скопируйте объект `accountAssociation`

## Шаг 9: Обновление accountAssociation

Обновите `minikit.config.ts`:

```typescript
accountAssociation: {
  "header": "ваш-header",
  "payload": "ваш-payload",
  "signature": "ваша-signature"
}
```

Запушьте:

```bash
git add minikit.config.ts
git commit -m "Add account association"
git push
```

## Шаг 10: Проверка

1. Перейдите на [base.dev/preview](https://base.dev/preview)
2. Добавьте URL вашего приложения
3. Проверьте все вкладки:
   - **Embeds** - превью приложения
   - **Account association** - credentials
   - **Metadata** - метаданные
4. Нажмите "Launch" для тестирования

## Шаг 11: Публикация

Создайте пост в Base app с URL вашего приложения!

---

## ⚡ Быстрая команда для всех шагов Git

```bash
# В директории my-project
git init
git add .
git commit -m "Initial commit: Base Mini App - Три в ряд"
# Затем добавьте remote и push (см. шаг 3)
```

## 🎨 Изображения

Пока используйте placeholder изображения из папки `public/`. Позже их можно заменить на реальные скриншоты игры.

## ✅ Чеклист готовности

- [ ] Git репозиторий создан
- [ ] Код запушен на GitHub
- [ ] Деплой на Vercel выполнен
- [ ] Переменная окружения `NEXT_PUBLIC_ROOT_URL` установлена
- [ ] Deployment Protection отключен
- [ ] Account Association создан
- [ ] `minikit.config.ts` обновлен
- [ ] Приложение проверено на base.dev/preview
- [ ] Пост создан в Base app

Готово! 🎉

