/* =====================================================
   Caça-Palavras • 50 Níveis
   Mo an Pòtigè + Fransé
   ===================================================== */

// ---------- WORD POOL (PT + FR) ----------
const WORD_POOL = [
  // Português
  "CASA","LIVRO","ESCOLA","AMIGO","FAMILIA","COMIDA","AGUA","SOL","LUA","FLOR",
  "ARVORE","CACHORRO","GATO","CARRO","CIDADE","PRAIA","MONTANHA","RIO","MAR","PEIXE",
  "PASSARO","MUSICA","DANCA","FESTA","TRABALHO","ESTUDO","PROFESSOR","ALUNO","CANETA","PAPEL",
  "MESA","CADEIRA","JANELA","PORTA","LUZ","NOITE","DIA","MANHA","TARDE","TEMPO",
  "CHUVA","VENTO","FOGO","TERRA","CEU","ESTRELA","NUVEM","FLORESTA","CAMPO","JARDIM",
  "FRUTA","MACA","BANANA","LARANJA","UVA","MELANCIA","PAO","LEITE","QUEIJO","ARROZ",
  "FEIJAO","CARNE","PEIXE","OVO","SOPA","CAFE","CHA","SUCO","BOLO","CHOCOLATE",
  "SAPATO","ROUPA","CAMISA","CALCA","CHAPEU","BOLSA","RELOGIO","OCULOS","CHAVE","DINHEIRO",
  "BANCO","LOJA","MERCADO","HOSPITAL","IGREJA","PARQUE","PRACA","RUA","AVENIDA","PONTE",
  "TREM","ONIBUS","AVIAO","BARCO","BICICLETA","MOTOCICLETA","CAMINHAO","TAXI","METRO","ELEVADOR",
  "COMPUTADOR","TELEFONE","TELEVISAO","RADIO","INTERNET","JOGO","FILME","LIVRARIA","BIBLIOTECA","MUSEU",
  "TEATRO","CINEMA","ESTADIO","GINASIO","PISCINA","PRAIA","MONTANHA","FLORESTA","DESERTO","ILHA",
  "COR","VERMELHO","AZUL","VERDE","AMARELO","PRETO","BRANCO","ROSA","ROXO","LARANJA",
  "NUMERO","UM","DOIS","TRES","QUATRO","CINCO","SEIS","SETE","OITO","NOVE","DEZ",
  "HOMEM","MULHER","CRIANCA","BEBE","ADOLESCENTE","ADULTO","IDOSO","MENINO","MENINA","IRMAO",
  "IRMA","PAI","MAE","AVO","TIO","TIA","PRIMO","PRIMA","SOBRINHO","SOBRINHA",
  "AMOR","AMIZADE","FELICIDADE","TRISTEZA","ALEGRIA","PAZ","GUERRA","ESPERANCA","SONHO","VIDA",
  "MORTE","NASCIMENTO","CASAMENTO","DIVORCIO","VIAGEM","FERIAS","TRABALHO","APOSENTADORIA","SAUDE","DOENCA",

  // Français
  "MAISON","LIVRE","ECOLE","AMI","FAMILLE","NOURRITURE","EAU","SOLEIL","LUNE","FLEUR",
  "ARBRE","CHIEN","CHAT","VOITURE","VILLE","PLAGE","MONTAGNE","RIVIERE","MER","POISSON",
  "OISEAU","MUSIQUE","DANSE","FETE","TRAVAIL","ETUDE","PROFESSEUR","ELEVE","STYLO","PAPIER",
  "TABLE","CHAISE","FENETRE","PORTE","LUMIERE","NUIT","JOUR","MATIN","APRES","TEMPS",
  "PLUIE","VENT","FEU","TERRE","CIEL","ETOILE","NUAGE","FORET","CHAMP","JARDIN",
  "FRUIT","POMME","BANANE","ORANGE","RAISIN","PAIN","LAIT","FROMAGE","RIZ","VIANDE",
  "OEUF","SOUPE","CAFE","THE","JUS","GATEAU","CHOCOLAT","CHAUSSURE","VETEMENT","CHEMISE",
  "PANTALON","CHAPEAU","SAC","MONTRE","LUNETTES","CLE","ARGENT","BANQUE","MAGASIN","MARCHE",
  "HOPITAL","EGLISE","PARC","PLACE","RUE","AVENUE","PONT","TRAIN","BUS","AVION",
  "BATEAU","VELO","MOTO","CAMION","TAXI","METRO","ASCENSEUR","ORDINATEUR","TELEPHONE","TELEVISION",
  "RADIO","INTERNET","JEU","FILM","BIBLIOTHEQUE","MUSEE","THEATRE","CINEMA","STADE","PISCINE",
  "DESERT","ILE","COULEUR","ROUGE","BLEU","VERT","JAUNE","NOIR","BLANC","ROSE",
  "VIOLET","NOMBRE","UN","DEUX","TROIS","QUATRE","CINQ","SIX","SEPT","HUIT",
  "NEUF","DIX","HOMME","FEMME","ENFANT","BEBE","ADOLESCENT","ADULTE","GARCON","FILLE",
  "FRERE","SOEUR","PERE","MERE","GRAND","ONCLE","TANTE","COUSIN","NEVEU","NIECE",
  "AMOUR","AMITIE","BONHEUR","TRISTESSE","JOIE","PAIX","GUERRE","ESPOIR","REVE","VIE",
  "MORT","NAISSANCE","MARIAGE","DIVORCE","VOYAGE","VACANCES","RETRAITE","SANTE","MALADIE","SOURIRE"
];

