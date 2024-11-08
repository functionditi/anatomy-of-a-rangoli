let pullis = [];
let framework = [];
let size = 14;
let rows, columns;
let spacing;
let lineMarkers = [];
let tempX, tempY;
let cpd;
let r_angle, d_angle;
let pointsC = []; // Array to store point C coordinates
let angleArray = []; // Array to store angles in degrees
let i = 0;
let myFont;

let colUpdate=30;
let port;
let randomInterval;;



let connected = false;
let drawingComplete = false;
let liftPen=false;
let paused=true;


let drawRev=false;


let currentIndex = 0; // Track the current index being drawn
let lastDrawTime = 0; // Track the last time an element was drawn
const DRAW_DELAY = 100; // 3 seconds delay





let palette=[];


//ornages and blues
palette.push("#3C4884");
palette.push("#272D4F");
palette.push("#FF7125");
palette.push("#DBBAA7");
palette.push("#202125");

const P5_CANVAS_SIZE_W = 1178; 
const P5_CANVAS_SIZE_H = 815;

window.onload = function() {
    // Retrieve the saved values from localStorage
    let initialValues = JSON.parse(localStorage.getItem('initialValues'));

    // Check if there are any values saved in localStorage
    if (initialValues) {
        pullis = initialValues.pullis;
        framework = initialValues.framework;
        size = initialValues.size;
        rows=initialValues.rows;
        columns=initialValues.columns;
        spacing = initialValues.spacing;
        lineMarkers = initialValues.lineMarkers;
        tempX = initialValues.tempX;
        tempY = initialValues.tempY;
        cpd = initialValues.cpd;
        r_angle = initialValues.r_angle;
        d_angle = initialValues.d_angle;
        pointsC = initialValues.pointsC;
        angleArray = initialValues.angleArray;

        // Continue with your setup or drawing logic here...
        console.log("Values retrieved from localStorage:", initialValues);

        // Example: Use these values to redraw the initial grid or continue with drawing operations
        // You can call your functions here to reinitialize the canvas or use the values as needed
    } else {
        console.error("No initial values found in localStorage.");
    }

    // Continuously check for updates in localStorage every 1 second
    setInterval(() => {
        let updatedValues = JSON.parse(localStorage.getItem('initialValues'));
        if (updatedValues) {
            // Update the variables with new values from localStorage
            pullis = updatedValues.pullis;
            framework = updatedValues.framework;
            size = updatedValues.size;
            rows=updatedValues.rows;
            columns=updatedValues.columns;
            spacing = updatedValues.spacing;
            lineMarkers = updatedValues.lineMarkers;
            tempX = updatedValues.tempX;
            tempY = updatedValues.tempY;
            cpd = updatedValues.cpd;
            r_angle = updatedValues.r_angle;
            d_angle = updatedValues.d_angle;
            pointsC = updatedValues.pointsC;
            angleArray = updatedValues.angleArray;
            // Update the canvas or any other elements as needed
            console.log("Updated values from localStorage:", updatedValues);
        }
    }, 1000); // Check for updates every 1 second
};


function setup() {
  
  createCanvas(P5_CANVAS_SIZE_W, P5_CANVAS_SIZE_H);

  //spacing = 120;
//   rows = Math.floor(P5_CANVAS_SIZE_W / spacing) - 1;
//   columns = Math.floor(P5_CANVAS_SIZE_H / spacing) - 1;

  pullisLayer = createGraphics(P5_CANVAS_SIZE_W, P5_CANVAS_SIZE_H);
  pullisLayer.clear();


  //resetPattern();
  cpd = 4 * (sqrt(2) - 1) / 3;


  
  //drawInitialGrid();
}

