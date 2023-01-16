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
const LEVEL = prompt("Escoge el nivel (2, 4, 6)")

export default class Controller {
  constructor() {
    this.turn = PLAYER_TURN;
    this.boxesPerRow = 8;
    this.boxesPerColumn = 8;
  }

  createInitialGameboard() {
    this.gameboard = [];
    for (let row = 0; row < this.boxesPerRow; row++) {
      this.gameboard.push([]);
    }
    for (let y = 0; y < this.boxesPerRow; y++) {
      for (let x = 0; x < this.boxesPerColumn; x++) {
        this.gameboard[y][x] = EMPTY;
      }
    }
    this.bonusIndex = [];
    this.playerHorseIndex = this.generateNonSuperPositionIndex();

    this.gameboard[this.playerHorseIndex.y][this.playerHorseIndex.x] =
      PLAYER_HORSE;
    this.iaHorseIndex = this.generateNonSuperPositionIndex();
    this.gameboard[this.iaHorseIndex.y][this.iaHorseIndex.x] = IA_HORSE;

    for (let i = 0; i < 3; i++) {
      const index = this.generateBonusIndex();
      this.bonusIndex.push(index);
      this.gameboard[index.y][index.x] = BONUS;
    }

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

  generateNonSuperPositionIndex() {
    let possiblePosition = {};
    while (true) {
      possiblePosition = this.generateRandomIndex();
      if (this.gameboard[possiblePosition.y][possiblePosition.x] == EMPTY) {
        break;
      }
    }

    return possiblePosition;
  }

  generateBonusIndex() {
    let possiblePosition = {};
    while (true) {
      possiblePosition = this.generateRandomIndex();

      if (this.conditions(possiblePosition)) {
        break;
      }
    }
    return possiblePosition;
  }

  conditions(possiblePosition) {
    //check this later
    let condition =
      this.gameboard[possiblePosition.y][possiblePosition.x] == EMPTY;

    if (possiblePosition.x >= 0 && possiblePosition.x < 7) {
      condition =
        condition &&
        this.gameboard[possiblePosition.y][possiblePosition.x + 1] != BONUS;
    }
    if (possiblePosition.x <= 7 && possiblePosition.x > 0) {
      condition =
        condition &&
        this.gameboard[possiblePosition.y][possiblePosition.x - 1] != BONUS;
    }
    if (possiblePosition.y >= 0 && possiblePosition.y < 7) {
      condition =
        condition &&
        this.gameboard[possiblePosition.y + 1][possiblePosition.x] != BONUS;
    }
    if (possiblePosition.y <= 7 && possiblePosition.y > 0) {
      condition =
        condition &&
        this.gameboard[possiblePosition.y - 1][possiblePosition.x] != BONUS;
    }
    if (
      possiblePosition.x >= 0 &&
      possiblePosition.x < 7 &&
      possiblePosition.y <= 7 &&
      possiblePosition.y > 0
    ) {
      condition =
        condition &&
        this.gameboard[possiblePosition.y - 1][possiblePosition.x + 1] != BONUS;
    }
    if (
      possiblePosition.y <= 7 &&
      possiblePosition.y > 0 &&
      possiblePosition.x <= 7 &&
      possiblePosition.x > 0
    ) {
      condition =
        condition &&
        this.gameboard[possiblePosition.y - 1][possiblePosition.x - 1] != BONUS;
    }
    if (
      possiblePosition.y >= 0 &&
      possiblePosition.y < 7 &&
      possiblePosition.x <= 7 &&
      possiblePosition.x > 0
    ) {
      condition =
        condition &&
        this.gameboard[possiblePosition.y + 1][possiblePosition.x - 1] != BONUS;
    }
    if (
      possiblePosition.y >= 0 &&
      possiblePosition.y < 7 &&
      possiblePosition.x >= 0 &&
      possiblePosition.x < 7
    ) {
      condition =
        condition &&
        this.gameboard[possiblePosition.y + 1][possiblePosition.x + 1] != BONUS;
    }
    return condition;
  }

  setPlayerHorseIndex(index) {
    this.playerHorseIndex = index
  }
  setBonusIndex(index) {
    this.bonusIndex = index
  }
  //ToDo: delete minimax instance
  executeMinimax() {
    const miniMax = new MiniMax([...this.gameboard]);

    miniMax.setMaxDepth(LEVEL);
    miniMax.setPlayerHorseIndex(this.playerHorseIndex)
    miniMax.setIaHorseIndex(this.iaHorseIndex)
    miniMax.setBonusIndex([...this.bonusIndex])
    const previousIaHorseIndex = this.iaHorseIndex;
    this.gameboard[this.iaHorseIndex.y][this.iaHorseIndex.x] = DOMINATED_BY_IA;
    this.iaHorseIndex = miniMax.executeMinimax() //when blocked, this remains running and returning index
    if (this.iaHorseIndex.x == previousIaHorseIndex.x && this.iaHorseIndex.y == previousIaHorseIndex.y) {
      this.iaBlocked = true;
    }
    console.log("iahorseindex in controller", this.iaHorseIndex)
    // this.iaHorseIndex = this.generateRandomIndex();
    if (this.gameboard[this.iaHorseIndex.y][this.iaHorseIndex.x] == BONUS) {
      this.dominateAdjacents(this.iaHorseIndex);
    }
    this.gameboard[this.iaHorseIndex.y][this.iaHorseIndex.x] = IA_HORSE;
    if (!this.playerBlocked) {
      this.changeTurn();
    }
    console.log("Controller: FINISH EXECUTE MINIMAX", this.gameboard)
    return this.iaHorseIndex;
  }

  setPlayerBlocked() {
    this.playerBlocked = true;
  }
  getIaBlocked() {
    return this.iaBlocked;
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
    let correct = false;
    if (
      boxIndex.x >= 0 &&
      boxIndex.x <= 7 &&
      boxIndex.y >= 0 &&
      boxIndex.y <= 7
    ) {
      correct = true;
    }
    return correct;
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
