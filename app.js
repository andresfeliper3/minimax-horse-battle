//THIS MAKES THE CODE WORK
window.setup = setup;
window.draw = draw;
window.mouseClicked = mouseClicked;

const boxesPerRow = 8;

let blackHorseImage;
let whiteHorseImage;
let bonusImage;
let boxWidth;
let boxHeight;

let playerHorseIndex = { x: 5, y: 4 };
let playerBoxDominated = [];
playerBoxDominated.push(playerHorseIndex);
let validMoves = [];

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
  updateValidMoves();
}

function draw() {
  boxWidth = width / boxesPerRow;
  boxHeight = height / boxesPerRow;
  drawGrid();

  paintBonus();

  const playerBackgroundColor = "green";
  paintPlayer(playerHorseIndex, whiteHorseImage, playerBackgroundColor);
}

function drawGrid() {
  let accum = 0;
  for (let x = 0; x < width; x += boxWidth) {
    for (let y = 0; y < height; y += boxHeight) {
      stroke(1.5);
      strokeWeight(3);
      line(x, 0, x, height); //vertical
      line(0, y, width, y); //horizontal
      fill(accum % 2 === 0 ? 150 : "white");
      rect(x, y, 60, 60);
      accum++;
      //Draw the dominated boxes by player
      playerBoxDominated.forEach((box) => {
        paintBox(box, "green");
      });
      //Draw the possible horse moves
      validMoves.forEach((Vmove) => {
        paintPossibleMove(Vmove, "blue");
      });
    }
    accum++;
  }
}

function paintBox(index, color) {
  fill(color);
  const position = getPositionFromIndex(index);
  rect(position.x, position.y, boxWidth, boxHeight);
}

/*This function paints rectangles whitout fill to represent the possible moves that player's horse can be take */
function paintPossibleMove(index, color) {
  noFill();
  stroke(color);
  strokeWeight(4);
  const position = getPositionFromIndex(index);
  rect(position.x, position.y, boxWidth, boxHeight);
}

function paintBonus() {
  bonusIndex.forEach((bonus) => {
    const position = getPositionFromIndex(bonus);
    image(bonusImage, position.x, position.y);
  });
}

function paintPlayer(index, img, color) {
  //the box background must be painted before the horse, so that the horse can be shown
  paintBox(index, color);
  paintHorse(img, index);
}



function paintHorse(img, index) {
  const position = getPositionFromIndex(index);
  image(img, position.x, position.y);
}


function getPositionFromIndex(index) {
  return { x: index.x * boxWidth, y: index.y * boxHeight };
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
    playerBoxDominated.push(playerHorseIndex); //save the horse movement to dominate the Box
    updateValidMoves(); //update the possible moves that the horse can to do
  }
}

/*This function checks if the horse move where the player has clicked is valid to move */
function checkHorseMovement() {
  const boxIndex = getIndexFromClickedBox();
  let allowMove = !checkIfBoxIsDominated(boxIndex);
  allowMove = validMoves.some(
    (moves) => moves.x === boxIndex.x && moves.y === boxIndex.y
  );
  return allowMove;
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

/*This function checks if the box is dominated*/
function checkIfBoxIsDominated(boxIndex) {
  const boxDominated = playerBoxDominated.some(
    (box) => box.x === boxIndex.x && box.y === boxIndex.y
  );
  return boxDominated;
}

//Todo: apparently this function is useless
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

function changeHorseIndex(newIndex) {
  playerHorseIndex = newIndex;
}



/* This function updates the horse valid moves, that is, the possible moves that player's horse can be take   */
function updateValidMoves() {
  validMoves = [];
  let possibleMove = {};
  //up
  //up-left
  possibleMove = { x: playerHorseIndex.x - 1, y: playerHorseIndex.y - 2 };
  if (checkTableLimits(possibleMove) && !checkIfBoxIsDominated(possibleMove)) {
    validMoves.push(possibleMove);
  }
  //up-right
  possibleMove = { x: playerHorseIndex.x + 1, y: playerHorseIndex.y - 2 };
  if (checkTableLimits(possibleMove) && !checkIfBoxIsDominated(possibleMove)) {
    validMoves.push(possibleMove);
  }
  //down
  //down-left
  possibleMove = { x: playerHorseIndex.x - 1, y: playerHorseIndex.y + 2 };
  if (checkTableLimits(possibleMove) && !checkIfBoxIsDominated(possibleMove)) {
    validMoves.push(possibleMove);
  }
  //down-right
  possibleMove = { x: playerHorseIndex.x + 1, y: playerHorseIndex.y + 2 };
  if (checkTableLimits(possibleMove) && !checkIfBoxIsDominated(possibleMove)) {
    validMoves.push(possibleMove);
  }
  //left
  //left-top
  possibleMove = { x: playerHorseIndex.x - 2, y: playerHorseIndex.y - 1 };
  if (checkTableLimits(possibleMove) && !checkIfBoxIsDominated(possibleMove)) {
    validMoves.push(possibleMove);
  }
  //left-down
  possibleMove = { x: playerHorseIndex.x - 2, y: playerHorseIndex.y + 1 };
  if (checkTableLimits(possibleMove) && !checkIfBoxIsDominated(possibleMove)) {
    validMoves.push(possibleMove);
  }
  //Right
  //Right-top
  possibleMove = { x: playerHorseIndex.x + 2, y: playerHorseIndex.y - 1 };
  if (checkTableLimits(possibleMove) && !checkIfBoxIsDominated(possibleMove)) {
    validMoves.push(possibleMove);
  }
  //Right-left
  possibleMove = { x: playerHorseIndex.x + 2, y: playerHorseIndex.y + 1 };
  if (checkTableLimits(possibleMove) && !checkIfBoxIsDominated(possibleMove)) {
    validMoves.push(possibleMove);
  }
}

/* This function checks if the box is within the limits to move*/
function checkTableLimits(boxIndex) {
  let canMove = false;
  if (
    boxIndex.x >= 0 &&
    boxIndex.x <= boxesPerRow - 1 &&
    boxIndex.y >= 0 &&
    boxIndex.y <= boxesPerRow - 1
  ) {
    canMove = true;
  }
  return canMove;
}



