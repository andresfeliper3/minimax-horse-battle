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
}
