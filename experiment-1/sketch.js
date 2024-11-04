// control point distance
let cpd;
let cellw = 40;
let path = "";
let addedBoundaryPath = false;
const axi = new axidraw.AxiDraw();
let connected = false;
let saveButton;

function setup() {
  createCanvas(windowWidth, windowHeight, SVG); // Change the renderer to SVG
  console.log(width, height);
  noFill();
  cpd = 4 * (sqrt(2) - 1) / 3;
  frameRate(30);

  // Create a button to save the SVG
  saveButton = createButton('Save SVG');
  saveButton.position(10, 10);
  saveButton.mousePressed(saveDrawing);
}

function saveDrawing() {
  save("path_drawing.svg"); // Saves the canvas as an SVG file
}

function mouseClicked() {
  if (!connected) {
    axi.connect().then(() => {
      connected = true;
    });
  }
}

function drawBezierArc(x, y, radius, cpd, pointCount = 16) {
  // Bezier control points relative to (x, y)
  const cp1X = x + radius * 0;
  const cp1Y = y - radius * cpd;
  const cp2X = x + radius * (1 - cpd);
  const cp2Y = y - radius;
  const endX = x + radius * 1;
  const endY = y - radius;

  const startX = x + radius * 0;
  const startY = y + 0;

  beginShape();
  vertex(startX, startY);

  for (let t = 0; t <= 1; t += 1 / pointCount) {
    const xPoint = (1 - t) ** 3 * startX +
                   3 * (1 - t) ** 2 * t * cp1X +
                   3 * (1 - t) * t ** 2 * cp2X +
                   t ** 3 * endX;

    const yPoint = (1 - t) ** 3 * startY +
                   3 * (1 - t) ** 2 * t * cp1Y +
                   3 * (1 - t) * t ** 2 * cp2Y +
                   t ** 3 * endY;

    vertex(xPoint, yPoint);
  }

  endShape();
}

function drawArc(x, y, radius, startAngle, endAngle, pointCount = 16) {
  const angleInc = (endAngle - startAngle) / pointCount;
  const x1 = radius * cos(startAngle);
  const y1 = radius * sin(startAngle);
  
  beginShape();
  vertex(x + x1, y + y1);

  for (let i = 0; i <= pointCount; i += 1) {
    const angle = startAngle + i * angleInc;
    const relX = radius * cos(angle);
    const relY = radius * sin(angle);

    vertex(x + relX, y + relY);
  }

  endShape();
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
  background(255);
  fill(0);
  noStroke();
  textSize(16);
  textAlign(CENTER, TOP);
  text("Path: " + path, width / 2, 10);

  scale(cellw);
  translate(width / (2 * cellw), height / (2 * cellw));
  rotate(HALF_PI / 2);
  noFill();
  stroke(0);
  strokeWeight(2 / cellw);

  let currentX = 0;
  let currentY = 0;

  for (let i = 0; i < path.length; i++) {
    let currentChar = path.charAt(i);

    switch (currentChar) {
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

    if ((abs(currentX) > canvasBoundaryX || abs(currentY) > canvasBoundaryY) && !addedBoundaryPath) {
      path += 'rrs';
      addedBoundaryPath = true;
      console.log("RRSING!!");
      break;
    }
  }

  // if (frameCount > 100 && frameCount % 20 === 0) {
  //   let randomChar = random(['r', 's', 'l']);
  //   path += randomChar;
  //   addedBoundaryPath = false;
  //   redraw();
  // }
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    path += 'r';
  } else if (keyCode === LEFT_ARROW) {
    path += 'l';
  } else if (keyCode === UP_ARROW) {
    path += 's';
  } else if (keyCode === 13) {
    path += 'R';
  } else if (keyCode === 16) {
    path += 'L';
  }
  redraw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
