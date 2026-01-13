'use client';

interface GameStatsProps {
  score: number;
  moves: number;
  onRestart: () => void;
}

export default function GameStats({ score, moves, onRestart }: GameStatsProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 p-4 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-yellow-400">⭐ {score}</div>
          <div className="text-sm text-gray-300">Счет</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-blue-400">🎯 {moves}</div>
          <div className="text-sm text-gray-300">Ходы</div>
        </div>
      </div>
      
      <button
        onClick={onRestart}
        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
      >
        🔄 Новая игра
      </button>
    </div>
  );
}