// ---------- GAME STATE ----------
const TOTAL_LEVELS = 50;
let currentLevel = 1;
let gridSize = 14;
let grid = [];
let words = [];          // words for current level
let foundWords = new Set();
let isSelecting = false;
let selectedCells = [];
let startCell = null;
let soundEnabled = true;
let audioCtx = null;

// Directions: [dx, dy]
const DIRECTIONS = [
  [0, 1],   // horizontal →
  [1, 0],   // vertical ↓
  [1, 1],   // diagonal ↘
  [1, -1],  // diagonal ↙
  [0, -1],  // horizontal ←
  [-1, 0],  // vertical ↑
  [-1, -1], // diagonal ↖
  [-1, 1]   // diagonal ↗
];

// ---------- DOM ----------
const gridEl = document.getElementById('grid');
const wordListEl = document.getElementById('word-list');
const levelInfoEl = document.getElementById('level-info');
const foundCountEl = document.getElementById('found-count');
const progressFill = document.getElementById('progress-fill');
const messageEl = document.getElementById('message');
const btnSound = document.getElementById('btn-sound');
const soundLabel = document.getElementById('sound-label');
const btnHint = document.getElementById('btn-hint');
const btnRestart = document.getElementById('btn-restart');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayText = document.getElementById('overlay-text');
const btnContinue = document.getElementById('btn-continue');

// ---------- AUDIO ----------
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playTone(freq, duration, type = 'sine', volume = 0.15) {
  if (!soundEnabled) return;
  initAudio();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.stop(audioCtx.currentTime + duration);
}

function playSelect() {
  playTone(420, 0.06, 'square', 0.08);
}

function playFound() {
  playTone(523, 0.1);
  setTimeout(() => playTone(659, 0.12), 80);
  setTimeout(() => playTone(784, 0.15), 160);
}

function playLevelComplete() {
  const notes = [523, 659, 784, 1046];
  notes.forEach((n, i) => setTimeout(() => playTone(n, 0.2, 'sine', 0.18), i * 120));
}

function playError() {
  playTone(200, 0.15, 'sawtooth', 0.1);
}

// ---------- GRID GENERATION ----------
function createEmptyGrid(size) {
  return Array.from({ length: size }, () => Array(size).fill(''));
}

function canPlace(grid, word, row, col, dx, dy) {
  const size = grid.length;
  for (let i = 0; i < word.length; i++) {
    const r = row + i * dx;
    const c = col + i * dy;
    if (r < 0 || r >= size || c < 0 || c >= size) return false;
    if (grid[r][c] !== '' && grid[r][c] !== word[i]) return false;
  }
  return true;
}

function placeWord(grid, word, row, col, dx, dy) {
  for (let i = 0; i < word.length; i++) {
    grid[row + i * dx][col + i * dy] = word[i];
  }
}

function fillRandom(grid) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid.length; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
}

