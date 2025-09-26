type Direction = 'horizontal' | 'vertical';
type Cell = 'empty' | 'ship' | 'hit' | 'miss';
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
  for (let i = 0; i < size; i++) {
    const r = direction === 'vertical' ? row + i : row;
    const c = direction === 'horizontal' ? col + i : col;
    if (r >= grid.length || c >= grid[0].length || grid[r][c] !== 'empty') {
      return false;
    }
  }
  return true;
}

// 3. Placer un bateau
function placeShip(grid: Grid, row: number, col: number, size: number, direction: Direction): boolean {
  if (!canPlaceShip(grid, row, col, size, direction)) {
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

// 4. Afficher la grille dans la console (debug)
function printGrid(grid: Grid): void {
  console.log('\nGrille du joueur :');
  console.log(gridToString(grid, false));
}

// 5. Liste des bateaux
const ships: Ship[] = [
  { name: 'Porte-avions', size: 5 },
  { name: 'Croiseur', size: 4 },
  { name: 'Contre-torpilleur', size: 3 },
  { name: 'Sous-marin', size: 3 },
  { name: 'Torpilleur', size: 2 },
];

// 6. Placement des bateaux
function placeAllShips(grid: Grid, ships: Ship[]) {
  for (let ship of ships) {
    let placed = false;

    while (!placed) {
      const input = prompt(
        `⚓ Où placer le ${ship.name} (taille ${ship.size}) ?\n` +
        'Format : ligne,colonne,direction (ex: 2,4,horizontal)\n' +
        'Ou appuie sur Entrée pour un placement aléatoire'
      );

      if (!input || input.trim() === '') {
        console.log(`Placement automatique du ${ship.name}...`);
        let essais = 0;
        while (!placed && essais < 100) {
          const row = Math.floor(Math.random() * grid.length);
          const col = Math.floor(Math.random() * grid[0].length);
          const direction: Direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
          placed = placeShip(grid, row, col, ship.size, direction);
          essais++;
        }
        if (placed) console.log(`✅ ${ship.name} placé automatiquement.`);
        else {
          console.warn(`❌ Impossible de placer automatiquement le ${ship.name}.`);
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
      }
    }
  }
}

// 7. Fonction de tir
function fire(grid: Grid, row: number, col: number): void {
  const cell = grid[row][col];

  if (cell === 'hit' || cell === 'miss') {
    console.log("🚫 Tu as déjà tiré ici !");
    return;
  }

  if (cell === 'ship') {
    grid[row][col] = 'hit';
    console.log("🔥 Touché !");
  } else {
    grid[row][col] = 'miss';
    console.log("🌊 À l'eau !");
  }
}

// 8. Vérifier si tous les bateaux sont coulés
function allShipsSunk(grid: Grid): boolean {
  for (let row of grid) {
    for (let cell of row) {
      if (cell === 'ship') return false;
    }
  }
  return true;
}

// 9. Convertir la grille en texte avec index des lignes et colonnes
function gridToString(grid: Grid, hideShips: boolean = false): string {
  let str = '    ';

  for (let col = 0; col < grid[0].length; col++) {
    if (col < 10) str += '  ' + col + '  ';
    else str += col + ' ';
  }
  str += '\n';

  for (let row = 0; row < grid.length; row++) {
    if (row < 10) str += ' ' + row + '  ';
    else str += row + '  ';

    for (let cell of grid[row]) {
      if (cell === 'ship') {
        str += hideShips ? '⬜ ' : '🚢 ';
      } else if (cell === 'hit') {
        str += '💥 ';
      } else if (cell === 'miss') {
        str += '🌊 ';
      } else {
        str += '⬜ ';
      }
    }
    str += '\n';
  }
  return str;
}

// 10. Boucle de tir
function startFiringLoop(grid: Grid): void {
  let showShips = false;

  while (!allShipsSunk(grid)) {
    const grilleTexte = gridToString(grid, !showShips);

    const input = prompt(
      `🎯 Grille actuelle :\n${grilleTexte}\n` +
      `- Entrez une position (ligne,colonne)\n` +
      `- Tapez "hide" pour afficher/cacher les bateaux\n` +
      `- Tapez "stop" pour quitter`
    );

    if (!input || input.trim() === '') {
      console.log("⛔ Taper quelque chose !");
      continue;
    }

    const cleaned = input.trim().toLowerCase();

    if (cleaned === 'stop') {
      console.log("🛑 Jeu arrêté.");
      return;
    }

    if (cleaned === 'hide') {
      showShips = !showShips;
      console.log(`👁️ Affichage des bateaux : ${showShips ? 'ON' : 'OFF'}`);
      continue;
    }

    const [rowStr, colStr] = cleaned.split(',');
    const row = parseInt(rowStr);
    const col = parseInt(colStr);

    if (
      isNaN(row) || isNaN(col) ||
      row < 0 || row >= grid.length ||
      col < 0 || col >= grid[0].length
    ) {
      console.log("🚫 Coordonnées invalides. Réessaie.");
      continue;
    }
    fire(grid, row, col);
  }
  console.log("🏆 Tous les bateaux sont coulés ! Bravo !");
}

// 11. Démarrer le jeu
function startGame() {
  const grid = createGrid();
  placeAllShips(grid, ships);
  startFiringLoop(grid);
}

//Appel de la fonction de lancement
startGame();
