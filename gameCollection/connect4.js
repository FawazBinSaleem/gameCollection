const ROWS = 6;
const COLS = 7;
const board = [];
let currentPlayer = 'red';
const statusText = document.getElementById('status');
const boardDiv = document.getElementById('board');

// Create the board
for (let r = 0; r < ROWS; r++) {
  board[r] = [];
  for (let c = 0; c < COLS; c++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.row = r;
    cell.dataset.col = c;
    board[r][c] = cell;
    boardDiv.appendChild(cell);
  }
}

// Add click listeners to columns
boardDiv.addEventListener('click', (e) => {
  if (!e.target.classList.contains('cell')) return;
  const col = parseInt(e.target.dataset.col);
  makeMove(col);
});

function makeMove(col) {
  for (let r = ROWS - 1; r >= 0; r--) {
    const cell = board[r][col];
    if (!cell.classList.contains('red') && !cell.classList.contains('yellow')) {
      cell.classList.add(currentPlayer);
      if (checkWin(r, col)) {
        statusText.textContent = `${capitalize(currentPlayer)} wins!`;
        boardDiv.style.pointerEvents = 'none';
      } else {
        currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
        statusText.textContent = `${capitalize(currentPlayer)}'s turn`;
      }
      break;
    }
  }
}

function checkWin(r, c) {
  return (
    checkDirection(r, c, 1, 0) + checkDirection(r, c, -1, 0) > 2 || // vertical
    checkDirection(r, c, 0, 1) + checkDirection(r, c, 0, -1) > 2 || // horizontal
    checkDirection(r, c, 1, 1) + checkDirection(r, c, -1, -1) > 2 || // diagonal \
    checkDirection(r, c, 1, -1) + checkDirection(r, c, -1, 1) > 2 // diagonal /
  );
}

function checkDirection(r, c, dr, dc) {
  let count = 0;
  let row = r + dr;
  let col = c + dc;
  while (
    row >= 0 &&
    row < ROWS &&
    col >= 0 &&
    col < COLS &&
    board[row][col].classList.contains(currentPlayer)
  ) {
    count++;
    row += dr;
    col += dc;
  }
  return count;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const resetBtn = document.getElementById('resetBtn');
resetBtn.addEventListener('click', resetGame);

function resetGame() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      board[r][c].classList.remove('red', 'yellow');
    }
  }
  currentPlayer = 'red';
  statusText.textContent = "Red's turn";
  boardDiv.style.pointerEvents = 'auto';
}