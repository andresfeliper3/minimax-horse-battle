const boxesPerRow = 8;

let black;
let white;
let boxWidth;
let boxHeight;

let lastMove = {};

function preload() {
    black = loadImage("src/images/black.png");
    white = loadImage("src/images/white.png");
}


function setup() {
    preload();
    createCanvas(500, 500);
    background(220);
}

function draw() {
    boxWidth = width / boxesPerRow;
    boxHeight = height / boxesPerRow;

    drawGrid();

    dominateBox();

}

function drawGrid() {
    let column = 0;
    let row = 0;
    for (let x = 0; x < width; x += boxWidth) {
        for (let y = 0; y < height; y += boxHeight) {
            stroke(0);
            strokeWeight(1);
            line(x, 0, x, height); //vertical
            line(0, y, width, y); //horizontal
            column++;
        }
        row++;
    }
}


function dominateBox() {
    if (mouseIsPressed) {
        eraseHorse("green");
        calculateAndPaintBox("green");
    }
}

function eraseHorse(color) {
    fill(color);
    rect(lastMove.x, lastMove.y, boxWidth, boxHeight)
}
function calculateAndPaintBox(color) {
    let boxIndex = calculateBoxIndex();
    let position = { x: boxIndex.row * boxWidth, y: boxIndex.col * boxHeight }
    paintBox(position, color)
}

function calculateBoxIndex() {
    let boxRow = Math.floor(mouseX / boxWidth);
    let boxCol = Math.floor(mouseY / boxHeight);
    return { row: boxRow, col: boxCol }
}

function paintBox(position, color) {
    fill(color);
    rect(position.x, position.y, boxWidth, boxHeight)
    image(white, position.x, position.y);
    lastMove = { x: position.x, y: position.y };
}





//THIS MAKES THE CODE WORK
window.setup = setup;
window.draw = draw;
