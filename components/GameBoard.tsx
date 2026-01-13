'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  GemType,
  initializeGrid,
  findMatches,
  swapCells,
  canSwap,
  processMatches,
  removeMatchesAndDrop,
} from '@/lib/gameLogic';

interface GameBoardProps {
  onScoreChange: (score: number) => void;
  onMovesChange: (moves: number) => void;
  resetKey?: number;
}

export default function GameBoard({ onScoreChange, onMovesChange, resetKey }: GameBoardProps) {
  const [grid, setGrid] = useState<Grid>(() => initializeGrid());
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [animatingCells, setAnimatingCells] = useState<Set<string>>(new Set());

  // Сброс игры при изменении resetKey
  useEffect(() => {
    if (resetKey !== undefined && resetKey > 0) {
      setGrid(initializeGrid());
      setSelectedCell(null);
      setCurrentScore(0);
      setIsProcessing(false);
      setAnimatingCells(new Set());
    }
  }, [resetKey]);

  // Обновление счетчика
  useEffect(() => {
    onScoreChange(currentScore);
  }, [currentScore, onScoreChange]);

  // Обработка клика по ячейке
  const handleCellClick = useCallback((row: number, col: number) => {
    if (isProcessing || grid[row][col].type === null) return;

    if (selectedCell === null) {
      setSelectedCell({ row, col });
    } else {
      const { row: prevRow, col: prevCol } = selectedCell;
      
      // Проверка возможности обмена
      if (canSwap(grid, prevRow, prevCol, row, col)) {
        setIsProcessing(true);
        
        // Обмен
        let newGrid = swapCells(grid, prevRow, prevCol, row, col);
        setGrid(newGrid);
        setSelectedCell(null);
        onMovesChange(-1); // Уменьшаем количество ходов

        // Обработка совпадений с задержкой для анимации
        setTimeout(() => {
          const matches = findMatches(newGrid);
          if (matches.size > 0) {
            setAnimatingCells(matches);
            
            setTimeout(() => {
              const result = removeMatchesAndDrop(newGrid, matches);
              newGrid = result.newGrid;
              setCurrentScore(prev => prev + result.score);
              setGrid(newGrid);
              setAnimatingCells(new Set());

              // Обработка каскадных совпадений
              setTimeout(() => {
                const cascadeResult = processMatches(newGrid);
                setGrid(cascadeResult.newGrid);
                setCurrentScore(prev => prev + cascadeResult.totalScore);
                setIsProcessing(false);
              }, 500);
            }, 300);
          } else {
            // Отмена обмена, если нет совпадений
            newGrid = swapCells(newGrid, prevRow, prevCol, row, col);
            setGrid(newGrid);
            setIsProcessing(false);
          }
        }, 200);
      } else {
        setSelectedCell({ row, col });
      }
    }
  }, [grid, selectedCell, isProcessing]);

  // Цвета для разных типов камней
  const getGemColor = (type: GemType | null): string => {
    if (!type) return 'bg-gray-800';
    
    const colors: Record<GemType, string> = {
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-400',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
    };
    
    return colors[type];
  };

  // Градиенты для камней
  const getGemGradient = (type: GemType | null): string => {
    if (!type) return '';
    
    const gradients: Record<GemType, string> = {
      red: 'from-red-600 to-red-400',
      blue: 'from-blue-600 to-blue-400',
      green: 'from-green-600 to-green-400',
      yellow: 'from-yellow-500 to-yellow-300',
      purple: 'from-purple-600 to-purple-400',
      orange: 'from-orange-600 to-orange-400',
    };
    
    return gradients[type];
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className="grid grid-cols-8 gap-1 bg-gray-900 p-2 rounded-lg shadow-2xl">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isSelected =
              selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
            const isAnimating = animatingCells.has(`${rowIndex}-${colIndex}`);
            const cellId = `${rowIndex}-${colIndex}`;

            return (
              <button
                key={cellId}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                disabled={isProcessing}
                className={`
                  w-10 h-10 md:w-12 md:h-12 rounded-lg
                  transition-all duration-200
                  ${isSelected ? 'ring-4 ring-yellow-400 scale-110 z-10' : ''}
                  ${isAnimating ? 'animate-pulse scale-125 opacity-50' : ''}
                  ${isProcessing ? 'cursor-wait' : 'cursor-pointer hover:scale-105'}
                  ${cell.type ? `bg-gradient-to-br ${getGemGradient(cell.type)} shadow-lg` : 'bg-gray-800'}
                  border-2 ${isSelected ? 'border-yellow-400' : 'border-gray-700'}
                `}
                style={{
                  boxShadow: cell.type
                    ? `0 4px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)`
                    : undefined,
                }}
              >
                {cell.type && (
                  <div className="w-full h-full rounded-lg flex items-center justify-center">
                    <div
                      className={`w-3/4 h-3/4 rounded-full ${getGemColor(cell.type)} opacity-80`}
                      style={{
                        boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.3)',
                      }}
                    />
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

