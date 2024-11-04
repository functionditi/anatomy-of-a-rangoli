let dots = [];
let spacing = 30;
let loopSize = spacing * 0.8;
let current;
let downIndex=0; 


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
  let rows = 11;
  let cols = 11;
  let centerX = width / 2;
  let centerY = height / 2;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x = centerX + (j - (cols - 1) / 2) * spacing;
      let y = centerY + (i - (rows - 1) / 2) * spacing;

      if (abs(i - (rows - 1) / 2) + abs(j - (cols - 1) / 2) <= (rows - 1) / 2) {
        ellipse(x, y, 5, 5);
        rect(x, y, spacing, spacing);
        dots.push({ x: x, y: y, i: i, j: j });
      }
    }
  }
}

function drawFirstArc() {
  push();
  translate(current.x, current.y);
  fill(255, 0, 0);
  //ellipse(0, 0, 5, 5);
  noFill();
  strokeWeight(3);
  let startAngle = QUARTER_PI + HALF_PI;
  let endAngle = QUARTER_PI + TWO_PI;
  arc(0, 0, loopSize, loopSize, startAngle, endAngle);
  pop();
}

function drawConnectingLine(theNextDot){
    strokeWeight(3);
  line(
    current.x + cos(QUARTER_PI + TWO_PI) * loopSize / 2,
    current.y + sin(QUARTER_PI + TWO_PI) * loopSize / 2,
    theNextDot.x + cos(QUARTER_PI + TWO_PI + PI) * loopSize / 2,
    theNextDot.y + sin(QUARTER_PI + TWO_PI + PI) * loopSize / 2
  );
  
}

function drawHalfArc(nextDot) {
  
  
  if (nextDot) {
    push();
    translate(nextDot.x, nextDot.y);
    fill(0, 255, 0);
    //ellipse(0, 0, 5, 5);
    noFill();
    strokeWeight(3);
    let startAngle = QUARTER_PI + HALF_PI ;
    let endAngle = QUARTER_PI + TWO_PI + PI;
    arc(0, 0, loopSize, loopSize, startAngle, endAngle);
    pop();
  }
  
  
}

function drawDownwards(){
  if (downIndex>0){
    let nextDot = dots.find(dot => dot.i === current.i + 1 && dot.j === current.j);
    drawConnectingLine(nextDot);
    if (downIndex>1){
      drawHalfArc(nextDot);
    }
    if (downIndex>2){
      drawHalfArc(nextDot);
    }
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
      //current = dots[k]; // Update current
      downIndex++;

     
      drawDownwards(); // Draw the new arc
      return;
    }
  }
}

function navigateLeft() {
  for (let k = 0; k < dots.length; k++) {
    if (dots[k].j == current.j - 1 && dots[k].i == current.i) {
      current = dots[k]; // Update current
      drawFirstArc(); // Draw the new arc
      return;
    }
  }
}

function navigateRight() {
  for (let k = 0; k < dots.length; k++) {
    if (dots[k].j == current.j + 1 && dots[k].i == current.i) {
      current = dots[k]; // Update current
      drawFirstArc(); // Draw the new arc
      return;
    }
  }
}

function navigateUp() {
  for (let k = 0; k < dots.length; k++) {
    if (dots[k].i == current.i - 1 && dots[k].j == current.j) {
      current = dots[k]; // Update current
      drawFirstArc(); // Draw the new arc
      return;
    }
  }
}
