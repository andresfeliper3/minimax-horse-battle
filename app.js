const boxesPerRow = 8;

let black;
let white;
let bonusImage;
let boxWidth;
let boxHeight;

let initialState;

let lastMove = {};

const bonusIndex = [
  { row: 0, col: 1 },
  { row: 5, col: 2 },
  { row: 2, col: 2 },
];

function preload() {
  black = loadImage("src/images/black.png");
  white = loadImage("src/images/white.png");
  bonusImage = loadImage("src/images/bonus.png");
}

function setup() {
  preload();
  createCanvas(500, 500);
  background(220);
}

function draw() {
  boxWidth = width / boxesPerRow;
  boxHeight = height / boxesPerRow;
  drawGrid();

  dominateBox();
  paintbonus();
}
function drawGrid() {
  let column = 0;
  let row = 0;
  for (let x = 0; x < width; x += boxWidth) {
    for (let y = 0; y < height; y += boxHeight) {
      stroke(0);
      strokeWeight(1);
      line(x, 0, x, height); //vertical
      line(0, y, width, y); //horizontal
      column++;
    }
    row++;
  }
}

function dominateBox() {
  if (mouseIsPressed && checkHorseMovement()) {
    //calculate pos
    //check
    eraseHorse("green");
    calculateAndPaintBox("green");
  }
}

function checkHorseMovement() {
  let allowMove = true;
  let boxIndex = calculateBoxIndex(lastMove.x, lastMove.y);
  let position = { x: boxIndex.row * boxWidth, y: boxIndex.col * boxHeight };
  console.log("lastMove: ", boxIndex);

  return allowMove;
}

function eraseHorse(color) {
  fill(color);
  rect(lastMove.x, lastMove.y, boxWidth, boxHeight);
}
function calculateAndPaintBox(color) {
  let boxIndex = calculateBoxIndex(mouseX, mouseY);
  let position = { x: boxIndex.row * boxWidth, y: boxIndex.col * boxHeight };
  paintBox(position, color);
}

function calculateBoxIndex(x, y) {
  let boxRow = Math.floor(x / boxWidth);
  let boxCol = Math.floor(y / boxHeight);
  return { row: boxRow, col: boxCol };
}

function paintBox(position, color) {
  fill(color);
  rect(position.x, position.y, boxWidth, boxHeight);
  image(white, position.x, position.y);
  lastMove = { x: position.x, y: position.y };
}

function paintbonus() {
  bonusIndex.forEach((bonus) =>
    image(bonusImage, bonus.row * boxWidth + 2, bonus.col * boxHeight + 2)
  );
}

//THIS MAKES THE CODE WORK
window.setup = setup;
window.draw = draw;
