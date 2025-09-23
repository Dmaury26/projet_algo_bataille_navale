type Direction = 'horizontal' | 'vertical';
type Cell = 'empty' | 'ship';
type Grid = Cell[][];

// 1. Créer une grille vide
function createGrid(rows: number = 10, cols: number = 10): Grid {
  const grid: Grid = [];

  for (let i = 0; i < rows; i++) {
    const row: Cell[] = [];
    for (let j = 0; j < cols; j++) {
      row.push('empty');
    }
    grid.push(row);
  }
  return grid;
}

// 2. Vérifier si le bateau peut être placé
function canPlaceShip(grid: Grid, row: number, col: number, size: number, direction: Direction): boolean {
  const rows = grid.length;
  const cols = grid[0].length;

  for (let i = 0; i < size; i++) {
    const r = direction === 'vertical' ? row + i : row;
    const c = direction === 'horizontal' ? col + i : col;

    if (r >= rows || c >= cols || grid[r][c] !== 'empty') {
      return false;
    }
  }
  return true;
}

// 3. Placer un bateau
function placeShip(grid: Grid, row: number, col: number, size: number, direction: Direction): boolean {
  const placementPossible = canPlaceShip(grid, row, col, size, direction);

  if (placementPossible === false) {
    console.warn("❌ Impossible de placer le bateau à la position :", row, col);
    return false;
  }

  for (let i = 0; i < size; i++) {
    const r = direction === 'vertical' ? row + i : row;
    const c = direction === 'horizontal' ? col + i : col;
    grid[r][c] = 'ship';
  }
  return true;
}
