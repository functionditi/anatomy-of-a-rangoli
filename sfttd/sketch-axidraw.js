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


const axi = new axidraw.AxiDraw();
let connected = false;
let drawingComplete = false;
let liftPen=false;
let paused=true;

const AXI_SPEED=50;
let currentSpeed = AXI_SPEED; // Start with the default speed
let drawRev=false;

let penDownforSetup=false;

let drawingLayer;

let palette=[];


//ornages and blues
palette.push("#3C4884");
palette.push("#272D4F");
palette.push("#FF7125");
palette.push("#DBBAA7");
palette.push("#202125");
palette.push("#924F58");




let brushScale=1;
let brushThickness = 2;
let brushColor;
let selectedBrush = "marker2";
let selectedColor;

let startX=0, startY=0;

const MAX_X_MM = 225; // 15 cm in mm
const MAX_Y_MM = 155; // 15 cm in mm


const P5_CANVAS_SIZE_W = 1178; 
const P5_CANVAS_SIZE_H = 815;




function setup() {
  
  createCanvas(P5_CANVAS_SIZE_W, P5_CANVAS_SIZE_H, WEBGL);

  spacing =120;
  rows = Math.floor(P5_CANVAS_SIZE_W / spacing) - 1;
  columns = Math.floor(P5_CANVAS_SIZE_H / spacing) - 1;

  randomInterval= Math.floor(random(30, 1000));

  // WEBGL canvas requires adjusting the origin
  drawingLayer = createGraphics(P5_CANVAS_SIZE_W, P5_CANVAS_SIZE_H, P2D);
  drawingLayer.clear();

  pullisLayer = createGraphics(P5_CANVAS_SIZE_W, P5_CANVAS_SIZE_H, P2D);
  pullisLayer.clear();


  resetPattern();
  cpd = 4 * (sqrt(2) - 1) / 3;


  port = createSerial();


  brush.scaleBrushes(brushScale);
 //brush.bleed(2*frameCount, "in");

 brush.add("watercolor", {
  type: "custom",
    weight: 5,
    vibration: 0.06,
    opacity: 50,
    spacing: 0.1,
    blend: true,
    pressure: {
        type: "standard",
        min_max: [1.35,1],
        curve: [0.35,0.25] // Values for the bell curve
    },
    tip: (_m) => {
       // in this example, the tip is composed of two squares, rotated 45 degrees
       // Always execute drawing functions within the _m buffer!
       _m.rotate(45), _m.rect(-1.5,-1.5,3,3), _m.rect(1,1,1,1);
    },
    rotate: "natural",
})

brush.pick(selectedBrush);
 
  
brushColor=random(palette)
  //background("#F3F0EB");
  background("#fff");
  drawInitialGrid();
}

function drawInitialGrid() {
  
   brush.push();
  fill(0);
  stroke(255, 140, 0);
  strokeWeight(1);
  noFill();
  for (let i = 0; i < pullis.length; i++) {
    brush.push();
    brush.scaleBrushes(1);
    brush.strokeWeight(0.5);
    brush.pick("marker");
    brush.stroke(palette[2])
    brush.circle(pullis[i].x - width / 2, pullis[i].y - height / 2, 4); // Adjusting positions for WEBGL
    //brush.rect(pullis[i].x - width / 2, pullis[i].y - height / 2, spacing, spacing, CENTER);
    //brush.pop();
  }
   brush.pop();
 
}



async function drawKolamAsync() {
  for (let i = 0; i < framework.length; i++) {
      await drawKolamAsyncHelper(i, false);  // Wait for each segment to finish
  }
  drawingComplete = true;  // Ensure we only set this after the whole drawing is complete
  console.log("Kolam drawing complete.");
}



function drawKolamAsyncHelper(i, isReverse) {
  return new Promise((resolve) => {
    drawKolam(i, isReverse);
    setTimeout(() => {
      resolve(); // Introduce a small delay for drawing to complete
    }, 500); // Adjust delay as needed to match drawing time
  });
}


