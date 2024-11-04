/**
 * This example uses the AxiDraw to draw a smiley face wherever the mouse is clicked.
 * Click the canvas to connect to the AxiDraw.
 */

const MAX_X_MM = 80;
const MAX_Y_MM = 80;
const MIN_MM_PER_SEC=10;
const MAX_MM_PER_SEC=40;

const DOT_RADIUS = 0.2;

const axi = new axidraw.AxiDraw();
let connected = false;

function setup() {
  createCanvas(80, 80);
  ellipseMode(CENTER);
  textAlign(CENTER);
  axi.setSpeed(30)
}

function mmToPx(mmPos) {
  return createVector(
    constrain(map(mmPos.x, 0, MAX_X_MM, 0, width), 0, width),
    constrain(map(mmPos.y, 0, MAX_Y_MM, 0, height), 0, height),
  );
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
  //axi.penUp();
  
}

function drawTile(theX, theY, theTile, rotation){
  let current={
    x: theX,
    y: theY,
    tile: theTile
  };

  let pos=[];
  // pos.push({x:current.x-theTile/2, y:current.y-theTile/2});
  // pos.push({x:current.x, y:current.y-theTile});
  // pos.push({x:current.x+theTile/2, y:current.y-theTile/2});
  // pos.push({x:current.x, y:current.y});
  
  pos.push({x: current.x - theTile / 2, y: current.y});
  pos.push({x: current.x, y: current.y - theTile / 2});
  pos.push({x: current.x + theTile / 2, y: current.y});
  pos.push({x: current.x, y: current.y + theTile / 2});

  for (let i=rotation; i<pos.length; i++){
    axi.moveTo(pos[i].x, pos[i].y)
  }
  for (let i=0; i<rotation; i++){
    axi.moveTo(pos[i].x, pos[i].y)
  }

  // if (rotation==0){
  //   axi.moveTo(pos[0].x, pos[0].y);
  //   axi.moveTo(pos[1].x, pos[1].y);
  //   axi.moveTo(pos[2].x, pos[2].y);
  //   axi.moveTo(pos[3].x, pos[3].y);
  // }
 
  // if (rotation==3){
    
  //   axi.moveTo(pos[3].x, pos[3].y);
  //   axi.moveTo(pos[0].x, pos[0].y);
  //   axi.moveTo(pos[1].x, pos[1].y);
  //   axi.moveTo(pos[2].x, pos[2].y);
  // }
  
  // if (rotation==2){
  //   axi.moveTo(pos[2].x, pos[2].y);
  //   axi.moveTo(pos[3].x, pos[3].y);
  //   axi.moveTo(pos[0].x, pos[0].y);
  //   axi.moveTo(pos[1].x, pos[1].y);
  // }

  // if (rotation==1){
  //   axi.moveTo(pos[1].x, pos[1].y);
  //   axi.moveTo(pos[2].x, pos[2].y);
  //   axi.moveTo(pos[3].x, pos[3].y);
  //   axi.moveTo(pos[0].x, pos[0].y);
   
  // }
  
}

function drawGridDot() {
  if (axi.isBusy()) {
    
    return;
    
  }

  let n=11;
  let tilew=width/n;
  let tileh=height/n;

  push();
  //translate(width/2, height/2);
  
  
  for (let i=tilew/2; i<width+tilew/2; i+=tilew){
    for (let j=tileh/2; j<height+tileh/2; j+=tileh){
      ellipse(i, j, DOT_RADIUS);
      const { x, y } = dotPosition(i, j);
        // drawGridDot(x, y);
        console.log(x, y);
       drawArc(i, j, DOT_RADIUS, 0, TWO_PI);
      
     
    
    }
  }
 
  axi.moveTo(0, 0);
  //const { a, b } = dotPosition(2.5*tilew, 2*tileh);

  // let posMaster=[];
  // posMaster.push({x: n/2*tilew, y: (n-1)/2*tileh});
  // posMaster.push({x: (n-1)/2*tilew, y: n/2*tileh});
  // posMaster.push({x: n/2*tilew, y: (n+1)/2*tileh});
  // posMaster.push({x: (n+1)/2*tilew, y: n/2*tileh});

  // let displacement=[];
  // displacement.push({x: 0, y:-tileh/2});
  // displacement.push({x: -tilew/2, y:0});
  // displacement.push({x: 0, y:tileh/2});
  // displacement.push({x: tilew/2, y:0});

  // let indexR=[0, 3, 2, 1]; //adu this is redundant so fix

  // axi.moveTo(posMaster[0].x, posMaster[0].y);
  // axi.penDown();
  // for (let i=0; i<posMaster.length; i++){
  //   axi.moveTo(posMaster[i].x, posMaster[i].y)
  //   drawTile(posMaster[i].x + displacement[i].x, posMaster[i].y + displacement[i].y, tilew, indexR[i]);
  // }
  // axi.moveTo(posMaster[0].x, posMaster[0].y);
  // axi.penUp();

//  //axi.moveTo(2.5*tilew, 2*tileh);
//   drawTile(2.5*tilew, 1.5*tileh, tilew, 0);
//   //let kside=sqrt((tilew*tilew)+(tileh*tileh));
//    //axi.moveTo(2*tilew, 2.5*tileh, 1);
//     drawTile(1.5*tilew, 2.5*tileh, tilew, 3);
     
//   //axi.moveTo(2.5*tilew, 3*tileh, 1);
//   drawTile(2.5*tilew, 3.5*tileh, tilew, 2);
//   //axi.moveTo(3*tilew, 2.5*tileh, 1);
//   drawTile(3.5*tilew, 2.5*tileh, tilew, 1);
//   //axi.moveTo(2.5*tilew, 2*tileh);
//  axi.penUp();
  
  

  // Make it easier to recover from mistakes by turning off the motors
  
  axi.moveTo(0, 0);
  pop();
  axi.disable();
}

function dotPosition(theI, theJ) {
  return createVector(
    constrain(map(theI, 0, width, 0, 50), DOT_RADIUS, MAX_X_MM - DOT_RADIUS),
    constrain(map(theJ, 0, height, 0, 50), DOT_RADIUS, MAX_Y_MM - DOT_RADIUS),
  );
}

function mouseClicked() {
  if (!connected) {
    axi.connect().then(() => {
      connected = true;
    });

    return;
  }

  // const { x, y } = dotPosition();
   drawGridDot();
  
  
}

function draw() {
  if (!connected) {
    background(255, 0, 0);
    text('Click to Connect', width / 2, height / 2);
    return;
  }

  //background(0, 255, 0);

  // Smiley at mouse position, but constrained to avoid going out of bounds
  const mmPos = dotPosition();
  const pxPos = mmToPx(mmPos);
  const pxRadius = map(DOT_RADIUS, 0, MAX_X_MM, 0, width);

  noFill();
  stroke(0);
  //ellipse(pxPos.x, pxPos.y, pxRadius * 2, pxRadius * 2);


  // let n=5;
  // let tilew=width/n;
  // let tileh=height/n;

  // push();
  // translate(width/2, height/2);
  
  // for (let i=tilew/2-width/2; i<width/2; i+=tilew){
  //   for (let j=tileh/2-height/2; j<height/2; j+=tileh){
  //     ellipse(i, j, DOT_RADIUS);
  //   }
  // }
  // pop();
}