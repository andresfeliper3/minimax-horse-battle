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
let gameOver = false;

let iaBoxesAcum;
let playerBoxesAcum;

let playerHorseIndex = controller.getPlayerHorseIndex();
let iaHorseIndex = controller.getIaHorseIndex();

let validMoves = [];

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

  const playerBackgroundColor = "green";
  paintPlayer(playerHorseIndex, whiteHorseImage, playerBackgroundColor);
  updateValidMoves();
}

function drawGrid() {
  let accum = 0;
  iaBoxesAcum = 1;
  playerBoxesAcum = 1;
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
      //
      const position = { x, y };
      if (
        controller.getGameBoard()[getIndexFromPosition(position).y][
          getIndexFromPosition(position).x
        ] == BONUS
      ) {
        paintBonus(position);
      }

      if (
        controller.getGameBoard()[getIndexFromPosition(position).y][
          getIndexFromPosition(position).x
        ] == DOMINATED_BY_PLAYER
      ) {
        paintBox(getIndexFromPosition(position), "green");
        playerBoxesAcum++;
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
        iaBoxesAcum++;
      }

      //Draw the possible horse moves
      validMoves.forEach((Vmove) => {
        paintPossibleMove(Vmove, "blue");
      });
    }
    accum++;
  }
}

function paintBonus(index) {
  image(bonusImage, index.x, index.y);
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
    //updateValidMoves(); //update the possible moves that the horse can to do
    gameBoard[playerHorseIndex.y][playerHorseIndex.x] = PLAYER_HORSE;
    controller.changeTurn();

    updateValidMoves();
    if (validMoves.length == 0) {
      controller.setPlayerBlocked();
      let timer = setInterval(() => {
        controller.executeMinimax();
        if (controller.getIaBlocked()) {
          console.log(
            "Game over, Ia Boxes: ",
            iaBoxesAcum,
            " Player Boxes: ",
            playerBoxesAcum,
            " ",
            calculateWinner(),
            " Wins!"
          );
          clearInterval(timer);
          alert(`${calculateWinner().toString()} WINS`);
        }
      }, 1000);
    } else {
      setTimeout(() => {
        controller.executeMinimax();
      }, 0);
    }
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
  let boxDominated;
  if (
    controller.getGameBoard()[boxIndex.y][boxIndex.x] == IA_HORSE ||
    controller.getGameBoard()[boxIndex.y][boxIndex.x] == DOMINATED_BY_IA ||
    controller.getGameBoard()[boxIndex.y][boxIndex.x] == DOMINATED_BY_PLAYER
  ) {
    boxDominated = true;
  }

  return boxDominated;
}

/*This function checks if the box has a bonus*/
function checkIfBoxHasBonus(boxIndex) {
  let boxWithBonus;
  if (controller.getGameBoard()[boxIndex.y][boxIndex.x] == BONUS) {
    boxWithBonus = true;
  }
  return boxWithBonus;
}

/*This function dominates the boxes adjacents to the bonus*/
function dominateAdjacents(boxIndex) {
  let possibleBox = {};
  let gameBoard = controller.getGameBoard();

  //left
  possibleBox = { x: boxIndex.x - 1, y: boxIndex.y };
  if (checkTableLimits(possibleBox) && !checkIfBoxIsDominated(possibleBox)) {
    gameBoard[possibleBox.y][possibleBox.x] = DOMINATED_BY_PLAYER;
  }
  //right
  possibleBox = { x: boxIndex.x + 1, y: boxIndex.y };
  if (checkTableLimits(possibleBox) && !checkIfBoxIsDominated(possibleBox)) {
    gameBoard[possibleBox.y][possibleBox.x] = DOMINATED_BY_PLAYER;
  }
  //up
  possibleBox = { x: boxIndex.x, y: boxIndex.y - 1 };
  if (checkTableLimits(possibleBox) && !checkIfBoxIsDominated(possibleBox)) {
    gameBoard[possibleBox.y][possibleBox.x] = DOMINATED_BY_PLAYER;
  }
  //down
  possibleBox = { x: boxIndex.x, y: boxIndex.y + 1 };
  if (checkTableLimits(possibleBox) && !checkIfBoxIsDominated(possibleBox)) {
    gameBoard[possibleBox.y][possibleBox.x] = DOMINATED_BY_PLAYER;
  }
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
  controller.setPlayerHorseIndex(playerHorseIndex);
}

function calculateWinner() {
  let winner = "";
  if (iaBoxesAcum > playerBoxesAcum) {
    winner = "MACHINE";
  } else if (iaBoxesAcum < playerBoxesAcum) {
    winner = "PLAYER";
  } else if ((iaBoxesAcum = playerBoxesAcum)) {
    winner = "DRAW";
  } else {
    winner = "Not defined yet";
  }
  return winner;
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
