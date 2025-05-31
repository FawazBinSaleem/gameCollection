const choices = ["👊", "🖐️", "✌️"];
const winConditions = {
  "👊": "✌️",
  "🖐️": "👊",
  "✌️": "🖐️"
};

const player1Display = document.getElementById("player1Display");
const player2Display = document.getElementById("player2Display");
const resultDisplay = document.getElementById("resultDisplay");
const player1ScoreDisplay = document.getElementById("player1ScoreDisplay");
const player2ScoreDisplay = document.getElementById("player2ScoreDisplay");
const tiedScoreDisplay = document.getElementById("tiedScoreDisplay");
const historyLog = document.getElementById("historyLog");

let roundCount = 1;
let gameMode = "player"; // Default: Player vs Player

let state = {
  player1Choice: "",
  player2Choice: "",
  scores: {
    player1: 0,
    player2: 0,
    ties: 0
  }
};

// --- Game Mode ---
function setGameMode(mode) {
  gameMode = mode;
  resetGame();
  displayMessage();
}

function displayMessage() {
  player1Display.textContent = "PLAYER 1: Waiting for selection...";
  player2Display.textContent =
    gameMode === "computer" ? "COMPUTER: Waiting for selection..." : "PLAYER 2: Waiting for selection...";
}

// --- Game Play ---
function playGame(choice) {
  if (gameMode === "player") {
    if (!state.player1Choice) {
      state.player1Choice = choice;
      player1Display.textContent = `PLAYER 1: ✅`;
      player2Display.textContent = "PLAYER 2: Waiting for selection...";
    } else if (!state.player2Choice) {
      state.player2Choice = choice;
      player2Display.textContent = `PLAYER 2: ✅`;
      finishRound();
    }
  } else {
    if (!state.player1Choice) {
      state.player1Choice = choice;
      player1Display.textContent = `PLAYER 1: ✅`;
      player2Display.textContent = "COMPUTER: Thinking...";
      setTimeout(() => {
        const computerChoice = choices[Math.floor(Math.random() * 3)];
        state.player2Choice = computerChoice;
        player2Display.textContent = `COMPUTER: ✅`;
        finishRound();
      }, 500);
    }
  }
}

function finishRound() {
  
    const result = getResult(state.player1Choice, state.player2Choice);
  
    // Reveal the actual choices here
    player1Display.textContent = `PLAYER 1: ${state.player1Choice}`;
    player2Display.textContent =
      gameMode === "computer"
        ? `COMPUTER: ${state.player2Choice}`
        : `PLAYER 2: ${state.player2Choice}`;
  
    showResult(result);
    logRound(state.player1Choice, state.player2Choice, result);
    setTimeout(resetRound, 2000);
  }

// --- Result Logic ---
function getResult(p1, p2) {
  if (p1 === p2) {
    state.scores.ties++;
    tiedScoreDisplay.textContent = state.scores.ties;
    return "IT'S A TIE";
  } else if (winConditions[p1] === p2) {
    state.scores.player1++;
    player1ScoreDisplay.textContent = state.scores.player1;
    return "PLAYER 1 WINS";
  } else {
    state.scores.player2++;
    player2ScoreDisplay.textContent = state.scores.player2;
    return "PLAYER 2 WINS";
  }
}

function showResult(result) {
  resultDisplay.textContent = result;
  resultDisplay.classList.remove("greenText", "redText", "yellowText", "pop");

  void resultDisplay.offsetWidth; // Trigger reflow
  resultDisplay.classList.add("pop");

  if (result === "PLAYER 1 WINS") resultDisplay.classList.add("greenText");
  else if (result === "PLAYER 2 WINS") resultDisplay.classList.add("redText");
  else resultDisplay.classList.add("yellowText");
}

// --- History ---
function logRound(p1, p2, result) {
  const round = document.createElement("div");
  round.textContent = `Round ${roundCount++}: Player 1: ${p1} | Player 2: ${p2} → ${result}`;
  historyLog.prepend(round);
}

// --- Reset ---
function resetRound() {
  state.player1Choice = "";
  state.player2Choice = "";
  displayMessage();
  resultDisplay.textContent = "";
  resultDisplay.classList.remove("pop", "greenText", "redText", "yellowText");
}

function resetGame() {
  state = {
    player1Choice: "",
    player2Choice: "",
    scores: {
      player1: 0,
      player2: 0,
      ties: 0
    }
  };
  roundCount = 1;
  player1ScoreDisplay.textContent = "0";
  player2ScoreDisplay.textContent = "0";
  tiedScoreDisplay.textContent = "0";
  historyLog.innerHTML = "";
  displayMessage();
  resultDisplay.textContent = "";
}
