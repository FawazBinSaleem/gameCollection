const board = document.getElementById("board");
const turnDisplay = document.getElementById("turnDisplay");

let selected = null;
let turn = "red";

function createBoard() {
  board.innerHTML = ""; // Clear board on reset
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;

      const isBlack = (row + col) % 2 !== 0;
      cell.classList.add(isBlack ? "black" : "white");

      if (isBlack && row < 3) {
        const piece = createPiece("black");
        cell.appendChild(piece);
      } else if (isBlack && row > 4) {
        const piece = createPiece("red");
        cell.appendChild(piece);
      }

      cell.addEventListener("click", () => handleCellClick(cell));
      board.appendChild(cell);
    }
  }
}

function createPiece(color) {
  const piece = document.createElement("div");
  piece.classList.add("piece", color === "red" ? "red" : "black-piece");
  piece.dataset.color = color;
  piece.dataset.king = "false";
  return piece;
}

function handleCellClick(cell) {
  const piece = cell.querySelector(".piece");

  if (selected && selected !== piece) selected.classList.remove("selected");

  // Selecting own piece
  if (piece && piece.dataset.color === turn) {
    selected = piece;
    piece.classList.add("selected");
    return;
  }

  // Move logic
  if (selected && isEmpty(cell)) {
    const from = selected.parentElement;
    const to = cell;
    const [fromRow, fromCol] = [parseInt(from.dataset.row), parseInt(from.dataset.col)];
    const [toRow, toCol] = [parseInt(to.dataset.row), parseInt(to.dataset.col)];
    const [rowDiff, colDiff] = [toRow - fromRow, toCol - fromCol];
    const [absRow, absCol] = [Math.abs(rowDiff), Math.abs(colDiff)];

    const isKing = selected.dataset.king === "true";
    const color = selected.dataset.color;
    const forward = color === "red" ? -1 : 1;
    
    // Fixing direction validation for non-king pieces
    const correctDirection = isKing || (color === "red" ? rowDiff === -1 : rowDiff === 1);

    const isSimpleMove = absRow === 1 && absCol === 1 && correctDirection;
    const isCaptureMove = absRow === 2 && absCol === 2;

    if (isSimpleMove && isEmpty(to)) {
      movePiece(selected, to);
      crownIfNeeded(selected, to);
      endTurn();
    } else if (isCaptureMove && isEmpty(to)) {
  // Enforce forward capture direction for non-kings
  if (!isKing && ((color === "red" && rowDiff > 0) || (color === "black" && rowDiff < 0))) {
    return; // Invalid backward capture for non-king
  }

  const midRow = fromRow + rowDiff / 2;
  const midCol = fromCol + colDiff / 2;
  const midCell = getCell(midRow, midCol);
  const middlePiece = midCell.querySelector(".piece");

  if (middlePiece && middlePiece.dataset.color !== color) {
    midCell.removeChild(middlePiece); // capture
    movePiece(selected, to);
    crownIfNeeded(selected, to);

    if (canCaptureAgain(selected)) {
      selected.classList.add("selected");
      return; // don't end turn
    }

    endTurn();
  }
}
    
  }
}

function isEmpty(cell) {
  return cell.children.length === 0;
}

function movePiece(piece, toCell) {
  const from = piece.parentElement;
  from.classList.remove("selected");
  toCell.appendChild(piece);
}

function getCell(row, col) {
  return document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
}

function crownIfNeeded(piece, cell) {
  const row = parseInt(cell.dataset.row);
  if (
    (piece.dataset.color === "red" && row === 0) ||
    (piece.dataset.color === "black" && row === 7)
  ) {
    piece.dataset.king = "true";
    piece.classList.add("king");
  }
}

function canCaptureAgain(piece) {
  const from = piece.parentElement;
  const row = parseInt(from.dataset.row);
  const col = parseInt(from.dataset.col);
  const color = piece.dataset.color;
  const isKing = piece.dataset.king === "true";
  const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

  for (let [dRow, dCol] of directions) {
    if (!isKing) {
      // Fixing backward movement restriction for non-king pieces
      if ((color === "red" && dRow > 0) || (color === "black" && dRow < 0)) continue;
    }

    const midRow = row + dRow;
    const midCol = col + dCol;
    const targetRow = row + dRow * 2;
    const targetCol = col + dCol * 2;

    const midCell = getCell(midRow, midCol);
    const targetCell = getCell(targetRow, targetCol);

    if (midCell && targetCell && isEmpty(targetCell)) {
      const midPiece = midCell.querySelector(".piece");
      if (midPiece && midPiece.dataset.color !== color) {
        return true;
      }
    }
  }

  return false;
}

function endTurn() {
  selected?.classList.remove("selected");
  selected = null;
  turn = turn === "red" ? "black" : "red";
  updateTurnDisplay();
  checkGameOver();
}

function updateTurnDisplay() {
  turnDisplay.textContent = `Turn: ${turn.charAt(0).toUpperCase() + turn.slice(1)}`;
  turnDisplay.style.color = turn === "red" ? "red" : "black";
}

function checkGameOver() {
  const redPieces = document.querySelectorAll(".piece.red");
  const blackPieces = document.querySelectorAll(".piece.black-piece");

  if (redPieces.length === 0 || blackPieces.length === 0) {
    setTimeout(() => {
      alert(`Game Over! ${redPieces.length === 0 ? "Black" : "Red"} wins!`);
      createBoard();
      updateTurnDisplay();
    }, 100);
  }
}

// Optional: Add reset button
const resetBtn = document.createElement("button");
resetBtn.textContent = "Reset Game";
resetBtn.style.marginTop = "10px";
resetBtn.addEventListener("click", () => {
  turn = "red";
  selected = null;
  createBoard();
  updateTurnDisplay();
});
document.body.appendChild(resetBtn);

// Start game
createBoard();
updateTurnDisplay();
