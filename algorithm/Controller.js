import MiniMax from "./MiniMax.js";

import { EMPTY, PLAYER_HORSE, IA_HORSE, BONUS, DOMINATED_BY_PLAYER, DOMINATED_BY_IA, IA_TURN, PLAYER_TURN, MAX, MIN } from "./Constants.js";
import { copy, checkIfBoxIsDominated, checkTableLimits } from "./Constants.js";

/*DIFICULT */
const LEVEL = prompt("Ingrese el nivel de profundidad (2, 4, 6)");

export default class Controller {
  constructor() {
    this.turn = IA_TURN;
    this.boxesPerRow = 8;
    this.boxesPerColumn = 8;
    this.playerPoints = 1;
    this.iaPoints = 1;
    this.createInitialGameboard();
    this.executeMinimax();
  }

  createInitialGameboard() {
    this.gameboard = [];
    this.bonusIndex = [];

    for (let row = 0; row < this.boxesPerRow; row++) {
      this.gameboard.push([]);
    }

    this.placeEveryBoxInGameboardAsEmpty();
    this.placeRandomHorsesInGameboard();
    this.placeRandomBonusInGameboard();
  }

  placeEveryBoxInGameboardAsEmpty() {
    for (let y = 0; y < this.boxesPerRow; y++) {
      for (let x = 0; x < this.boxesPerColumn; x++) {
        this.gameboard[y][x] = EMPTY;
      }
    }
  }

  placeRandomHorsesInGameboard() {
    this.playerHorseIndex = this.generateNonSuperPositionIndex();
    this.iaHorseIndex = this.generateNonSuperPositionIndex();
    this.gameboard[this.playerHorseIndex.y][this.playerHorseIndex.x] = PLAYER_HORSE;
    this.gameboard[this.iaHorseIndex.y][this.iaHorseIndex.x] = IA_HORSE;
  }

  placeRandomBonusInGameboard() {
    for (let i = 0; i < 3; i++) {
      const index = this.generateBonusIndex();
      this.bonusIndex.push(index);
      this.gameboard[index.y][index.x] = BONUS;
    }
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

  //Generates number from zero to this.boxesPerRow - 1
  generateRandomIndex() {
    return {
      x: Math.floor(Math.random() * this.boxesPerRow),
      y: Math.floor(Math.random() * this.boxesPerColumn),
    };
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
    this.playerHorseIndex = index;
  }
  setBonusIndex(index) {
    this.bonusIndex = index;
  }

  executeMinimax() {
    const miniMax = new MiniMax(copy(this.gameboard));

    miniMax.setMaxDepth(LEVEL);
    miniMax.setPlayerHorseIndex(this.playerHorseIndex);
    miniMax.setIaHorseIndex(this.iaHorseIndex);
    miniMax.setBonusIndex([...this.bonusIndex]);


    const previousIaHorseIndex = this.iaHorseIndex;
    this.gameboard[this.iaHorseIndex.y][this.iaHorseIndex.x] = DOMINATED_BY_IA;

    // this.iaHorseIndex = this.generateRandomIndex();
    this.iaHorseIndex = miniMax.executeMinimax(); //when blocked, this remains running and returning index

    if (this.iaHorseIndex.x == previousIaHorseIndex.x && this.iaHorseIndex.y == previousIaHorseIndex.y) {
      this.iaBlocked = true;
    }

    this.dominateAdjacentsWhenIaOnBonus();

    this.gameboard[this.iaHorseIndex.y][this.iaHorseIndex.x] = IA_HORSE;
    if (!this.playerBlocked) {
      this.changeTurn();
    }
    this.updatePoints();
    console.log("Controller: FINISH EXECUTE MINIMAX", this.gameboard);
    return this.iaHorseIndex;
  }

  dominateAdjacentsWhenIaOnBonus() {
    if (this.gameboard[this.iaHorseIndex.y][this.iaHorseIndex.x] == BONUS) {
      this.dominateAdjacents(this.iaHorseIndex);
    }
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



  /*This function dominates the boxes adjacents to the bonus*/
  dominateAdjacents(boxIndex) {
    let possibleBox = {};

    //left
    possibleBox = { x: boxIndex.x - 1, y: boxIndex.y };
    if (
      checkTableLimits(possibleBox) &&
      !checkIfBoxIsDominated(possibleBox, this.gameboard)
    ) {
      this.gameboard[possibleBox.y][possibleBox.x] = DOMINATED_BY_IA;
    }
    //right
    possibleBox = { x: boxIndex.x + 1, y: boxIndex.y };
    if (
      checkTableLimits(possibleBox) &&
      !checkIfBoxIsDominated(possibleBox, this.gameboard)
    ) {
      this.gameboard[possibleBox.y][possibleBox.x] = DOMINATED_BY_IA;
    }
    //up
    possibleBox = { x: boxIndex.x, y: boxIndex.y - 1 };
    if (
      checkTableLimits(possibleBox) &&
      !checkIfBoxIsDominated(possibleBox, this.gameboard)
    ) {
      this.gameboard[possibleBox.y][possibleBox.x] = DOMINATED_BY_IA;
    }
    //down
    possibleBox = { x: boxIndex.x, y: boxIndex.y + 1 };
    if (
      checkTableLimits(possibleBox) &&
      !checkIfBoxIsDominated(possibleBox, this.gameboard)
    ) {
      this.gameboard[possibleBox.y][possibleBox.x] = DOMINATED_BY_IA;
    }
  }

  getIaPoints() {
    return this.IaPoints;
  }

  getPlayerPoints() {
    return this.playerPoints;
  }

  updatePoints() {
    let iaAcc = 0;
    let playerAcc = 0;
    for (let y = 0; y < this.boxesPerRow; y++) {
      for (let x = 0; x < this.boxesPerColumn; x++) {
        if (
          this.gameboard[y][x] == DOMINATED_BY_IA ||
          this.gameboard[y][x] == IA_HORSE
        ) {
          iaAcc++;
        } else if (
          this.gameboard[y][x] == DOMINATED_BY_PLAYER ||
          this.gameboard[y][x] == PLAYER_HORSE
        ) {
          playerAcc++;
        }
      }
    }
    this.iaPoints = iaAcc;
    this.playerPoints = playerAcc;
    let text = "Jugador: " + this.playerPoints + " IA: " + this.iaPoints;
    points.textContent = text;
  }
}
