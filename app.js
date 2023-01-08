const boxesPerRow = 8;

let black;
let white;

function preload() {
  black = loadImage("src/images/black.png");
  white = loadImage("src/images/white.png");
}

function setup() {
  preload();
  createCanvas(500, 500);
}

function draw() {
  background(220);

  drawGrid();
}

function drawGrid() {
  let column = 0;
  let row = 0;
  for (let x = 0; x <= width; x += width / boxesPerRow) {
    for (let y = 0; y <= height; y += height / boxesPerRow) {
      image(black, x, y);
      stroke(0);
      strokeWeight(1);
      line(x, 0, x, height);
      line(0, y, width, y);

      column++;
    }
    row++;
  }
}

//THIS MAKES THE CODE WORK
window.setup = setup;
window.draw = draw;