async function resetAndRedraw() {
  if (drawingComplete && !paused) {
      // Mark as not complete to prevent re-triggers while drawing
      drawingComplete = false;

      // Clear the canvas and set new spacing
      background(255);
     spacing = int(random(7, 20)) * 10;
     axi.moveTo(startX, startY);
     startX+=2;
     startY+=2;
     //spacing=120;
     
      if (isNaN(spacing) || spacing <= 0) {
          spacing = 50; // Fallback to default value if input is invalid
      }

      drawingLayer.clear();
      resetPattern();
      rows = Math.floor(P5_CANVAS_SIZE_W / spacing);
      columns = Math.floor(P5_CANVAS_SIZE_H / spacing);

      // Reset the pattern and draw the initial grid
      resetPattern();
      drawInitialGrid();
      
      // Start drawing again if connected
      if (connected) {
          await drawKolamAsync();
      }
  }
}


function draw() {
  //background(255); // Clear with white background
  
  // Draw the buffer layer
  // if (frameCount % randomInterval == 0) {
  //   randomInterval = Math.floor(random(30, 1000)); // Reset the interval randomly each time
  //   brush.stroke(random(palette)); // Choose a random brushstroke color
  // }

  brush.stroke(selectedColor); // Set brush color with calculated opacity
  randomSeed(3);

  // push();
  // translate(-width / 2, -height / 2); // Translate to top-left for easier 2D drawing
 
  // pop();

  let str = port.readUntil("\n");
  if (str.length > 0) {
    
    let data = parseSerialData(str);
    console.log(data[0], data[1], data[2], data[3], data[4], data[5], data[6]);
    updateDrawingParameters(data);
  }

  if (connected && !paused && !drawingComplete && !axi.isBusy()) {
    drawKolamAsync().then(() => {
        drawingComplete = true; // Mark as complete once finished
    });

  }

  if (connected && !paused && drawingComplete && !axi.isBusy()) {
    resetAndRedraw();
  }

  // drawingLayer.background(255);
  // //drawingLayer.push();
  // drawingLayer.noFill();
  
  // //drawingLayer.translate(-width/2, -height/2);
  // drawingLayer.strokeWeight(0.5);
  // drawingLayer.stroke(palette[2])
  // drawingLayer.line(mouseX, 0, mouseX, height);
  // drawingLayer.line(0, mouseY, width, mouseY);
  // //drawingLayer.pop();
  
  // image(drawingLayer, -width/2, -height/2);
  image(pullisLayer, -width/2, -height/2); // pullis layer
} 

function updateDrawingParameters(data) {
  let edgeStrength = data[0];
  let avgRed = int(map(data[1], 0, 255, 0, 255));
  let avgGreen = int(map(data[2], 0, 255, 0, 255));
  let avgBlue = int(map(data[3], 0, 255, 0, 255));
  let avgGrayscale = data[4];
  let stdDevGrayscale = data[5];
  let micval = data[6];
  let color_i = int(micval) % 6; // Using modulus to get a valid index for palette array (5 elements)


  let scalebrush = map(stdDevGrayscale, 40, 50, 1, 2); // Mapping stdDevGrayscale to opacity range (50% to 100%)


  // Edge Strength → Control brushstroke thickness
  brushThickness = map(edgeStrength, 4.1, 4.3, 1, 4*scalebrush);
  

  // Grayscale Average → Which brush is selected
  if (avgGrayscale <= 80) {
    selectedBrush = "spray";
    brushThickness = brushThickness / 6;
  } else if (avgGrayscale <= 110) {
    selectedBrush = "rotring";
  } else if (avgGrayscale <= 143) {
    selectedBrush = "marker";
    brushThickness = brushThickness / 2;
  } else if (avgGrayscale <= 146) {
    selectedBrush = "cpencil";
    brushThickness = brushThickness / 2;
  } else if (avgGrayscale <= 150) {
    selectedBrush = "watercolor";
  } else if (avgGrayscale > 150) {
    selectedBrush = "marker2";
    brushThickness = brushThickness / 3;
  }

  // Use micval to pick a color from the palette array
  selectedColor = palette[color_i];
  
  console.log("COLOR", selectedColor);
  console.log("GRAYSCALE:", avgGrayscale);
  console.log("BRUSH:", brushThickness)
  // Set brush opacity based on stdDevGrayscale
  
  if (micval > 400) {
    liftPen = true;
    currentSpeed = 70;
  } else {
    liftPen = false;
    currentSpeed = 40;
  }

  // Apply brush properties
  brush.strokeWeight(brushThickness);
  brush.stroke(selectedColor); // Set brush color with calculated opacity
  brush.pick(selectedBrush);
}


