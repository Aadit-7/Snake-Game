/* ================== DOM REFERENCES ================== */
const board = document.querySelector(".board");
const modal = document.querySelector(".modal");
const startGameDiv = document.querySelector(".start-game");
const gameOverDiv = document.querySelector(".game-over");
const startBtn = document.querySelector(".start-game button");
const restartBtn = document.querySelector(".game-over button");

const scoreEl = document.querySelector("#score");
const highScoreEl = document.querySelector("#high-score");
const timeEl = document.querySelector("#time");

/* ================== GAME CONFIG ================== */
const blockWidth = 30;
const blockHeight = 30;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

/* ================== GAME STATE ================== */
let direction = "right";
let intervalId = null;
let timerId = null;

let gameScore = 0;
let gameTime = 0;
let gameHighScore = Number(localStorage.getItem("High-Score")) || 0;

highScoreEl.innerHTML = gameHighScore;

const blocks = [];
let snake = [{ x: 4, y: 13 }];
let food = null;

/* ================== GRID CREATION ================== */
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${row},${col}`] = block;
  }
}

/* ================== CORE FUNCTIONS ================== */

/* Generates food at a random position not occupied by the snake */
function generateFood() {
  let position;
  do {
    position = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
  } while (snake.some((seg) => seg.x === position.x && seg.y === position.y));
  return position;
}

/* Calculates next head position based on direction */
function getNextHead() {
  const head = snake[0];
  if (direction === "left") return { x: head.x, y: head.y - 1 };
  if (direction === "right") return { x: head.x, y: head.y + 1 };
  if (direction === "up") return { x: head.x - 1, y: head.y };
  if (direction === "down") return { x: head.x + 1, y: head.y };
}

/* Checks wall or self collision */
function hasCollision(head) {
  const hitWall = head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols;

  const hitSelf = snake.some((seg) => seg.x === head.x && seg.y === head.y);

  return hitWall || hitSelf;
}

/* Handles food consumption and score update */
function eatFood(head) {
  if (head.x === food.x && head.y === food.y) {
    gameScore += 10;
    scoreEl.innerHTML = gameScore;

    if (gameScore > gameHighScore) {
      gameHighScore = gameScore;
      highScoreEl.innerHTML = gameHighScore;
      localStorage.setItem("High-Score", gameHighScore);
    }

    food = generateFood();
    return true;
  }
  return false;
}

/* Renders snake and food on the board */
function draw() {
  blocks[`${food.x},${food.y}`].classList.add("food");
  snake.forEach((seg) => {
    blocks[`${seg.x},${seg.y}`].classList.add("fill");
  });
}

/* Clears snake and food visuals */
function clearBoard() {
  snake.forEach((seg) => {
    blocks[`${seg.x},${seg.y}`].classList.remove("fill");
  });
  if (food) {
    blocks[`${food.x},${food.y}`].classList.remove("food");
  }
}

/* Main game loop */
function gameLoop() {
  clearBoard();

  const head = getNextHead();

  if (hasCollision(head)) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (!eatFood(head)) {
    snake.pop();
  }

  draw();
}

/* Ends the game and shows game over modal */
function endGame() {
  clearInterval(intervalId);
  clearInterval(timerId);

  modal.style.display = "flex";
  gameOverDiv.style.display = "block";
  startGameDiv.style.display = "none";
}

/* Starts game timer */
function startTimer() {
  timerId = setInterval(() => {
    gameTime++; // total seconds

    const minutes = Math.floor(gameTime / 60)
      .toString()
      .padStart(2, "0");

    const seconds = (gameTime % 60)
      .toString()
      .padStart(2, "0");

    timeEl.innerHTML = `${minutes}:${seconds}`;
  }, 1000);
}



/* Resets game state for a fresh start */
function resetGame() {
  clearBoard();
  clearInterval(intervalId);
  clearInterval(timerId);

  direction = "right";
  gameScore = 0;
  gameTime = 0;

  scoreEl.innerHTML = 0;
  timeEl.innerHTML = 0;

  snake = [{ x: 4, y: 13 }];
  food = generateFood();

  modal.style.display = "none";
  intervalId = setInterval(gameLoop, 100);
  startTimer();
}

/* ================== CONTROLS ================== */
addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== "down") direction = "up";
  if (e.key === "ArrowDown" && direction !== "up") direction = "down";
  if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
  if (e.key === "ArrowRight" && direction !== "left") direction = "right";
});

/* ================== BUTTONS ================== */
startBtn.addEventListener("click", () => {
  food = generateFood();
  modal.style.display = "none";
  intervalId = setInterval(gameLoop, 100);
  startTimer();
});

restartBtn.addEventListener("click", resetGame);
