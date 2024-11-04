// control point distance
let cpd;
let cellw = 40;
let path = "r";
let addedBoundaryPath = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  console.log (width, height)
  noFill();
  cpd = 4 * (sqrt(2) - 1) / 3;
  frameRate(30);
}

function right() {
  beginShape();
  vertex(0, 0);
  bezierVertex(0, -cpd, 1 - cpd, -1, 1, -1);
  endShape();
  translate(1, -1);
  rotate(HALF_PI);
}

function left() {
  beginShape();
  vertex(0, 0);
  bezierVertex(0, -cpd, -1 + cpd, -1, -1, -1);
  endShape();
  translate(-1, -1);
  rotate(-HALF_PI);
}

function straight() {
  beginShape();
  vertex(0, 0);
  vertex(0, -2);
  endShape();
  translate(0, -2);
}

function draw() {
  background(115, 93, 93, 10);
  fill(115, 93, 93);
  rect (0, 0, width, 35);
  fill(255);
  noStroke();
  textSize(16);
  textAlign(CENTER, TOP);
  text("Path: " + path, width / 2, 10);

  drawGridOfDots();

  scale(cellw);
  translate(width / (2 * cellw), height / (2 * cellw));
  rotate(HALF_PI / 2);
  noFill();
  stroke(255);
  strokeWeight((2 / cellw)*2);

  let currentX = 0;
  let currentY = 0;

  if (frameCount>600 && frameCount % 200 === 0) {
    path = "r";
    addedBoundaryPath = false;
  }

  for (let i = 0; i < path.length; i++) {
    switch (path.charAt(i)) {
      case 'r':
        right();
        currentX += 1;
        currentY -= 1;
        break;
      case 'l':
        left();
        currentX -= 1;
        currentY -= 1;
        break;
      case 's':
        straight();
        currentY -= 2;
        break;
      case 'R':
        right();
        right();
        right();
        currentX += 3;
        currentY -= 3;
        break;
      case 'L':
        left();
        left();
        left();
        currentX -= 3;
        currentY -= 3;
        break;
    }

    let canvasBoundaryX = width / (cellw);
    let canvasBoundaryY = height / (cellw);
   
    console.log(currentX, currentY);

    // if ((abs(currentX) > canvasBoundaryX || abs(currentY) > canvasBoundaryY) && !addedBoundaryPath) {
    //   path += 'rrs';
    //   addedBoundaryPath = true;
    //   console.log ("RRSING!!")
    //   break;
    }
  

  if (frameCount > 300 && frameCount % 1 === 0) {
    let randomChar = random(['r', 's', 'l', 'r', 's', 'l', 'r', 's', 'l', 'r', 's', 'l', 'r', 's', 'l']);
    path += randomChar;
    addedBoundaryPath = false;
    redraw();
  }
}

function drawGridOfDots() {
  fill(255, 140, 0); // Orange color
  noStroke();
  let dotSpacing = cellw * 2; // Adjusted to better align with arcs and radii

  push();
  translate(width / 2, height / 2);
  rotate(QUARTER_PI);

  for (let x = -width; x < width; x += dotSpacing) {
    for (let y = -height; y < height; y += dotSpacing) {
      ellipse(x - (cpd + cellw) / 1.4, y, 5, 5);
    }
  }

  pop();
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    path += 'r';
  } else if (keyCode === LEFT_ARROW) {
    path += 'l';
  } else if (keyCode === UP_ARROW) {
    path += 's';
  }
  else if (keyCode === 13) {
    path += 'R';
  }
  else if (keyCode === 16) {
    path += 'L';
  }
  redraw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}