function generatePuzzle(level) {
  // Difficulty scaling
  gridSize = 13 + Math.min(6, Math.floor((level - 1) / 8)); // 13 → 19
  const wordCount = 20 + Math.min(8, Math.floor((level - 1) / 7)); // 20 → 28

  // Pick unique words that fit
  const shuffled = [...WORD_POOL].sort(() => Math.random() - 0.5);
  const selected = [];
  for (const w of shuffled) {
    if (w.length <= gridSize - 1 && selected.length < wordCount) {
      selected.push(w);
    }
  }

  // Try to place them
  let attempts = 0;
  let finalGrid, finalWords;
  while (attempts < 40) {
    const g = createEmptyGrid(gridSize);
    const placed = [];
    for (const word of selected) {
      let placedOk = false;
      for (let tryN = 0; tryN < 80; tryN++) {
        const dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);
        if (canPlace(g, word, row, col, dir[0], dir[1])) {
          placeWord(g, word, row, col, dir[0], dir[1]);
          placed.push(word);
          placedOk = true;
          break;
        }
      }
      if (!placedOk) break; // skip this word if cannot place
    }
    if (placed.length >= 20) {
      finalGrid = g;
      finalWords = placed;
      break;
    }
    attempts++;
  }

  // Fallback if still not enough
  if (!finalGrid) {
    finalGrid = createEmptyGrid(gridSize);
    finalWords = selected.slice(0, 20);
    finalWords.forEach((word, idx) => {
      const row = idx % gridSize;
      placeWord(finalGrid, word, row, 0, 0, 1);
    });
  }

  fillRandom(finalGrid);
  return { grid: finalGrid, words: finalWords };
}

// ---------- RENDER ----------
function renderGrid() {
  gridEl.innerHTML = '';
  gridEl.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = grid[r][c];
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener('mousedown', onMouseDown);
      cell.addEventListener('mouseenter', onMouseEnter);
      cell.addEventListener('mouseup', onMouseUp);
      gridEl.appendChild(cell);
    }
  }
}

function renderWordList() {
  wordListEl.innerHTML = '';
  words.forEach(w => {
    const li = document.createElement('li');
    li.textContent = w;
    li.dataset.word = w;
    if (foundWords.has(w)) li.classList.add('found');
    wordListEl.appendChild(li);
  });
}

function updateUI() {
  levelInfoEl.textContent = `Nível ${currentLevel} / ${TOTAL_LEVELS}`;
  foundCountEl.textContent = `${foundWords.size} / ${words.length}`;
  const pct = words.length ? (foundWords.size / words.length) * 100 : 0;
  progressFill.style.width = pct + '%';
  btnPrev.disabled = currentLevel <= 1;
  btnNext.disabled = foundWords.size < words.length;
}

// ---------- SELECTION LOGIC ----------
function getCell(row, col) {
  return gridEl.querySelector(`[data-row="${row}"][data-col="${col}"]`);
}

function clearSelecting() {
  document.querySelectorAll('.cell.selecting').forEach(c => c.classList.remove('selecting'));
}

function onMouseDown(e) {
  if (e.button !== 0) return;
  isSelecting = true;
  selectedCells = [];
  startCell = { row: +e.target.dataset.row, col: +e.target.dataset.col };
  selectedCells.push(startCell);
  e.target.classList.add('selecting');
  playSelect();
}

function onMouseEnter(e) {
  if (!isSelecting || !startCell) return;
  const row = +e.target.dataset.row;
  const col = +e.target.dataset.col;

  // Determine direction
  const dr = row - startCell.row;
  const dc = col - startCell.col;
  if (dr === 0 && dc === 0) return;

  // Only allow straight lines (horizontal, vertical, diagonal)
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return;

  const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
  const stepC = dc === 0 ? 0 : dc / Math.abs(dc);
  const steps = Math.max(Math.abs(dr), Math.abs(dc));

  clearSelecting();
  selectedCells = [];
  for (let i = 0; i <= steps; i++) {
    const r = startCell.row + i * stepR;
    const c = startCell.col + i * stepC;
    const cell = getCell(r, c);
    if (cell) {
      cell.classList.add('selecting');
      selectedCells.push({ row: r, col: c });
    }
  }
}

function onMouseUp() {
  if (!isSelecting) return;
  isSelecting = false;

  if (selectedCells.length < 2) {
    clearSelecting();
    selectedCells = [];
    return;
  }

  // Build word from selection
  let word = selectedCells.map(p => grid[p.row][p.col]).join('');
  let reverse = word.split('').reverse().join('');

  let matched = null;
  if (words.includes(word) && !foundWords.has(word)) matched = word;
  else if (words.includes(reverse) && !foundWords.has(reverse)) matched = reverse;

  if (matched) {
    foundWords.add(matched);
    selectedCells.forEach(p => {
      const cell = getCell(p.row, p.col);
      if (cell) {
        cell.classList.remove('selecting');
        cell.classList.add('found');
      }
    });
    playFound();
    messageEl.textContent = `Ou jwenn: ${matched} !`;
    renderWordList();
    updateUI();

    if (foundWords.size === words.length) {
      setTimeout(() => showLevelComplete(), 600);
    }
  } else {
    playError();
    clearSelecting();
    messageEl.textContent = 'Pa jwenn... eseye ankò';
  }
  selectedCells = [];
  startCell = null;
}