function parseSerialData(serialString) {
  serialString = serialString.trim();
  serialString = serialString.replace(/\[|\]/g, "");
  let dataArray = serialString.split(", ").map(parseFloat);
  return dataArray;
}

async function mouseClicked() {
  if (!connected) {
    await axi.connect();
    connected = true;
    axi.setSpeed(currentSpeed);
  }

  
}

function doubleClicked() {
  if (!port.opened()) {
    port.open(9600);
  } 
  // else {
  //   port.close();
  // }
}

function keyPressed() {
  if (key === '0') {
    currentSpeed = Math.min(70, currentSpeed + 2); // Increase speed by 2, max speed is 70
  } else if (key === '9') {
    currentSpeed = Math.max(10, currentSpeed - 2); // Decrease speed by 2, minimum speed is 10
  } else if (key === 'q') {
    brush.pick("watercolor"); // Change to cpencil brush
    console.log("Brush changed to cpencil");
  } else if (key === 'w') {
    brush.pick("marker"); // Change to marker brush
    console.log("Brush changed to marker");
  } else if (key === 'e') {
    brush.pick("marker2"); // Change to charcoal brush
    console.log("Brush changed to charcoal");
  }else if (key === 'r') {
    brush.pick("cpencil"); // Change to charcoal brush
    console.log("Brush changed to charcoal");
  }
  else if (key === 't') {
    
    brush.pick("pen"); // Change to charcoal brush
    console.log("Brush changed to charcoal");
  }
  else if (key === 'y') {
    brush.pick("spray"); // Change to charcoal brush
    console.log("Brush changed to charcoal");
  }
  else if (key === 'u') {
    brush.pick("rotring"); // Change to charcoal brush
    console.log("Brush changed to charcoal");
  }
  else if (key === 'i') {
    brush.pick("2B"); // Change to charcoal brush
    console.log("Brush changed to charcoal");
  }

  

  else if (key=== 'p'){
    if (connected){
      console.log("Pausing AxiDraw...", paused);
      paused = true; // Set pause flag to true
      drawingComplete = true; // Allow drawing to start again
    }
  }

  else if (key=== 'l'){
    if (connected){
      console.log("Unpausing AxiDraw...", paused);
      drawingComplete = false; // Allow drawing to start again
      paused = false; // Set pause flag to true
      //resetAndRedraw();
    }
  }
  else if (keyCode==40){
    if (connected){
      console.log("pen down")
      penDownforSetup=true;
     axi.penDown();
    }
  }
  else if (keyCode==38){
    if (connected){
      console.log("pen up")
     axi.penUp();
    }
  }
  

  if ('123456789'.includes(key)) {
    brush.strokeWeight(key);
  }

  else if (key === 'a') {
    liftPen = false; // Don't lift the pen
    console.log("Pen down mode (continuous drawing)");
  } else if (key === 's') {
    liftPen = true; // Lift the pen after drawing
    console.log("Pen lift mode enabled");
  }
  else if (key === 'm') {
    drawRev = true; // Lift the pen after drawing
    console.log("Reverse enabled");
  }

  if (connected) {
    axi.setSpeed(currentSpeed); // Update the AxiDraw speed dynamically
    console.log("Updated speed:", currentSpeed);
  }


}



