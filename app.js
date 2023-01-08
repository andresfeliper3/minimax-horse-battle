const boxesPerRow = 8;

let black;
let white;

function preload() {
    black = loadImage("src/images/black.png");
    white = loadImage("src/images/white.png");
}
let boxWidth;
let boxHeight;

function setup() {
    preload();
    createCanvas(500, 500);
}

function draw() {
    background(220);

    boxWidth = width / boxesPerRow;
    boxHeight = height / boxesPerRow;
    drawGrid();

    paintBox();


}

function drawGrid() {
    let grid = [[], [], [], [], [], [], [], []];
    let column = 0;
    let row = 0;
    for (let y = 0; y < height; y += boxHeight) {
        for (let x = 0; x < width; x += boxWidth) {
            image(black, x, y);
            stroke(0);
            strokeWeight(1);
            square(x, y, boxWidth);
            // line(x, 0, x, height); //vertical
            // stroke(100, 200, 200);
            // line(0, y, width, y); //horizontal
            grid[row][column] = { x: x, y: y }
            column++;
        }
        row++;
    }
}


function paintBox() {
    if (mouseIsPressed) {
        fill(100, 255, 100);
        square(mouseX, mouseY, width / boxesPerRow);
    }
}


//THIS MAKES THE CODE WORK
window.setup = setup;
window.draw = draw;
