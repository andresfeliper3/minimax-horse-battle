//THIS MAKES THE CODE WORK
window.setup = setup;
window.draw = draw;
window.mouseClicked = mouseClicked;

const boxesPerx = 8;

let blackHorseImage;
let whiteHorseImage;
let bonusImage;
let boxWidth;
let boxHeight;

let playerHorseIndex = { x: 5, y: 4 };

const bonusIndex = [
  { x: 0, y: 1 },
  { x: 5, y: 2 },
  { x: 2, y: 2 },
];

function preload() {
  blackHorseImage = loadImage("src/images/black.png");
  whiteHorseImage = loadImage("src/images/white.png");
  bonusImage = loadImage("src/images/bonus.png");
}

function setup() {
  preload();
  createCanvas(500, 500);
  background(220);
}

function draw() {
  boxWidth = width / boxesPerx;
  boxHeight = height / boxesPerx;
  drawGrid();

  paintBonus();

  const playerBackgroundColor = "green";
  paintPlayer(playerHorseIndex, whiteHorseImage, playerBackgroundColor);

}

function drawGrid() {
  for (let x = 0; x < width; x += boxWidth) {
    for (let y = 0; y < height; y += boxHeight) {
      stroke(0);
      strokeWeight(1);
      line(x, 0, x, height); //vertical
      line(0, y, width, y); //horizontal

    }
  }
}

function paintBonus() {
  bonusIndex.forEach((bonus) => {
    const position = getPositionFromIndex(bonus);
    image(bonusImage, position.x, position.y)
  });
}


function paintPlayer(index, img, color) {
  //the box background must be painted before the horse, so that the horse can be shown
  paintBox(index, color);
  paintHorse(img, index);
}

function paintBox(index, color) {
  fill(color);
  const position = getPositionFromIndex(index);
  rect(position.x, position.y, boxWidth, boxHeight);
}

function paintHorse(img, index) {
  const position = getPositionFromIndex(index);
  image(img, position.x, position.y);
}

function getPositionFromIndex(index) {
  return { x: index.x * boxWidth, y: index.y * boxHeight }
}


/* Click event */
function mouseClicked() {
  dominateBox();
}

function dominateBox() {
  if (checkHorseMovement()) {
    //calculate pos
    //check
    eraseHorseFromCurrentBox("green"); //background color to leave
    placePlayerWhereClicked("green"); //paint background color and change horse index
  }
}

function checkHorseMovement() {
  let allowMove = true;

  return allowMove;
}

function eraseHorseFromCurrentBox(color) {
  fill(color);
  const position = getPositionFromIndex(playerHorseIndex);
  rect(position.x, position.y, boxWidth, boxHeight);
}

function placePlayerWhereClicked(color) {
  const boxIndex = getIndexFromClickedBox();
  paintBox(boxIndex, color);
  changeHorseIndex(boxIndex);
}

function getIndexFromClickedBox() {
  const position = { x: mouseX, y: mouseY };
  return getIndexFromPosition(position);
}

function getIndexFromPosition(position) {
  let boxx = Math.floor(position.x / boxWidth);
  let boxy = Math.floor(position.y / boxHeight);
  return { x: boxx, y: boxy };
}

function changeHorseIndex(newIndex) {
  playerHorseIndex = newIndex;
}


