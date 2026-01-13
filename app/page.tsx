'use client';

import { useState, useEffect, useCallback } from 'react';
import GameBoard from '@/components/GameBoard';
import GameStats from '@/components/GameStats';
import GameOverModal from '@/components/GameOverModal';
import Leaderboard from '@/components/Leaderboard';
import { saveScore, getBaseUser } from '@/lib/baseIntegration';
import { initializeGrid } from '@/lib/gameLogic';

export default function Home() {
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  const handleRestart = useCallback(() => {
    setScore(0);
    setMoves(30);
    setGameOver(false);
    setGameKey(prev => prev + 1);
  }, []);

  const handleScoreChange = useCallback((newScore: number) => {
    setScore(newScore);
  }, []);

  const handleMovesChange = useCallback((delta: number) => {
    setMoves(prev => {
      const newMoves = prev + delta;
      if (newMoves <= 0) {
        setTimeout(() => {
          setGameOver(true);
          // Сохранение счета при окончании игры
          const user = getBaseUser();
          saveScore(score, user || undefined);
        }, 500);
        return 0;
      }
      return newMoves;
    });
  }, [score]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            🎮 Три в ряд
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Соберите три или больше одинаковых камня в ряд!
          </p>
        </div>

        {/* Статистика игры */}
        <GameStats
          score={score}
          moves={moves}
          onRestart={handleRestart}
        />

        {/* Игровое поле */}
        <div className="mb-8">
          <GameBoard
            key={gameKey}
            resetKey={gameKey}
            onScoreChange={handleScoreChange}
            onMovesChange={handleMovesChange}
          />
        </div>

        {/* Инструкции */}
        <div className="max-w-2xl mx-auto mt-8 p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
          <h3 className="text-xl font-semibold mb-4 text-center">📖 Как играть:</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">1.</span>
              <span>Кликните на камень, чтобы выбрать его</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">2.</span>
              <span>Кликните на соседний камень, чтобы поменять их местами</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">3.</span>
              <span>Соберите три или больше одинаковых камня в ряд (горизонтально или вертикально)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">4.</span>
              <span>Камни упадут, и появятся новые - ищите каскадные совпадения!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">5.</span>
              <span>Наберите как можно больше очков за 30 ходов!</span>
            </li>
          </ul>
        </div>

        {/* Модальное окно окончания игры */}
        <GameOverModal
          score={score}
          isOpen={gameOver}
          onRestart={handleRestart}
          onClose={() => setGameOver(false)}
        />

        {/* Таблица лидеров */}
        <Leaderboard />
      </div>
    </main>
  );
}
