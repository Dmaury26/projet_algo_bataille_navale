type Direction = 'horizontal' | 'vertical';
type Cell = 'empty' | 'ship';
type Grid = Cell[][];

interface Ship {
  name: string;
  size: number;
}

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

// 4. Afficher la grille
function printGrid(grid: Grid): void {
  console.log('\nGrille du joueur :');

  for (let row of grid) {
    let ligneAffichee = '';

    for (let cell of row) {
      if (cell === 'ship') {
        ligneAffichee += '🚢 ';
      } else {
        ligneAffichee += '⬜ ';
      }
    }
    console.log(ligneAffichee.trim()); //Supprimer les espaces blancs
  }
}

// 5. Liste des bateaux standards
const ships: Ship[] = [
  { name: 'Porte-avions', size: 5 },
  { name: 'Croiseur', size: 4 },
  { name: 'Contre-torpilleur', size: 3 },
  { name: 'Sous-marin', size: 3 },
  { name: 'Torpilleur', size: 2 },
];

// 6. Placement des bateaux (manuel et automatique)
function placeAllShipsManually(grid: Grid, ships: Ship[]) {
  for (let ship of ships) {
    let placed = false;

    while (!placed) {
      const input = prompt(
        `⚓ Où placer le ${ship.name} (taille ${ship.size}) ?\n` +
        'Format attendu : ligne,colonne,direction (ex: 2,4,horizontal)\n' +
        '👉 Ou appuie sur Entrée pour un placement aléatoire'
      );

      if (!input || input.trim() === '') {
        console.log('Placement automatique du ${ship.name}...');

        let essais = 0;
        while (!placed && essais < 100) {
          const row = Math.floor(Math.random() * grid.length);
          const col = Math.floor(Math.random() * grid[0].length);
          const direction: Direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';

          placed = placeShip(grid, row, col, ship.size, direction);
          essais++;
        }

        if (placed) {
          console.log(`✅ ${ship.name} placé automatiquement.`);
          printGrid(grid);
        } else {
          console.warn(`❌ Impossible de placer automatiquement le ${ship.name} après plusieurs essais.`);
          return;
        }

        continue;
      }

      const [rowStr, colStr, dirStr] = input.split(',');
      const row = parseInt(rowStr);
      const col = parseInt(colStr);
      const direction = dirStr === 'vertical' ? 'vertical' : 'horizontal';

      placed = placeShip(grid, row, col, ship.size, direction);

      if (!placed) {
        console.warn('❌ Placement invalide, réessaie.');
      } else {
        console.log(`✅ ${ship.name} placé à (${row}, ${col}) en ${direction}`);
        printGrid(grid);
      }
    }
  }
}
