// Интеграция с Base app
// Этот файл содержит функции для работы с Base app API

export interface BaseUser {
  address?: string;
  fid?: number;
  username?: string;
}

// Получение информации о пользователе из контекста Base app
export function getBaseUser(): BaseUser | null {
  if (typeof window === 'undefined') return null;
  
  // В Base app контекст доступен через window
  const baseContext = (window as any).base;
  
  if (baseContext?.user) {
    return baseContext.user;
  }
  
  return null;
}

// Сохранение счета пользователя (можно расширить для работы с API)
export async function saveScore(score: number, user?: BaseUser): Promise<boolean> {
  try {
    // Здесь можно добавить вызов API для сохранения счета
    // Например, отправка на ваш backend или использование Base app API
    
    if (user?.address) {
      // Пример: сохранение счета в localStorage (временное решение)
      const scores = JSON.parse(localStorage.getItem('gameScores') || '[]');
      scores.push({
        score,
        address: user.address,
        timestamp: Date.now(),
      });
      localStorage.setItem('gameScores', JSON.stringify(scores));
    }
    
    return true;
  } catch (error) {
    console.error('Error saving score:', error);
    return false;
  }
}

// Получение лучших результатов
export function getLeaderboard(): Array<{ score: number; address?: string; timestamp: number }> {
  try {
    const scores = JSON.parse(localStorage.getItem('gameScores') || '[]');
    return scores.sort((a: any, b: any) => b.score - a.score).slice(0, 10);
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
}

// Отправка уведомления через webhook (если настроено)
export async function sendNotification(message: string, user?: BaseUser): Promise<boolean> {
  try {
    // Здесь можно добавить вызов webhook для отправки уведомлений
    // const response = await fetch('/api/webhook', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ message, user }),
    // });
    // return response.ok;
    
    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
}