function touchMoved() {
  // Allow drawing directly on the main WEBGL canvas
  
  //if (frameCount%colUpdate==0) brush.stroke(random(palette));
  strokeWeight(2);
  brush.line(pmouseX - width / 2, pmouseY - height / 2, mouseX - width / 2, mouseY - height / 2); // Adjust coordinates for WEBGL
  return false; // Prevent default scrolling behavior
}


function drawKolam(i, isReverse) {
  let dot1 = pullis[framework[i].x];
  let dot2 = pullis[framework[i].y];
  stroke(225);
  push();
  translate(- width / 2, -height /2)
  strokeWeight(2);
  stroke(255, 0, 0);
  line(dot1.x, dot1.y, dot2.x, dot2.y);
  pop();

  let tempX = (dot1.x + dot2.x) / 2;
  let tempY = (dot1.y + dot2.y) / 2;

  noStroke();
  // fill(255, 0, 0);
  // circle(tempX, tempY, 5);

  lineMarkers.push({ x: tempX, y: tempY });

  push();
  noStroke();
  fill(255, 255, 0);
  if (lineMarkers.length > 0) {
    push();
  translate(- width / 2, -height /2)
  //circle(lineMarkers[0].x, lineMarkers[0].y, 10);
  pop();
    
  }
  pop();

  let r_angle = atan2(dot2.y - dot1.y, dot2.x - dot1.x);
  let angleDegrees = degrees(r_angle);
  angleArray.push(angleDegrees);
  
   let curA = degrees(r_angle);
    let prevA = angleArray[i - 1] || 0; // If i === 0, use default prevA value
    let aDiff = curA - prevA;

  if (connected && !paused) {
  if (i === 0) {
    //drawLineByAngle(angleDegrees, tempX, tempY, spacing, true);
    stroke(0, 0, 255);
    //loopAround(dot1, r_angle, PI / 4, PI * 7 / 4);
  
      
      loopAroundAxidraw(dot1.x, dot1.y, r_angle, PI / 4, PI * 7 / 4);
      drawLineByAngleAxidraw(angleDegrees, tempX, tempY, spacing, true); 
    
  } 
  else {
       // text(i, tempX, tempY);
         if (i % 2 === 1 && isReverse==false || i % 2 === 0 && isReverse==true) 
        {
            if (aDiff === 90 || aDiff === -270) {
              //drawLineByAngle(angleDegrees, tempX, tempY, spacing);
               drawLineByAngleAxidraw(angleDegrees, tempX, tempY, spacing);
              
            } else {
               //applyLoopAndStroke(aDiff, r_angle, dot1);
               applyLoopAndStrokeAxidraw(aDiff, r_angle, dot1);
               //drawLineByAngle(angleDegrees, tempX, tempY, spacing);
               drawLineByAngleAxidraw(angleDegrees, tempX, tempY, spacing);
            }
        } 
    else {
            if (aDiff === 90 || aDiff === -270) {
               //applyLoopAndStroke(aDiff, r_angle, dot1);
              applyLoopAndStrokeAxidraw(aDiff, r_angle, dot1);
               //drawLineByAngle(angleDegrees, tempX, tempY, spacing, true);
                drawLineByAngleAxidraw(angleDegrees, tempX, tempY, spacing, true);
            } else if (aDiff === -90 || aDiff === 270) {
              //drawLineByAngle(angleDegrees, tempX, tempY, spacing, true);
              drawLineByAngleAxidraw(angleDegrees, tempX, tempY, spacing, true);
            } else if (aDiff === 0) {
              //applyLoopAndStroke(aDiff, r_angle + PI, dot1);
              applyLoopAndStrokeAxidraw(aDiff, r_angle + PI, dot1);
              //drawLineByAngle(angleDegrees, tempX, tempY, spacing, true);
              drawLineByAngleAxidraw(angleDegrees, tempX, tempY, spacing, true);
            }
        }
    }
    
  
    
     if (i === framework.length - 1) {
      // Loop around the last dot in the line
      push();
      stroke(0, 0, 255);
      //loopAround(dot2, r_angle, PI+ PI / 4, PI+ PI * 7 / 4); // Full circle around the last dot
      pop();
       
        axi.penUp();
  //axi.moveTo(0, 0);
    }
    
    }

    else if (connected && paused){
     
        if (penDownforSetup==false)axi.penUp();
        axi.moveTo(startX, startY);
        return;
    }
  
 
}

