/** GAMEBOARD CONSTANTS */
import { EMPTY, PLAYER_HORSE, IA_HORSE, BONUS, DOMINATED_BY_PLAYER, DOMINATED_BY_IA, IA_TURN, PLAYER_TURN, MAX, MIN } from "./Constants.js";
import { checkTableLimits, checkIfBoxIsDominated } from "./Constants.js";

export default class Node {
  constructor(
    gameboard,
    iaHorseIndex,
    playerHorseIndex,
    father,
    type,
    previousHorseIndex
  ) {
    this.type = type;
    this.gameboard = gameboard;
    this.playerHorseIndex = playerHorseIndex;
    this.previousHorseIndex = previousHorseIndex;
    this.iaHorseIndex = iaHorseIndex;
    this.father = father;
    this.expanded = false;

    this.setInitialUtility();
    this.dominateAdjacentsWhenOnBonus();

    this.gameboard[iaHorseIndex.y][iaHorseIndex.x] = IA_HORSE;
    this.gameboard[playerHorseIndex.y][playerHorseIndex.x] = PLAYER_HORSE;

    this.setAsDominatedThePreviousPosition();

  }

  setInitialUtility() {
    if (this.type == MAX) {
      this.utility = -Infinity;

    } else {
      this.utility = Infinity;
    }
  }

  dominateAdjacentsWhenOnBonus() {

    if (this.gameboard[this.playerHorseIndex.y][this.playerHorseIndex.x] == BONUS) {
      this.dominateAdjacents(this.playerHorseIndex, DOMINATED_BY_PLAYER);
    }

    if (this.gameboard[this.iaHorseIndex.y][this.iaHorseIndex.x] == BONUS) {
      this.dominateAdjacents(this.iaHorseIndex, DOMINATED_BY_IA);
    }

  }

  setAsDominatedThePreviousPosition() {
    if (this.type == MAX) {
      if (this.father) {
        this.gameboard[this.father.getPlayerHorseIndex().y][this.father.getPlayerHorseIndex().x] = DOMINATED_BY_PLAYER;
      }
    } else {
      this.gameboard[this.father.getIaHorseIndex().y][this.father.getIaHorseIndex().x] = DOMINATED_BY_IA;
    }
  }

  getPreviousHorseIndex() {
    return this.previousHorseIndex;
  }
  getGameboard() {
    return this.gameboard;
  }
  getFather() {
    return this.father;
  }
  setDepth(depth) {
    this.depth = depth;
  }
  getDepth() {
    return this.depth;
  }
  setType(type) {
    this.type = type;
  }
  getType() {
    return this.type;
  }
  setUtility(utility) {
    if (this.type == MAX) {
      if (utility >= this.utility) {
        this.utility = utility;
        return true;
      }
    } else {
      if (utility <= this.utility) {
        this.utility = utility;
        return true;
      }
    }
    return false;
  }
  getUtility() {
    return this.utility;
  }

  setIaHorseIndexSelected(iaHorseIndexSelected) {
    this.iaHorseIndexSelected = iaHorseIndexSelected;
  }
  getIaHorseIndex() {
    return this.iaHorseIndex;
  }
  getPlayerHorseIndex() {
    return this.playerHorseIndex;
  }

  hasExpanded() {
    return this.expanded;
  }
  setExpanded() {
    this.expanded = true;
  }

  generateUtility() {
    // this.updateValidMoves(this.horseIndex)
    // let myPossibleMovesAmount = this.validMoves.length;
    // let fatherPossibleMovesAmount = this.father.getValidMoves().length; //todo

    let dominated = this.countDominatedBoxes();
    let dominatedByMax = dominated[0];
    let dominatedByMin = dominated[1];
    let playerValidMoves = this.updateValidMoves(this.playerHorseIndex).length;
    let iaValidMoves = this.updateValidMoves(this.iaHorseIndex).length;

    this.utility = dominatedByMax - dominatedByMin;

    console.log(
      "PLAYER: ",
      this.playerHorseIndex,
      "IA: ",
      this.iaHorseIndex,
      "UTILITY: ",
      this.utility,
      "PLAYER MOVES: ",
      this.updateValidMoves(this.playerHorseIndex),
      "IA MOVES: ",
      this.updateValidMoves(this.iaHorseIndex),
      "DOM BY PLAYER: ",
      dominatedByMin,
      "DOM BY IA: ",
      dominatedByMax
    );
    /*
    console.log(
      "GENERATED UTILITY in Node",
      this.utility,
      "bymax",
      dominatedByMax,
      "byMin",
      dominatedByMin,
      "iaValidMoves",
      iaValidMoves,
      "playerValidMoves",
      playerValidMoves
    );
    console.log("GAMEBOARD IN TERMINAL NODE", this.gameboard);
    */
  }

