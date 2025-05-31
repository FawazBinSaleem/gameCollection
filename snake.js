const board = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");

const boardSize = 20;
let snake = [];
let direction = { x: 0, y: 0 };
let food = {};
let gameInterval = null;
let score = 0;

function createBoard() {
  board.innerHTML = '';
  for (let i = 0; i < boardSize * boardSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    board.appendChild(cell);
  }
}

function getCell(x, y) {
  return board.children[y * boardSize + x];
}

function draw() {
  [...board.children].forEach(cell => {
    cell.classList.remove('snake', 'food');
  });

  snake.forEach(segment => {
    const cell = getCell(segment.x, segment.y);
    if (cell) cell.classList.add('snake');
  });

  const foodCell = getCell(food.x, food.y);
  if (foodCell) foodCell.classList.add('food');
}

function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Collision with wall or self
  if (
    head.x < 0 || head.x >= boardSize ||
    head.y < 0 || head.y >= boardSize ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    clearInterval(gameInterval);
    alert("Game Over! Your score: " + score);
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = "Score: " + score;
    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

function placeFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize)
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));

  food = newFood;
}

function handleKey(e) {
  switch (e.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
}

function startGame() {
  clearInterval(gameInterval);
  score = 0;
  scoreDisplay.textContent = "Score: 0";
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 }; // Start moving right
  placeFood();
  createBoard();
  draw();
  gameInterval = setInterval(moveSnake, 150);
}

window.addEventListener("keydown", handleKey);