function mapToAxiDraw(x, y) {
  // Map p5 coordinates to AxiDraw coordinates (15x15 cm area)
  let mappedX = map(x, 0, P5_CANVAS_SIZE_W, 0, MAX_X_MM);
  let mappedY = map(y, 0, P5_CANVAS_SIZE_H, 0, MAX_Y_MM);
  return createVector(mappedX, mappedY);
}




class Dot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function resetPattern() {
  let temp = [];
  pullis = temp;
  let border = 80; // for example, a bigger border of 50px
  let availableWidth = P5_CANVAS_SIZE_W - 2 * border;
  let availableHeight = P5_CANVAS_SIZE_H - 2 * border;

  // Calculate rows and columns based on the available space and spacing
  let rows = Math.floor(availableWidth / spacing);
  let columns = Math.floor(availableHeight / spacing);

  let xOffset = border + (availableWidth - (rows * spacing)) / 2 + spacing / 2;
  let yOffset = border + (availableHeight - (columns * spacing)) / 2 + spacing / 2;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      pullis.push(new Dot(i * spacing + xOffset, j * spacing + yOffset));
    }
  }
  shuffle(pullis, true);
  framework = connectpullis();
  saveInitialValues();
}





function connectpullis() {
  let startDot = pullis[0];
  let visitedDots = new Set();
  let lines = [];

  DFS(startDot, visitedDots, lines);

  if (visitedDots.size !== pullis.length) {
    console.log("Not all dots are connected.");
  }

  return lines;
}

function DFS(dot, visited, lines) {
  visited.add(dot);
  for (let i = 0; i < pullis.length; i++) {
    let adjacentDot = pullis[i];
    if (!visited.has(adjacentDot) && isAdjacent(dot, adjacentDot)) {
      lines.push(createVector(pullis.indexOf(dot), pullis.indexOf(adjacentDot)));
      DFS(adjacentDot, visited, lines);
    }
  }
}

// function DFS(dot, visited, lines) {
//   visited.add(dot);

//   let adjacentDots = [];

//   // Collect all adjacent dots
//   for (let i = 0; i < pullis.length; i++) {
//     let adjacentDot = pullis[i];
//     if (!visited.has(adjacentDot) && isAdjacent(dot, adjacentDot)) {
//       adjacentDots.push(adjacentDot);
//     }
//   }

//   // Shuffle the adjacent dots to get a randomized continuous path
//   shuffle(adjacentDots, true);

//   // If there are any adjacent dots, continue with the first one
//   if (adjacentDots.length > 0) {
//     let nextDot = adjacentDots[0];
//     lines.push(createVector(pullis.indexOf(dot), pullis.indexOf(nextDot)));
//     DFS(nextDot, visited, lines);
//   }
// }

