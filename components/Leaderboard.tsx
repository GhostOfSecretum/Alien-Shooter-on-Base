'use client';

import { useState, useEffect } from 'react';
import { getLeaderboard } from '@/lib/baseIntegration';

interface LeaderboardEntry {
  score: number;
  address?: string;
  timestamp: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLeaderboard(getLeaderboard());
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg z-40"
      >
        🏆 Таблица лидеров
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-2xl p-8 max-w-md w-full border-2 border-white/20 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">🏆 Таблица лидеров</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-2xl hover:text-gray-400 transition-colors"
          >
            ✕
          </button>
        </div>
        
        {leaderboard.length === 0 ? (
          <p className="text-center text-gray-400 py-8">
            Пока нет результатов. Будьте первым!
          </p>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white/10 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                  </span>
                  <div>
                    <div className="font-semibold text-yellow-400">{entry.score} очков</div>
                    {entry.address && (
                      <div className="text-sm text-gray-400">
                        {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

