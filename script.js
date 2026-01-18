const board = document.querySelector(".board");
const blockWidth = 30;
const blockHeight = 30;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

// console.log(cols, rows);

const blocks = [];
const snake = [
  {
    x: 4,
    y: 13,
  },
  {
    x: 4,
    y: 14,
  },
  {
    x: 4,
    y: 15,
  },
];

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    block.innerHTML = `${row},${col}`;
    blocks[`${row},${col}`] = block;
  }
}

function render() {
  snake.forEach((segment) => {
    // console.log(segment.x, segment.y); /* Use this a coordinate for the blocks */
    blocks[`${segment.x},${segment.y}`].classList.add("fill");
  });
}
render();