function draw() {

    background(255);
  fill(0);

  let currentTime = millis(); // Get the current time in milliseconds

  if (currentIndex < framework.length && currentTime - lastDrawTime > DRAW_DELAY) {
    // It's time to draw the next element
    drawElement(currentIndex);
    currentIndex++; // Move to the next element
    lastDrawTime = currentTime; // Update the last draw time
  } else if (currentIndex >= framework.length) {
    // Restart the drawing once finished
    currentIndex = 0;
    lastDrawTime = currentTime;
  }
  

  // Optionally, re-draw all the previous elements to keep them on the canvas
  for (let i = 0; i < currentIndex; i++) {
     drawElement(i, false);
    //else drawElement(i, true);
  }
//   for (let i = currentIndex-1; i >=0; i--) {
//     drawElement(i, true);
//   }
}


  
function drawElement(i, isReverse) {
    push();
    stroke(0);
    circle(pullis[i].x, pullis[i].y, 5)
    pop();
    let dot1 = pullis[framework[i].x];
    let dot2 = pullis[framework[i].y];
    stroke(220);
    strokeWeight(6);
    line(dot1.x, dot1.y, dot2.x, dot2.y);

    push();
    fill(255, 0, 0);
    noStroke();
    textSize(spacing/4);
    text(i, dot1.x+10, dot1.y+10)
    pop();
  
    let tempX = (dot1.x + dot2.x) / 2;
    let tempY = (dot1.y + dot2.y) / 2;
  
    noStroke();
    fill(255, 0, 0);
    circle(tempX, tempY, 10);
  
    lineMarkers.push({ x: tempX, y: tempY });
    
    // Draw yellow circle around first marker
    push();
    noStroke();
    fill(255, 255, 0);
    if (lineMarkers.length > 0) {
      circle(lineMarkers[0].x, lineMarkers[0].y, 10);
    }
    pop();
  
    // Calculate the angle of the current line
    let r_angle = atan2(dot2.y - dot1.y, dot2.x - dot1.x);
    
    // Convert angle to degrees and store in the array
    let angleDegrees = degrees(r_angle);
    angleArray.push(angleDegrees);
  
    let curA = degrees(r_angle);
    let prevA = angleArray[i - 1] || 0; // If i === 0, use default prevA value
    let aDiff = curA - prevA;
  
    if (i === 0) {
      drawLineByAngle(angleDegrees, tempX, tempY, spacing, true);
      stroke(0, 0, 255);
      loopAround(dot1, r_angle, PI / 4, PI * 7 / 4);
    } else {
        if (i % 2 === 1 && isReverse==false || i % 2 === 0 && isReverse==true) {
        if (aDiff === 90 || aDiff === -270) {
          drawLineByAngle(angleDegrees, tempX, tempY, spacing);
        } else {
          applyLoopAndStroke(aDiff, r_angle, dot1);
          drawLineByAngle(angleDegrees, tempX, tempY, spacing);
        }
      } else {
        if (aDiff === 90 || aDiff === -270) {
          applyLoopAndStroke(aDiff, r_angle, dot1);
          drawLineByAngle(angleDegrees, tempX, tempY, spacing, true);
        } else if (aDiff === -90 || aDiff === 270) {
          drawLineByAngle(angleDegrees, tempX, tempY, spacing, true);
        } else if (aDiff === 0) {
          applyLoopAndStroke(aDiff, r_angle + PI, dot1);
          drawLineByAngle(angleDegrees, tempX, tempY, spacing, true);
        }
      }
    }
    
    if (i === framework.length - 1) {
      // Loop around the last dot in the line
      push();
      stroke(0, 0, 255);
      loopAround(dot2, r_angle, PI + PI / 4, PI + PI * 7 / 4); // Full circle around the last dot
      pop();
    }
  
    // Draw loop around arc for each point in the framework
    push();
    stroke(100, 50);
    loopAround(dot1, r_angle, PI / 4, PI * 7 / 4);
    pop();
  }

  



  function applyLoopAndStroke(aDiff, r_angle, dot1) {
      if (aDiff === 0) {
          stroke(0, 0, 255);
          loopAround(dot1, r_angle, PI / 4, PI * 3 / 4);
      } else if (aDiff === -90 || aDiff === 270) {
          stroke(0, 0, 255);
          loopAround(dot1, r_angle, PI / 4, PI * 5 / 4);
      } else if (aDiff === 90 || aDiff === -270) {
          stroke(0, 0, 255);
          loopAround(dot1, r_angle + PI / 2, PI / 4, PI * 5 / 4);
      }
  }
  
  function drawLineByAngle(angleDegrees, tempX, tempY, spacing, reverse = false) {
      const angle = (angleDegrees === 90 || angleDegrees === -90)
          ? (reverse ? 3 * PI / 4 : PI / 4)
          : (reverse ? PI / 4 : 3 * PI / 4);
      drawDiagonalLine(tempX, tempY, spacing * 0.33, angle);
  }
  
  function drawDiagonalLine(midX, midY, lineLength, angle) {
    let x1 = midX - cos(angle) * lineLength;
    let y1 = midY - sin(angle) * lineLength;
    let x2 = midX + cos(angle) * lineLength;
    let y2 = midY + sin(angle) * lineLength;
    //stroke(0, 255, 0); // Bright green color
    stroke(0, 0, 255);
    strokeWeight(6);
    line(x1, y1, x2, y2);
  }
  
  
  function loopAround(dot, theAngle, start, stop) {
    // Draw an arc around the given dot, in the direction of the line segment
    push();
    translate(dot.x, dot.y);
    rotate(theAngle);
    noFill();
   
    strokeWeight(6);
      arc(0, 0, spacing * 0.66, spacing * 0.66, start, stop);
    
    pop();
  }
  
  
  
  
//   function isAdjacent(dot1, dot2) {
//     return (abs(dot1.x - dot2.x) === spacing && dot1.y === dot2.y) ||
//            (dot1.x === dot2.x && abs(dot1.y - dot2.y) === spacing);
//   }
  
//   function DFS(dot, visited, lines) {
//     visited.add(dot);
//     for (let i = 0; i < pullis.length; i++) {
//       let adjacentDot = pullis[i];
//       if (!visited.has(adjacentDot) && isAdjacent(dot, adjacentDot)) {
//         lines.push(createVector(pullis.indexOf(dot), pullis.indexOf(adjacentDot)));
//         DFS(adjacentDot, visited, lines);
//       }
//     }
//   }
  
  
//   function connectpullis() {
//     let startDot = pullis[0]; // line starting
//     let visitedDots = new Set();
//     let lines = [];
  
//     DFS(startDot, visitedDots, lines);
  
//     if (visitedDots.size !== pullis.length) {
//       console.log("Not all dots are connected.");
//     }
  
//     return lines;
//   }

//   function resetPattern() {
//     let temp = [];
//     pullis = temp;
//     let border = 80; // for example, a bigger border of 50px
//     let availableWidth = P5_CANVAS_SIZE_W - 2 * border;
//     let availableHeight = P5_CANVAS_SIZE_H - 2 * border;
  
//     // Calculate rows and columns based on the available space and spacing
//     let rows = Math.floor(availableWidth / spacing);
//     let columns = Math.floor(availableHeight / spacing);
  
//     let xOffset = border + (availableWidth - (rows * spacing)) / 2 + spacing / 2;
//     let yOffset = border + (availableHeight - (columns * spacing)) / 2 + spacing / 2;
  
//     for (let i = 0; i < rows; i++) {
//       for (let j = 0; j < columns; j++) {
//         pullis.push(new Dot(i * spacing + xOffset, j * spacing + yOffset));
//       }
//     }
//     shuffle(pullis, true);
//     framework = connectpullis();
//   }
  
  class Dot {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  }