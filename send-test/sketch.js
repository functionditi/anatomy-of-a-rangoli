let bc;
let receivedData;

function setup() {
  createCanvas(400, 400);
  bc = new BroadcastChannel("your-channel");
  
}

function draw() {
  background(220);
  
  bc.postMessage({
    c: frameCount,
  });

  console.log(frameCount);
  
}