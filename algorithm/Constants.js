/** GAMEBOARD CONSTANTS */
export const EMPTY = 0;
export const PLAYER_HORSE = 1;
export const IA_HORSE = 2;
export const BONUS = 3;
export const DOMINATED_BY_PLAYER = 4;
export const DOMINATED_BY_IA = 5;
export const IA_TURN = true;
export const PLAYER_TURN = false;

export const MAX = true;
export const MIN = false;


/* This function checks if the box is within the limits to move*/
export function checkTableLimits(boxIndex) {
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
export function checkIfBoxIsDominated(boxIndex, gameboard) {
    let boxDominated;

    if (
        gameboard[boxIndex.y][boxIndex.x] == IA_HORSE ||
        gameboard[boxIndex.y][boxIndex.x] == DOMINATED_BY_IA ||
        gameboard[boxIndex.y][boxIndex.x] == DOMINATED_BY_PLAYER ||
        gameboard[boxIndex.y][boxIndex.x] == PLAYER_HORSE
    ) {
        boxDominated = true;
    }

    return boxDominated;
}

//purpose: pass a matrix by value
export function copy(matrix) {
    return matrix.map((row) => [...row]);
}