function isAdjacent(dot1, dot2) {
  return (
    (abs(dot1.x - dot2.x) === spacing && dot1.y === dot2.y) ||
    (dot1.x === dot2.x && abs(dot1.y - dot2.y) === spacing)
  );
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

function applyLoopAndStrokeAxidraw(aDiff, r_angle, dot1) {
    if (aDiff === 0) {
        stroke(0, 0, 255);
        loopAroundAxidraw(dot1.x, dot1.y, r_angle, PI / 4, PI * 3 / 4);
    } else if (aDiff === -90 || aDiff === 270) {
        stroke(0, 0, 255);
        loopAroundAxidraw(dot1.x, dot1.y, r_angle, PI / 4, PI * 5 / 4);
    } else if (aDiff === 90 || aDiff === -270) {
        stroke(0, 0, 255);
        loopAroundAxidraw(dot1.x, dot1.y, r_angle + PI / 2, PI / 4, PI * 5 / 4);
    }
}

function drawLineByAngle(angleDegrees, tempX, tempY, spacing, reverse = false) {
    const angle = (angleDegrees === 90 || angleDegrees === -90)
        ? (reverse ? 3 * PI / 4 : PI / 4)
        : (reverse ? PI / 4 : 3 * PI / 4);
    drawDiagonalLine(tempX, tempY, spacing * 0.33, angle);
}


function drawLineByAngleAxidraw(angleDegrees, tempX, tempY, spacing, reverse = false) {
  
  let mappedMid = mapToAxiDraw(tempX, tempY);
    const angle = (angleDegrees === 90 || angleDegrees === -90)
        ? (reverse ? 3 * PI / 4 : PI / 4)
        : (reverse ? PI / 4 : 3 * PI / 4);
  let mlinelength=map(spacing * 0.33, 0, P5_CANVAS_SIZE_W, 0, MAX_X_MM);
    drawDiagonalLineAxidraw(mappedMid.x, mappedMid.y, mlinelength, angle);
}

function drawDiagonalLine(midX, midY, lineLength, angle) {
  let x1 = midX - cos(angle) * lineLength;
  let y1 = midY - sin(angle) * lineLength;
  let x2 = midX + cos(angle) * lineLength;
  let y2 = midY + sin(angle) * lineLength;
  //stroke(0, 255, 0); // Bright green color
  stroke(0, 0, 255);
  line(x1, y1, x2, y2);
}

function drawDiagonalLineAxidraw(midX, midY, lineLength, angle) {
  let x1 = midX - cos(angle) * lineLength;
  let y1 = midY - sin(angle) * lineLength;
  let x2 = midX + cos(angle) * lineLength;
  let y2 = midY + sin(angle) * lineLength;
 
  //line(x1, y1, x2, y2);
   axi.moveTo(x1+startX, y1+startY);
  axi.penDown();
   axi.moveTo(x2+startX, y2+startY);
  if (liftPen) axi.penUp();
}

function loopAround(dot, theAngle, start, stop) {
  // Draw an arc around the given dot, in the direction of the line segment
  push();
  translate(dot.x, dot.y);
  rotate(theAngle);
  noFill();
 
  
    arc(0, 0, spacing * 0.66, spacing * 0.66, start, stop);
  
  pop();
}

function loopAroundAxidraw(theX, theY, theAngle, start, stop) {
  
  let mappedPos = mapToAxiDraw(theX, theY);
  if (liftPen) axi.penUp();
      axi.moveTo(mappedPos.x + startX, mappedPos.y + startY);
 
  let aRad=map(spacing * 0.33, 0, P5_CANVAS_SIZE_W, 0, MAX_X_MM);
  
    drawArc(mappedPos.x, mappedPos.y, aRad, theAngle+start, theAngle+stop);
  
  // pop();
}

function drawArc(x, y, radius, startAngle, endAngle, pointCount = 16) {
  
  // drawArc(theX, theY, spacing * 0.66, theAngle+start, theAngle+stop);
  const angleInc = (endAngle - startAngle) / pointCount;

  const x1 = radius * cos(startAngle);
  const y1 = radius * sin(startAngle);
  axi.moveTo(x + x1 +startX, y + y1 +startY);
  axi.penDown();

  for (let i = 0; i <= pointCount; i += 1) {
    const angle = startAngle + i * angleInc;
    const relX = radius * cos(angle);
    const relY = radius * sin(angle);
    axi.moveTo(x + relX +startX, y + relY +startY);
  }

  if (liftPen) axi.penUp();
}

function saveInitialValues() {
  localStorage.setItem(
    "initialValues",
    JSON.stringify({
      pullis,
      framework,
      size,
      rows,
      columns,
      spacing,
      lineMarkers,
      tempX,
      tempY,
      cpd,
      r_angle,
      d_angle,
      pointsC,
      angleArray,
    })
  );
}

