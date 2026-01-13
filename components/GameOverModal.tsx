'use client';

interface GameOverModalProps {
  score: number;
  isOpen: boolean;
  onRestart: () => void;
  onClose: () => void;
}

export default function GameOverModal({ score, isOpen, onRestart, onClose }: GameOverModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl p-8 max-w-md w-full border-2 border-white/20 shadow-2xl">
        <div className="text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="text-3xl font-bold mb-2 text-white">Игра окончена!</h2>
          <p className="text-xl text-gray-300 mb-6">Ваш финальный счет:</p>
          <div className="text-5xl font-bold text-yellow-400 mb-8">{score}</div>
          
          <div className="flex gap-4">
            <button
              onClick={onRestart}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
            >
              🔄 Играть снова
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg font-semibold hover:from-gray-700 hover:to-gray-800 transition-all transform hover:scale-105 shadow-lg"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

