let dots = [];
let spacing = 30;
let loopSize = spacing * 0.8;
let current;
let upIndex = 0;
let downIndex = 0;
let leftIndex = 0;
let rightIndex = 0;
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
    noFill();
    strokeWeight(3);
    arc(0, 0, loopSize, loopSize, angleA, angleB);
    pop();
  }
}

function drawUpwards() {
  let nextDot = dots.find(dot => dot.i === current.i - 1 && dot.j === current.j);
  if (nextDot) {
    let angleA, angleB;

    // Alternate the crossing pattern for each up movement
    if (upIndex % 4 === 0) {
      angleA = QUARTER_PI + HALF_PI;
      angleB = QUARTER_PI + TWO_PI;
      stroke(255, 165, 0); // Orange
    } else if (upIndex % 4 === 1) {
      angleA = PI + QUARTER_PI;
      angleB = PI + QUARTER_PI + TWO_PI;
      stroke(220, 20, 60); // Red
    } else if (upIndex % 4 === 2) {
      angleA = PI + HALF_PI;
      angleB = PI + HALF_PI + TWO_PI;
      stroke(30, 144, 255); // Blue
    } else if (upIndex % 4 === 3) {
      angleA = HALF_PI;
      angleB = HALF_PI + TWO_PI;
      stroke(50, 205, 50); // Green
    }

    drawConnectingLine(nextDot, angleA, angleB);
    drawPartialArc(nextDot, angleA, angleB);

    current = nextDot; // Update current to the next dot
    upIndex++;
  }
}

function drawDownwards() {
  let nextDot = dots.find(dot => dot.i === current.i + 1 && dot.j === current.j);
  if (nextDot) {
    let angleA, angleB;

    // Alternate the crossing pattern for each down movement
    if (downIndex % 4 === 0) {
      angleA = QUARTER_PI + HALF_PI;
      angleB = QUARTER_PI + TWO_PI;
      stroke(255, 69, 0); // Orange
    } else if (downIndex % 4 === 1) {
      angleA = PI + QUARTER_PI;
      angleB = PI + QUARTER_PI + TWO_PI;
      stroke(139, 0, 0); // Dark Red
    } else if (downIndex % 4 === 2) {
      angleA = PI + HALF_PI;
      angleB = PI + HALF_PI + TWO_PI;
      stroke(0, 0, 255); // Blue
    } else if (downIndex % 4 === 3) {
      angleA = HALF_PI;
      angleB = HALF_PI + TWO_PI;
      stroke(34, 139, 34); // Forest Green
    }

    drawConnectingLine(nextDot, angleA, angleB);
    drawPartialArc(nextDot, angleA, angleB);

    current = nextDot; // Update current to the next dot
    downIndex++;
  }
}

function drawLeftwards() {
  let nextDot = dots.find(dot => dot.i === current.i && dot.j === current.j - 1);
  if (nextDot) {
    let angleA, angleB;

    // Alternate the crossing pattern for each left movement
    if (leftIndex % 4 === 0) {
      angleA = PI + QUARTER_PI;
      angleB = PI + QUARTER_PI + TWO_PI;
      stroke(255, 140, 0); // Dark Orange
    } else if (leftIndex % 4 === 1) {
      angleA = QUARTER_PI;
      angleB = QUARTER_PI + TWO_PI;
      stroke(178, 34, 34); // Firebrick
    } else if (leftIndex % 4 === 2) {
      angleA = HALF_PI;
      angleB = HALF_PI + TWO_PI;
      stroke(70, 130, 180); // Steel Blue
    } else if (leftIndex % 4 === 3) {
      angleA = PI + HALF_PI;
      angleB = PI + HALF_PI + TWO_PI;
      stroke(107, 142, 35); // Olive Green
    }

    drawConnectingLine(nextDot, angleA, angleB);
    drawPartialArc(nextDot, angleA, angleB);

    current = nextDot; // Update current to the next dot
    leftIndex++;
  }
}

function drawRightwards() {
  let nextDot = dots.find(dot => dot.i === current.i && dot.j === current.j + 1);
  if (nextDot) {
    let angleA, angleB;

    // Alternate the crossing pattern for each right movement
    if (rightIndex % 4 === 0) {
      angleA = QUARTER_PI;
      angleB = QUARTER_PI + TWO_PI;
      stroke(255, 215, 0); // Gold
    } else if (rightIndex % 4 === 1) {
      angleA = PI + QUARTER_PI;
      angleB = PI + QUARTER_PI + TWO_PI;
      stroke(178, 34, 34); // Firebrick
    } else if (rightIndex % 4 === 2) {
      angleA = PI + HALF_PI;
      angleB = PI + HALF_PI + TWO_PI;
      stroke(0, 191, 255); // Deep Sky Blue
    } else if (rightIndex % 4 === 3) {
      angleA = HALF_PI;
      angleB = HALF_PI + TWO_PI;
      stroke(60, 179, 113); // Medium Sea Green
    }

    drawConnectingLine(nextDot, angleA, angleB);
    drawPartialArc(nextDot, angleA, angleB);

    current = nextDot; // Update current to the next dot
    rightIndex++;
  }
}

function keyPressed() {
  if (keyCode == UP_ARROW) {
    navigateUp();
  }
  if (keyCode == DOWN_ARROW) {
    navigateDown();
  }
  if (keyCode == LEFT_ARROW) {
    navigateLeft();
  }
  if (keyCode == RIGHT_ARROW) {
    navigateRight();
  }
}

function navigateUp() {
  for (let k = 0; k < dots.length; k++) {
    if (dots[k].i == current.i - 1 && dots[k].j == current.j) {
      drawUpwards(); // Draw the new arc crossing
      return;
    }
  }
}

function navigateDown() {
  for (let k = 0; k < dots.length; k++) {
    if (dots[k].i == current.i + 1 && dots[k].j == current.j) {
      drawDownwards(); // Draw the new arc crossing
      return;
    }
  }
}

function navigateLeft() {
  for (let k = 0; k < dots.length; k++) {
    if (dots[k].i == current.i && dots[k].j == current.j - 1) {
      drawLeftwards(); // Draw the new arc crossing
      return;
    }
  }
}

function navigateRight() {
  for (let k = 0; k < dots.length; k++) {
    if (dots[k].i == current.i && dots[k].j == current.j + 1) {
      drawRightwards(); // Draw the new arc crossing
      return;
    }
  }
}