  countDominatedBoxes() {
    let dominatedByMax = 0;
    let dominatedByMin = 0;
    for (let y = 0; y < this.gameboard.length; y++) {
      for (let x = 0; x < this.gameboard[y].length; x++) {
        if (
          this.gameboard[y][x] == DOMINATED_BY_IA ||
          this.gameboard[y][x] == IA_HORSE
        ) {
          dominatedByMax++;
        } else if (
          this.gameboard[y][x] == DOMINATED_BY_PLAYER ||
          this.gameboard[y][x] == PLAYER_HORSE
        ) {
          dominatedByMin++;
        }
      }
    }
    return [dominatedByMax, dominatedByMin];
  }


  getDecision() {
    console.log(
      "NODE: getDecision",
      this.iaHorseIndexSelected,
      "Utility:",
      this.getUtility()
    );
    return this.iaHorseIndexSelected;
  }


  /* This function updates the horse valid moves, that is, the possible moves that player's horse can be take   */
  updateValidMoves(horseIndex) {
    let validMoves = [];
    let possibleMove = {};
    //up
    //up-left
    possibleMove = { x: horseIndex.x - 1, y: horseIndex.y - 2 };

    if (
      checkTableLimits(possibleMove) &&
      !checkIfBoxIsDominated(possibleMove, this.gameboard)
    ) {
      validMoves.push(possibleMove);
    }
    //up-right
    possibleMove = { x: horseIndex.x + 1, y: horseIndex.y - 2 };

    if (
      checkTableLimits(possibleMove) &&
      !checkIfBoxIsDominated(possibleMove, this.gameboard)
    ) {
      validMoves.push(possibleMove);
    }
    //down
    //down-left
    possibleMove = { x: horseIndex.x - 1, y: horseIndex.y + 2 };

    if (
      checkTableLimits(possibleMove) &&
      !checkIfBoxIsDominated(possibleMove, this.gameboard)
    ) {
      validMoves.push(possibleMove);
    }
    //down-right
    possibleMove = { x: horseIndex.x + 1, y: horseIndex.y + 2 };

    if (
      checkTableLimits(possibleMove) &&
      !checkIfBoxIsDominated(possibleMove, this.gameboard)
    ) {
      validMoves.push(possibleMove);
    }
    //left
    //left-top
    possibleMove = { x: horseIndex.x - 2, y: horseIndex.y - 1 };

    if (
      checkTableLimits(possibleMove) &&
      !checkIfBoxIsDominated(possibleMove, this.gameboard)
    ) {
      validMoves.push(possibleMove);
    }
    //left-down
    possibleMove = { x: horseIndex.x - 2, y: horseIndex.y + 1 };

    if (
      checkTableLimits(possibleMove) &&
      !checkIfBoxIsDominated(possibleMove, this.gameboard)
    ) {
      validMoves.push(possibleMove);
    }
    //Right
    //Right-top
    possibleMove = { x: horseIndex.x + 2, y: horseIndex.y - 1 };

    if (
      checkTableLimits(possibleMove) &&
      !checkIfBoxIsDominated(possibleMove, this.gameboard)
    ) {
      validMoves.push(possibleMove);
    }
    //Right-left
    possibleMove = { x: horseIndex.x + 2, y: horseIndex.y + 1 };

    if (
      checkTableLimits(possibleMove) &&
      !checkIfBoxIsDominated(possibleMove, this.gameboard)
    ) {
      validMoves.push(possibleMove);
    }
    return validMoves;
  }

  /*This function dominates the boxes adjacents to the bonus*/
  dominateAdjacents(horseIndex, dominate) {
    let possibleBox = {};
    //left
    possibleBox = { x: horseIndex.x - 1, y: horseIndex.y };
    if (
      checkTableLimits(possibleBox) &&
      !checkIfBoxIsDominated(possibleBox, this.gameboard)
    ) {
      this.gameboard[possibleBox.y][possibleBox.x] = dominate;
    }
    //right
    possibleBox = { x: horseIndex.x + 1, y: horseIndex.y };
    if (
      checkTableLimits(possibleBox) &&
      !checkIfBoxIsDominated(possibleBox, this.gameboard)
    ) {
      this.gameboard[possibleBox.y][possibleBox.x] = dominate;
    }
    //up
    possibleBox = { x: horseIndex.x, y: horseIndex.y - 1 };
    if (
      checkTableLimits(possibleBox) &&
      !checkIfBoxIsDominated(possibleBox, this.gameboard)
    ) {
      this.gameboard[possibleBox.y][possibleBox.x] = dominate;
    }
    //down
    possibleBox = { x: horseIndex.x, y: horseIndex.y + 1 };
    if (
      checkTableLimits(possibleBox) &&
      !checkIfBoxIsDominated(possibleBox, this.gameboard)
    ) {
      this.gameboard[possibleBox.y][possibleBox.x] = dominate;
    }
  }
}
