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

export default class Controller {
    constructor() {
        this.turn = IA_TURN;
        this.boxesPerRow = 8;
        this.boxesPerColumn = 8;
    }

    createInitialGameboard() {
        this.bonusIndex = [];
        this.playerHorseIndex = { x: this.generateRandomIndex(), y: this.generateRandomIndex() }
        this.iaHorseIndex = { x: this.generateRandomIndex(), y: this.generateRandomIndex() }

        for (let i = 0; i < 3; i++) {
            this.bonusIndex.push({ x: this.generateRandomIndex(), y: this.generateRandomIndex() })
        }

        this.gameboard = [];
        for (let row = 0; row < this.boxesPerRow; row++) {
            this.gameboard.push([]);
        }
        for (let i = 0; i < this.boxesPerRow; i++) {
            for (let j = 0; j < this.boxesPerColumn; j++) {
                this.gameboard[i][j] = EMPTY;
            }
        }
        console.log(this.gameboard)



    }

    //Generates number from zero to this.boxesPerRow - 1
    generateRandomIndex() {
        return Math.floor(Math.random() * this.boxesPerRow);
    }


    executeMinimax() {
        this.miniMax = new MiniMax();
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
}