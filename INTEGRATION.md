# Инструкция по интеграции Base Mini App

## Пошаговая инструкция

### Шаг 1: Подготовка проекта

1. Убедитесь, что все зависимости установлены:
```bash
npm install
```

2. Проверьте локальный запуск:
```bash
npm run dev
```

### Шаг 2: Деплой на Vercel

1. **Создайте GitHub репозиторий:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Base Mini App"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```

2. **Импортируйте в Vercel:**
   - Перейдите на [vercel.com](https://vercel.com)
   - Нажмите "Add New" → "Project"
   - Импортируйте ваш GitHub репозиторий
   - Нажмите "Deploy"

3. **Настройте переменные окружения:**
   - В настройках проекта Vercel перейдите в "Environment Variables"
   - Добавьте `NEXT_PUBLIC_ROOT_URL` со значением вашего домена (например: `https://your-app.vercel.app`)

### Шаг 3: Отключение Deployment Protection

1. В настройках проекта Vercel перейдите в **Settings** → **Deployment Protection**
2. Отключите "Vercel Authentication"
3. Сохраните изменения

### Шаг 4: Обновление конфигурации

1. Обновите `minikit.config.ts`:
   ```typescript
   const ROOT_URL = process.env.NEXT_PUBLIC_ROOT_URL || 'https://your-app.vercel.app';
   ```

2. Настройте метаданные вашего приложения в `minikitConfig.miniapp`

3. Запушьте изменения:
   ```bash
   git add .
   git commit -m "Update configuration"
   git push
   ```

### Шаг 5: Создание Account Association

1. Перейдите на [Base Build Account Association Tool](https://base.org/build/account-association)

2. Вставьте ваш домен в поле `App URL` (например: `your-app.vercel.app`)

3. Нажмите "Submit"

4. Нажмите "Verify" и следуйте инструкциям

5. Скопируйте объект `accountAssociation`:
   ```json
   {
     "header": "...",
     "payload": "...",
     "signature": "..."
   }
   ```

### Шаг 6: Обновление accountAssociation

1. Обновите `minikit.config.ts`:
   ```typescript
   accountAssociation: {
     "header": "ваш-header",
     "payload": "ваш-payload",
     "signature": "ваша-signature"
   }
   ```

2. Запушьте изменения:
   ```bash
   git add .
   git commit -m "Add account association"
   git push
   ```

### Шаг 7: Проверка приложения

1. Перейдите на [base.dev/preview](https://base.dev/preview)

2. Добавьте URL вашего приложения

3. Проверьте:
   - **Embeds** - отображение превью
   - **Account association** - правильность credentials
   - **Metadata** - все метаданные из manifest

4. Нажмите "Launch" для проверки запуска приложения

### Шаг 8: Публикация

1. Создайте пост в Base app с URL вашего приложения

2. Ваше приложение будет доступно в Base app!

## Проверка manifest

Manifest доступен по адресу:
```
https://your-domain/.well-known/farcaster.json
```

Проверьте, что он возвращает правильный JSON с вашими данными.

## Проверка webhook

Webhook endpoint доступен по адресу:
```
https://your-domain/api/webhook
```

GET запрос должен вернуть:
```json
{
  "status": "ok",
  "message": "Webhook endpoint is active"
}
```

## Устранение проблем

### Manifest не доступен

- Убедитесь, что файл `app/.well-known/farcaster.json/route.ts` существует
- Проверьте, что Next.js правильно обрабатывает этот маршрут
- Проверьте логи Vercel

### Account Association не работает

- Убедитесь, что Deployment Protection отключен
- Проверьте, что домен доступен публично
- Убедитесь, что manifest доступен по правильному пути

### Изображения не загружаются

- Проверьте, что файлы находятся в папке `public/`
- Убедитесь, что пути в `minikit.config.ts` правильные
- Проверьте размеры файлов (они не должны быть слишком большими)

## Дополнительные ресурсы

- [Base Mini Apps Documentation](https://docs.base.org/mini-apps)
- [Base Build](https://base.org/build)
- [Vercel Documentation](https://vercel.com/docs)

