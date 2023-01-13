import MiniMax from "./MiniMax.js";

/** GAMEBOARD CONSTANTS */
const EMPTY = 0;
const PLAYER_HORSE = 1;
const IA_HORSE = 2;
const BONUS = 3;
const DOMINATED_BY_PLAYER = 4;
const DOMINATED_BY_IA = 5;

/* TURN CONSTANTS */
const IA_TURN = true;
const PLAYER_TURN = false;

/*DIFICULT */
const LEVEL = 2;

export default class Controller {
  constructor() {
    this.turn = PLAYER_TURN;
    this.boxesPerRow = 8;
    this.boxesPerColumn = 8;
  }

  createInitialGameboard() {
    this.bonusIndex = [];
    this.playerHorseIndex = this.generateRandomIndex();
    this.iaHorseIndex = this.generateRandomIndex();
    console.log("original: ", this.iaHorseIndex);
    for (let i = 0; i < 3; i++) {
      this.bonusIndex.push(this.generateRandomIndex());
    }

    this.gameboard = [];
    for (let row = 0; row < this.boxesPerRow; row++) {
      this.gameboard.push([]);
    }
    for (let y = 0; y < this.boxesPerRow; y++) {
      for (let x = 0; x < this.boxesPerColumn; x++) {
        this.gameboard[y][x] = EMPTY;
      }
    }

    this.gameboard[this.playerHorseIndex.y][this.playerHorseIndex.x] =
      PLAYER_HORSE;
    this.gameboard[this.iaHorseIndex.y][this.iaHorseIndex.x] = IA_HORSE;
    this.bonusIndex.forEach((bonus) => {
      this.gameboard[bonus.y][bonus.x] = BONUS;
    });
    console.log(this.iaHorseIndex);
    console.log(this.gameboard);
  }

  //Generates number from zero to this.boxesPerRow - 1
  generateRandomIndex() {
    return {
      x: Math.floor(Math.random() * this.boxesPerRow),
      y: Math.floor(Math.random() * this.boxesPerColumn),
    };
  }

  //ToDo: delete minimax instance
  executeMinimax() {
    const miniMax = new MiniMax(this.gameboard);
    miniMax.setMaxDepth(LEVEL);
    this.gameboard[this.iaHorseIndex.y][this.iaHorseIndex.x] = DOMINATED_BY_IA;
    //this.iaHorseIndex = miniMax.getDecision();
    this.iaHorseIndex = this.generateRandomIndex();
    if (this.gameboard[this.iaHorseIndex.y][this.iaHorseIndex.x] == BONUS) {
      this.dominateAdjacents(this.iaHorseIndex);
    }
    this.gameboard[this.iaHorseIndex.y][this.iaHorseIndex.x] = IA_HORSE;
    this.changeTurn();
  }

  changeTurn() {
    this.turn = !this.turn;
  }
  setTurn(turn) {
    this.turn = turn;
  }

  getTurn() {
    return this.turn;
  }
  getPlayerHorseIndex() {
    return this.playerHorseIndex;
  }

  getIaHorseIndex() {
    return this.iaHorseIndex;
  }

  getBonusIndex() {
    return this.bonusIndex;
  }

  setGameBoard(gameBoard) {
    this.gameboard = gameBoard;
  }

  getGameBoard() {
    return this.gameboard;
  }

  /* This function checks if the box is within the limits to move*/
  checkTableLimits(boxIndex) {
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

  /*This function checks if the box is dominated*/
  checkIfBoxIsDominated(boxIndex) {
    let boxDominated;
    if (
      this.getGameBoard()[boxIndex.y][boxIndex.x] == IA_HORSE ||
      this.getGameBoard()[boxIndex.y][boxIndex.x] == DOMINATED_BY_IA ||
      this.getGameBoard()[boxIndex.y][boxIndex.x] == DOMINATED_BY_PLAYER
    ) {
      boxDominated = true;
    }

    return boxDominated;
  }

  /*This function dominates the boxes adjacents to the bonus*/
  dominateAdjacents(boxIndex) {
    let possibleBox = {};

    //left
    possibleBox = { x: boxIndex.x - 1, y: boxIndex.y };
    if (
      this.checkTableLimits(possibleBox) &&
      !this.checkIfBoxIsDominated(possibleBox)
    ) {
      this.gameboard[possibleBox.y][possibleBox.x] = DOMINATED_BY_IA;
    }
    //right
    possibleBox = { x: boxIndex.x + 1, y: boxIndex.y };
    if (
      this.checkTableLimits(possibleBox) &&
      !this.checkIfBoxIsDominated(possibleBox)
    ) {
      this.gameboard[possibleBox.y][possibleBox.x] = DOMINATED_BY_IA;
    }
    //up
    possibleBox = { x: boxIndex.x, y: boxIndex.y - 1 };
    if (
      this.checkTableLimits(possibleBox) &&
      !this.checkIfBoxIsDominated(possibleBox)
    ) {
      this.gameboard[possibleBox.y][possibleBox.x] = DOMINATED_BY_IA;
    }
    //down
    possibleBox = { x: boxIndex.x, y: boxIndex.y + 1 };
    if (
      this.checkTableLimits(possibleBox) &&
      !this.checkIfBoxIsDominated(possibleBox)
    ) {
      this.gameboard[possibleBox.y][possibleBox.x] = DOMINATED_BY_IA;
    }
  }
}
