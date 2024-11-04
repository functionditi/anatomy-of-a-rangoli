// control point distance
let cpd;
let cellw = 40;
let path = "";
let addedBoundaryPath = false;
const axi = new axidraw.AxiDraw();
let connected = false;


function setup() {
  createCanvas(windowWidth, windowHeight);
  console.log (width, height)
  noFill();
  cpd = 4 * (sqrt(2) - 1) / 3;
  frameRate(30);
}

function mouseClicked() {
  if (!connected) {
    // Note: connect() must be called from a user gesture (e.g. a mouse click) due to
    // browser security restrictions
    axi.connect()
      .then(() => {
        connected = true;
      });
  }

  // Draw a diagonal line
  // axi.penDown();
  // axi.moveTo(10, 10);
  // axi.penUp();
  // axi.moveTo(0, 0);
  
  // Draw a diagonal line, but async
  
  // axi.penDown()
  //   .then(() => axi.moveTo(10, 10))
  //   .then(() => axi.penUp());
}

function drawBezierArc(x, y, radius, cpd, pointCount = 16) {
  // Bezier control points relative to (x, y)
  const cp1X = x + radius * 0;
  const cp1Y = y - radius * cpd;
  const cp2X = x + radius * (1 - cpd);
  const cp2Y = y - radius;
  const endX = x + radius * 1;
  const endY = y - radius;

  // Starting point of the Bezier curve
  const startX = x + radius * 0;
  const startY = y + 0;

  // Move to the start point
  axi.moveTo(startX, startY);
  axi.penDown();

  // Loop to approximate the curve with a series of line segments
  for (let t = 0; t <= 1; t += 1 / pointCount) {
    // Cubic Bezier formula
    const xPoint = (1 - t) ** 3 * startX +
                   3 * (1 - t) ** 2 * t * cp1X +
                   3 * (1 - t) * t ** 2 * cp2X +
                   t ** 3 * endX;

    const yPoint = (1 - t) ** 3 * startY +
                   3 * (1 - t) ** 2 * t * cp1Y +
                   3 * (1 - t) * t ** 2 * cp2Y +
                   t ** 3 * endY;

    // Move to the calculated point
    axi.moveTo(xPoint, yPoint);
  }

  // Finish the path
  axi.penUp();
}

function drawArc(x, y, radius, startAngle, endAngle, pointCount = 16) {
  const angleInc = (endAngle - startAngle) / pointCount;

  const x1 = radius * cos(startAngle);
  const y1 = radius * sin(startAngle);
  axi.moveTo(x + x1, y + y1);
  axi.penDown();

  for (let i = 0; i <= pointCount; i += 1) {
    const angle = startAngle + i * angleInc;

    const relX = radius * cos(angle);
    const relY = radius * sin(angle);

    axi.moveTo(x + relX, y + relY);
  }

  axi.penUp();
}


function right() {
  beginShape();
  vertex(0, 0);
  // axi.moveTo(30, 30);
  //drawArc(0, 0, 10, 0, TWO_PI, pointCount = 16)
  bezierVertex(0, -cpd, 1 - cpd, -1, 1, -1);
  endShape();
  translate(1, -1);
  rotate(HALF_PI);
}

function left() {
  beginShape();
  vertex(0, 0);
  // axi.moveTo(10, 30);
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

  drawGridOfDots();

  scale(cellw);
  translate(width / (2 * cellw), height / (2 * cellw));
  rotate(HALF_PI / 2);
  noFill();
  stroke(0);
  strokeWeight(2 / cellw);

  let currentX = 0;
  let currentY = 0;

  // Loop through the entire path to draw it on the canvas
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

    // // Only send the command to the AxiDraw for the last character
    // if (i === path.length - 1) {
      
    //   // Here, add the AxiDraw drawing commands based on the last character
    //   switch (currentChar) {
    //     case 'r':
    //       drawArc(0, 0, 10, 0, TWO_PI, pointCount = 16);
    //       break;
    //     case 'l':
    //       //drawBezierArc(0, 0, 10, cpd, pointCount = 16);
    //       break;
    //     case 's':
    //       axi.moveTo(0, 0);
    //       axi.penDown();
    //       axi.moveTo(0, -20);
    //       axi.penUp();
    //       break;
    //     case 'R':
    //       // drawArc(0, 0, 10, 0, TWO_PI, pointCount = 16);
    //       // drawArc(0, 0, 10, 0, TWO_PI, pointCount = 16);
    //       // drawArc(0, 0, 10, 0, TWO_PI, pointCount = 16);
    //       break;
    //     case 'L':
    //       // drawBezierArc(0, 0, 10, cpd, pointCount = 16);
    //       // drawBezierArc(0, 0, 10, cpd, pointCount = 16);
    //       // drawBezierArc(0, 0, 10, cpd, pointCount = 16);
    //       break;
    //   }
    // }
  }

  if (frameCount > 100 && frameCount % 100 === 0) {
    
    let randomChar = random(['r', 's', 'l']);
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
      ellipse(x - (cpd + cellw) / 1.4, y- (cpd + cellw) / 1.4, 5, 5);
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