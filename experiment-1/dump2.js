let dots = [];
let spacing = 30;
let loopSize = spacing * 0.8;
let current;
let downIndex = 0;
let upIndex = 0;
let rows = 11;
let cols = 11;

function setup() {
  createCanvas(400, 400);
  background(255);
  noLoop();
  rectMode(CENTER);
  drawGrid();
  current = dots[0];
  drawFirstArc(); // Draw the initial arc
}

function drawGrid() {
  dots = [];

  let centerX = width / 2;
  let centerY = height / 2;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x = centerX + (j - (cols - 1) / 2) * spacing;
      let y = centerY + (i - (rows - 1) / 2) * spacing;

      if (abs(i - (rows - 1) / 2) + abs(j - (cols - 1) / 2) <= (rows - 1) / 2) {
        ellipse(x, y, 5, 5);
        dots.push({ x: x, y: y, i: i, j: j });
      }
    }
  }
}

function drawFirstArc() {
  push();
  translate(current.x, current.y);
  fill(255, 0, 0);
  noFill();
  strokeWeight(3);
  let startAngle = QUARTER_PI + HALF_PI;
  let endAngle = QUARTER_PI + TWO_PI;
  arc(0, 0, loopSize, loopSize, startAngle, endAngle);
  pop();
}

function drawConnectingLine(theNextDot, angleA, angleB) {
  strokeWeight(3);
  line(
    current.x + cos(angleA) * loopSize / 2,
    current.y + sin(angleA) * loopSize / 2,
    theNextDot.x + cos(angleB) * loopSize / 2,
    theNextDot.y + sin(angleB) * loopSize / 2
  );
}

function drawPartialArc(nextDot, angleA, angleB) {
  if (nextDot) {
    push();
    translate(nextDot.x, nextDot.y);
    fill(0, 255, 0);
    noFill();
    strokeWeight(3);
    let startAngle = angleA;
    let endAngle = angleB;
    arc(0, 0, loopSize, loopSize, startAngle, endAngle);
    pop();
  }
}

function drawDownwards() {
  let nextDot = dots.find(dot => dot.i === current.i + 1 && dot.j === current.j);
  if (nextDot) {

    if (downIndex % 2 != 0) {
      drawConnectingLine(nextDot, QUARTER_PI + TWO_PI, QUARTER_PI + TWO_PI + PI);
      drawPartialArc(nextDot, QUARTER_PI + HALF_PI, QUARTER_PI + TWO_PI + PI);
    } else if (downIndex % 2 == 0) {
      drawConnectingLine(nextDot, PI - QUARTER_PI, PI - QUARTER_PI + TWO_PI + PI);
      drawPartialArc(nextDot, PI + QUARTER_PI + HALF_PI, PI + QUARTER_PI + TWO_PI + PI);
    }

    if (downIndex == rows - 1 || downIndex == cols - 1) {
      console.log("END")
      drawPartialArc(nextDot, PI + QUARTER_PI + TWO_PI + PI, QUARTER_PI + TWO_PI + PI);
    }
    current = nextDot; // Update current to the next dot
  }
}

function drawUpwards() {
  let nextDot = dots.find(dot => dot.i === current.i - 1 && dot.j === current.j);
  if (nextDot) {

    if (upIndex % 2 != 0) {
      drawConnectingLine(nextDot, PI - QUARTER_PI, PI - QUARTER_PI + TWO_PI + PI);
      drawPartialArc(nextDot, PI + QUARTER_PI + HALF_PI, PI + QUARTER_PI + TWO_PI + PI);
    } else if (upIndex % 2 == 0) {
      drawConnectingLine(nextDot, QUARTER_PI + TWO_PI, QUARTER_PI + TWO_PI + PI);
      drawPartialArc(nextDot, QUARTER_PI + HALF_PI, QUARTER_PI + TWO_PI + PI);
    }

    if (upIndex == 0) { // If we are at the top of the grid
      console.log("END");
      drawPartialArc(nextDot, QUARTER_PI + TWO_PI + PI, PI + QUARTER_PI + TWO_PI + PI);
    }
    current = nextDot; // Update current to the next dot
    upIndex++;
  }
}


function keyPressed() {
  if (keyCode == DOWN_ARROW) {
    navigateDown();
  }
  if (keyCode == LEFT_ARROW) {
    navigateLeft();
  }
  if (keyCode == RIGHT_ARROW) {
    navigateRight();
  }
  if (keyCode == UP_ARROW) {
    navigateUp();
  }
}

function navigateDown() {
  for (let k = 0; k < dots.length; k++) {
    if (dots[k].i == current.i + 1 && dots[k].j == current.j) {
      downIndex++;
      drawDownwards(); // Draw the new arc
      console.log(downIndex);
      return;
    }
  }
}
