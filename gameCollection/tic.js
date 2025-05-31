const board = document.getElementById('board');
const message = document.getElementById('message');
let currentPlayer = 'X';
let gameActive = true;
let cells = [];

const winCombos = [
  [0,1,2], [3,4,5], [6,7,8],  // Rows
  [0,3,6], [1,4,7], [2,5,8],  // Columns
  [0,4,8], [2,4,6]            // Diagonals
];

function createBoard() {
  board.innerHTML = '';
  cells = [];
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.addEventListener('click', () => handleClick(i));
    board.appendChild(cell);
    cells.push(cell);
  }
}

function handleClick(index) {
  if (!gameActive || cells[index].textContent) return;

  cells[index].textContent = currentPlayer;
  if (checkWin()) {
    message.textContent = `Player ${currentPlayer} wins! 🎉`;
    gameActive = false;
  } else if (cells.every(cell => cell.textContent)) {
    message.textContent = "It's a draw!";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    message.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function checkWin() {
  return winCombos.some(combo => {
    return combo.every(index => cells[index].textContent === currentPlayer);
  });
}

function resetGame() {
  currentPlayer = 'X';
  gameActive = true;
  message.textContent = "Player X's turn";
  createBoard();
}

createBoard();
