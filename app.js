import Controller from "./algorithm/Controller.js";

/** GAMEBOARD CONSTANTS */
const EMPTY = 0;
const PLAYER_HORSE = 1;
const IA_HORSE = 2;
const BONUS = 3;
const DOMINATED_BY_PLAYER = 4;
const DOMINATED_BY_IA = 5;
const IA_TURN = true;
const PLAYER_TURN = false;

//THIS MAKES THE CODE WORK
window.setup = setup;
window.draw = draw;
window.mouseClicked = mouseClicked;

const controller = new Controller();
controller.createInitialGameboard();

const boxesPerRow = 8;

let blackHorseImage;
let whiteHorseImage;
let bonusImage;
let boxWidth;
let boxHeight;

let playerHorseIndex = controller.getPlayerHorseIndex();
let iaHorseIndex = controller.getIaHorseIndex();

let playerBoxDominated = [];
playerBoxDominated.push(playerHorseIndex);
let validMoves = [];

let bonusIndex = controller.getBonusIndex();

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
      /*
      playerBoxDominated.forEach((box) => {
        paintBox(box, "green");
      });
*/
      //
      const position = { x, y };
      if (
        controller.getGameBoard()[getIndexFromPosition(position).y][
          getIndexFromPosition(position).x
        ] == DOMINATED_BY_PLAYER
      ) {
        paintBox(getIndexFromPosition(position), "green");
      }
      if (
        controller.getGameBoard()[getIndexFromPosition(position).y][
          getIndexFromPosition(position).x
        ] == IA_HORSE
      ) {
        iaHorseIndex = getIndexFromPosition(position);
        paintPlayer(iaHorseIndex, blackHorseImage, "red");
      }
      if (
        controller.getGameBoard()[getIndexFromPosition(position).y][
          getIndexFromPosition(position).x
        ] == DOMINATED_BY_IA
      ) {
        paintBox(getIndexFromPosition(position), "red");
      }

      //Draw the possible horse moves
      validMoves.forEach((Vmove) => {
        paintPossibleMove(Vmove, "blue");
      });
    }
    accum++;
  }
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

/*This function paints rectangles whitout fill to represent the possible moves that player's horse can be take */
function paintPossibleMove(index, color) {
  noFill();
  stroke(color);
  strokeWeight(4);
  const position = getPositionFromIndex(index);
  rect(position.x, position.y, boxWidth, boxHeight);
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
  return { x: index.x * boxWidth, y: index.y * boxHeight };
}

/* Click event */
function mouseClicked() {
  if (controller.getTurn() == PLAYER_TURN) {
    dominateBox();
  }
}

function dominateBox() {
  if (checkHorseMovement()) {
    let gameBoard = controller.getGameBoard();
    gameBoard[playerHorseIndex.y][playerHorseIndex.x] = DOMINATED_BY_PLAYER;
    placePlayerWhereClicked("green"); //paint background color and change horse index
    //checks if the box where the player has moved has a bonus
    if (checkIfBoxHasBonus(playerHorseIndex)) {
      dominateAdjacents(playerHorseIndex); //Horse dominates the adjacents boxes
    }
    playerBoxDominated.push(playerHorseIndex); //save the horse movement to dominate the Box
    updateValidMoves(); //update the possible moves that the horse can to do
    console.log("after play: ", controller.getGameBoard());
    gameBoard[playerHorseIndex.y][playerHorseIndex.x] = PLAYER_HORSE;
    controller.changeTurn();
    controller.executeMinimax();
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

/*This function checks if the box is dominated*/
function checkIfBoxIsDominated(boxIndex) {
  let boxDominated = playerBoxDominated.some(
    (box) => box.x === boxIndex.x && box.y === boxIndex.y
  );
  if (
    controller.getGameBoard()[boxIndex.y][boxIndex.x] == IA_HORSE ||
    controller.getGameBoard()[boxIndex.y][boxIndex.x] == DOMINATED_BY_IA
  ) {
    boxDominated = true;
  }

  return boxDominated;
}

/*This function checks if the box has a bonus*/
function checkIfBoxHasBonus(boxIndex) {
  const boxWithBonus = bonusIndex.some(
    (box) => box.x === boxIndex.x && box.y === boxIndex.y
  );
  return boxWithBonus;
}

/*This function dominates the boxes adjacents to the bonus*/
function dominateAdjacents(boxIndex) {
  let possibleBox = {};
  //top
  possibleBox = { x: boxIndex.x - 1, y: boxIndex.y };
  if (checkTableLimits(possibleBox) && !checkIfBoxIsDominated(possibleBox)) {
    playerBoxDominated.push(possibleBox);
  }
  //down
  possibleBox = { x: boxIndex.x + 1, y: boxIndex.y };
  if (checkTableLimits(possibleBox) && !checkIfBoxIsDominated(possibleBox)) {
    playerBoxDominated.push(possibleBox);
  }
  //left
  possibleBox = { x: boxIndex.x, y: boxIndex.y - 1 };
  if (checkTableLimits(possibleBox) && !checkIfBoxIsDominated(possibleBox)) {
    playerBoxDominated.push(possibleBox);
  }
  //right
  possibleBox = { x: boxIndex.x, y: boxIndex.y + 1 };
  if (checkTableLimits(possibleBox) && !checkIfBoxIsDominated(possibleBox)) {
    playerBoxDominated.push(possibleBox);
  }
  updateAvaibleBonuses(boxIndex);
}

function updateAvaibleBonuses(boxIndex) {
  bonusIndex = bonusIndex.filter(
    (box) => box.x !== boxIndex.x || box.y !== boxIndex.y
  );
}

/* This function checks if the box is within the limits to move*/
function checkTableLimits(boxIndex) {
  let canMove = false;
  if (
    boxIndex.x >= 0 &&
    boxIndex.x <= 7 &&
    boxIndex.y >= 0 &&
    boxIndex.y <= 7
  ) {
    canMove = true;
  }
  return canMove;
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
