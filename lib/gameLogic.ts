// Игровая логика для игры "Три в ряд"

export type GemType = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';
export type Cell = { type: GemType | null; id: string };
export type Grid = Cell[][];

const GEM_TYPES: GemType[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
const GRID_SIZE = 8;

// Генерация случайного типа камня
export function getRandomGemType(): GemType {
  return GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)];
}

// Создание пустой сетки
export function createEmptyGrid(): Grid {
  return Array(GRID_SIZE).fill(null).map((_, row) =>
    Array(GRID_SIZE).fill(null).map((_, col) => ({
      type: null,
      id: `${row}-${col}`,
    }))
  );
}

// Инициализация сетки без начальных совпадений
export function initializeGrid(): Grid {
  const grid = createEmptyGrid();
  
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      let gemType = getRandomGemType();
      
      // Проверка на начальные совпадения
      while (
        (row >= 2 && grid[row - 1][col].type === gemType && grid[row - 2][col].type === gemType) ||
        (col >= 2 && grid[row][col - 1].type === gemType && grid[row][col - 2].type === gemType)
      ) {
        gemType = getRandomGemType();
      }
      
      grid[row][col].type = gemType;
    }
  }
  
  return grid;
}

// Поиск совпадений
export function findMatches(grid: Grid): Set<string> {
  const matches = new Set<string>();
  
  // Проверка горизонтальных совпадений
  for (let row = 0; row < GRID_SIZE; row++) {
    let count = 1;
    let currentType = grid[row][0].type;
    
    for (let col = 1; col < GRID_SIZE; col++) {
      if (grid[row][col].type === currentType && currentType !== null) {
        count++;
      } else {
        if (count >= 3 && currentType !== null) {
          for (let i = col - count; i < col; i++) {
            matches.add(`${row}-${i}`);
          }
        }
        count = 1;
        currentType = grid[row][col].type;
      }
    }
    
    if (count >= 3 && currentType !== null) {
      for (let i = GRID_SIZE - count; i < GRID_SIZE; i++) {
        matches.add(`${row}-${i}`);
      }
    }
  }
  
  // Проверка вертикальных совпадений
  for (let col = 0; col < GRID_SIZE; col++) {
    let count = 1;
    let currentType = grid[0][col].type;
    
    for (let row = 1; row < GRID_SIZE; row++) {
      if (grid[row][col].type === currentType && currentType !== null) {
        count++;
      } else {
        if (count >= 3 && currentType !== null) {
          for (let i = row - count; i < row; i++) {
            matches.add(`${i}-${col}`);
          }
        }
        count = 1;
        currentType = grid[row][col].type;
      }
    }
    
    if (count >= 3 && currentType !== null) {
      for (let i = GRID_SIZE - count; i < GRID_SIZE; i++) {
        matches.add(`${i}-${col}`);
      }
    }
  }
  
  return matches;
}

// Удаление совпадений и падение камней
export function removeMatchesAndDrop(grid: Grid, matches: Set<string>): { newGrid: Grid; score: number } {
  const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
  let score = matches.size * 10;
  
  // Удаление совпадений
  matches.forEach(id => {
    const [row, col] = id.split('-').map(Number);
    newGrid[row][col].type = null;
  });
  
  // Падение камней
  for (let col = 0; col < GRID_SIZE; col++) {
    let writeIndex = GRID_SIZE - 1;
    
    for (let row = GRID_SIZE - 1; row >= 0; row--) {
      if (newGrid[row][col].type !== null) {
        if (writeIndex !== row) {
          newGrid[writeIndex][col].type = newGrid[row][col].type;
          newGrid[row][col].type = null;
        }
        writeIndex--;
      }
    }
    
    // Заполнение пустых ячеек новыми камнями
    while (writeIndex >= 0) {
      newGrid[writeIndex][col].type = getRandomGemType();
      writeIndex--;
    }
  }
  
  return { newGrid, score };
}

// Проверка возможности хода
export function canSwap(
  grid: Grid,
  row1: number,
  col1: number,
  row2: number,
  col2: number
): boolean {
  // Проверка границ
  if (
    row1 < 0 || row1 >= GRID_SIZE ||
    col1 < 0 || col1 >= GRID_SIZE ||
    row2 < 0 || row2 >= GRID_SIZE ||
    col2 < 0 || col2 >= GRID_SIZE
  ) {
    return false;
  }
  
  // Проверка соседства (должны быть соседними по горизонтали или вертикали)
  const rowDiff = Math.abs(row1 - row2);
  const colDiff = Math.abs(col1 - col2);
  if (rowDiff + colDiff !== 1) {
    return false;
  }
  
  // Создание временной сетки для проверки
  const tempGrid = grid.map(row => row.map(cell => ({ ...cell })));
  const temp = tempGrid[row1][col1].type;
  tempGrid[row1][col1].type = tempGrid[row2][col2].type;
  tempGrid[row2][col2].type = temp;
  
  // Проверка на совпадения после обмена
  const matches = findMatches(tempGrid);
  return matches.size > 0;
}

// Обмен двух камней
export function swapCells(
  grid: Grid,
  row1: number,
  col1: number,
  row2: number,
  col2: number
): Grid {
  const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
  const temp = newGrid[row1][col1].type;
  newGrid[row1][col1].type = newGrid[row2][col2].type;
  newGrid[row2][col2].type = temp;
  return newGrid;
}

// Обработка каскадных совпадений
export function processMatches(grid: Grid): { newGrid: Grid; totalScore: number } {
  let currentGrid = grid;
  let totalScore = 0;
  let hasMatches = true;
  
  while (hasMatches) {
    const matches = findMatches(currentGrid);
    if (matches.size === 0) {
      hasMatches = false;
    } else {
      const result = removeMatchesAndDrop(currentGrid, matches);
      currentGrid = result.newGrid;
      totalScore += result.score;
    }
  }
  
  return { newGrid: currentGrid, totalScore };
}