// Prevent text selection while dragging
document.addEventListener('selectstart', e => {
  if (isSelecting) e.preventDefault();
});

// Global mouseup in case release outside grid
document.addEventListener('mouseup', () => {
  if (isSelecting) onMouseUp();
});

// ---------- LEVEL CONTROL ----------
function loadLevel(level) {
  currentLevel = level;
  foundWords.clear();
  const puzzle = generatePuzzle(level);
  grid = puzzle.grid;
  words = puzzle.words;
  renderGrid();
  renderWordList();
  updateUI();
  messageEl.textContent = `Nível ${level} – Jwenn ${words.length} mo`;
  overlay.classList.add('hidden');
  // Clear any old found classes
  document.querySelectorAll('.cell.found').forEach(c => c.classList.remove('found'));
}

function showLevelComplete() {
  playLevelComplete();
  if (currentLevel >= TOTAL_LEVELS) {
    overlayTitle.textContent = 'Felisitasyon! 🏆';
    overlayText.textContent = `Ou fini tout 50 nivo yo! Ou se yon mèt Caça-Palavras.`;
    btnContinue.textContent = 'Jwe ankò (Nivo 1)';
  } else {
    overlayTitle.textContent = `Nível ${currentLevel} fini! 🎉`;
    overlayText.textContent = `Ou jwenn tout ${words.length} mo. Pare pou nivo pwochen?`;
    btnContinue.textContent = 'Nivo pwochen →';
  }
  overlay.classList.remove('hidden');
}

// ---------- HINT ----------
btnHint.addEventListener('click', () => {
  const remaining = words.filter(w => !foundWords.has(w));
  if (remaining.length === 0) return;

  // Remove previous hints
  document.querySelectorAll('.hint, .hint-cell').forEach(el => {
    el.classList.remove('hint', 'hint-cell');
  });

  const word = remaining[Math.floor(Math.random() * remaining.length)];
  // Highlight in list
  const li = wordListEl.querySelector(`[data-word="${word}"]`);
  if (li) li.classList.add('hint');

  // Find first letter positions (simple: scan grid)
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === word[0]) {
        // Check all directions quickly
        for (const [dx, dy] of DIRECTIONS) {
          if (canPlace(grid, word, r, c, dx, dy)) {
            // Check if it really matches
            let ok = true;
            for (let i = 0; i < word.length; i++) {
              if (grid[r + i * dx][c + i * dy] !== word[i]) { ok = false; break; }
            }
            if (ok) {
              for (let i = 0; i < Math.min(3, word.length); i++) {
                const cell = getCell(r + i * dx, c + i * dy);
                if (cell) cell.classList.add('hint-cell');
              }
              messageEl.textContent = `Dica: ${word} kòmanse bò isit la`;
              setTimeout(() => {
                document.querySelectorAll('.hint-cell').forEach(c => c.classList.remove('hint-cell'));
                if (li) li.classList.remove('hint');
              }, 2500);
              return;
            }
          }
        }
      }
    }
  }
});

// ---------- BUTTONS ----------
btnSound.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  btnSound.textContent = soundEnabled ? '🔊' : '🔇';
  btnSound.classList.toggle('muted', !soundEnabled);
  soundLabel.textContent = soundEnabled ? 'Son aktif' : 'Son fèmen';
  if (soundEnabled) playSelect();
});

btnRestart.addEventListener('click', () => {
  if (confirm('Rekòmanse nivo sa a?')) {
    loadLevel(currentLevel);
  }
});

btnPrev.addEventListener('click', () => {
  if (currentLevel > 1) loadLevel(currentLevel - 1);
});

btnNext.addEventListener('click', () => {
  if (foundWords.size >= words.length && currentLevel < TOTAL_LEVELS) {
    loadLevel(currentLevel + 1);
  }
});

btnContinue.addEventListener('click', () => {
  if (currentLevel >= TOTAL_LEVELS) {
    loadLevel(1);
  } else {
    loadLevel(currentLevel + 1);
  }
});

// ---------- START ----------
loadLevel(1);
