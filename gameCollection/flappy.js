// Get the canvas and set up the game context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas size
canvas.width = 320;
canvas.height = 480;

// Variables for the bird
const bird = {
    x: 50,
    y: canvas.height / 2,
    width: 20,
    height: 20,
    velocity: 0,
    gravity: 0.6,
    lift: -8 // Reduced lift for a smoother jump
};

// Pipe variables
let pipes = [];
const pipeWidth = 50;
const pipeGap = 200; // Increased pipe gap to make pipes less crowded
const pipeSpeed = 2;
let score = 0;

// Event listener for the bird's jump (on spacebar press)
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        bird.velocity = bird.lift;
    }
});

// Function to create new pipes
function createPipes() {
    const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
    pipes.push({
        x: canvas.width,
        top: pipeHeight,
        bottom: canvas.height - pipeHeight - pipeGap
    });
}

// Function to move the pipes
function movePipes() {
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= pipeSpeed;

        // Check if the pipe is off-screen
        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
            score++;
        }
    }
}

// Function to detect collisions
function checkCollision() {
    // Check for collision with pipes
    for (let i = 0; i < pipes.length; i++) {
        if (
            bird.x + bird.width > pipes[i].x &&
            bird.x < pipes[i].x + pipeWidth &&
            (bird.y < pipes[i].top || bird.y + bird.height > pipes[i].top + pipeGap)
        ) {
            return true;
        }
    }
    // Check for collision with ground or ceiling
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        return true;
    }
    return false;
}

// Function to update the game
function updateGame() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    movePipes();

    if (checkCollision()) {
        alert('Game Over! Your Score: ' + score);
        resetGame();
    }

    // Create new pipes periodically
    if (Math.random() < 0.01) {
        createPipes();
    }

    // Clear the canvas and redraw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height); // Draw the bird

    ctx.fillStyle = 'green';
    for (let i = 0; i < pipes.length; i++) {
        ctx.fillRect(pipes[i].x, 0, pipeWidth, pipes[i].top); // Top pipe
        ctx.fillRect(pipes[i].x, pipes[i].top + pipeGap, pipeWidth, pipes[i].bottom); // Bottom pipe
    }

    // Draw the score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

// Reset the game
function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    score = 0;
}

// Game loop to update and render the game
function gameLoop() {
    updateGame();
    requestAnimationFrame(gameLoop);
}

gameLoop(); // Start the game
