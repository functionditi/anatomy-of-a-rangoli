/********
Adapted by the generative kolam pattern ported to js by Shailendra Paliwal (https://shailendra.me/)
no rights reserved.
********/

var kolam;
var gui_kolam;
var bgcolor="#000000";
var idx;

const axi = new axidraw.AxiDraw();
let connected = false;

const MAX_X_MM = 50;
const MAX_Y_MM = 50;
const MAX_MM_PER_SEC =10;
const MIN_MM_PER_SEC = 4;




function setup(){
    createCanvas(windowWidth, windowHeight);
    // background(bgcolor);
    console.log(windowWidth, windowHeight);

    kolam= new Kolam();
    // gui_kolam = new dat.GUI();
    // gui_kolam.add(kolam, 'tsize', 30, 60).name('Size').onChange(function() {
    //     setupTiles();
    //   });
    //   gui_kolam.add(kolam, 'margin', 2, 200).name('Margin').onChange(function() {
    //     setupTiles();
    //   });  
    //   gui_kolam.add(kolam, 'tnumber').name('Tiles').min(3).max(20).step(1).onChange(function() {
    //     setupTiles();
    //   });
    //   gui_kolam.add(kolam, 'rotation').name('Rotation').min(0).max(2*Math.PI).step(QUARTER_PI/4).onChange(function() {
    //     setupTiles();
    //   });  
    //   gui_kolam.add(kolam, 'refreshRate').name('Refresh Rate').min(10).max(200).step(10);
    
      setupTiles();
  //configTiles();
}

function draw(){

  if (!connected) {
    background(255, 0, 0);
    text('Click to Connect', width / 2, height / 2);
    return;
  }
  else{
    background(255);
    if (idx <= 1) drawTile();
  
  push();
  translate(width / 2, height / 2);
  rotate(kolam.rotation);
 
  pop();

//   if (frameCount % kolam.refreshRate == 0) {
//     configTiles();
//   }

if (frameCount==250) {
    configTiles();
  }
  }
    
}


//kolam object!
//all the variable here can be changed live 
function Kolam() {
    this.tsize = 10;
    this.margin = 5;
    this.tnumber = 7;
    this.refreshRate = 100;
    this.rotation = QUARTER_PI;
  }


  function setupTiles() {
    // background(bgcolor);
    rectMode(CORNERS);
    
    pg = createGraphics(
      kolam.tsize * kolam.tnumber + 2 * kolam.margin,
      kolam.tsize * kolam.tnumber + 2 * kolam.margin, 
      );
  
    link = [];
    nlink = [];
    // populate the array with 1s
    for (var i = 0; i < (kolam.tnumber + 1); i++) {
      var pushThis = [];
      for (var j = 0; j < (kolam.tnumber + 1); j++) {
        pushThis.push(1);
      }
      link.push(pushThis);
      nlink.push(pushThis);
    }
  }

  function configTiles() {
    idx = 0;
    var i, j;
  
    // update links
    for (i = 0; i < link.length; i++) {
      for (j = 0; j < link[0].length; j++) {
        link[i][j] = nlink[i][j]
      }
    }
  
    // create new links
    var limit = random(0.4, 0.7);
  
    for (i = 0; i < nlink.length; i++) {
      for (j = 0; j < nlink.length / 2; j++) {
  
        // randomly link or unlink
        let l = 0;
        if (random(1) > limit) l = 1;
  
        nlink[i][j] = l;
        nlink[i][nlink.length - j - 1] = l;
        nlink[j][i] = l;
        nlink[nlink.length - j - 1][i] = l;
        nlink[nlink.length - 1 - i][j] = l;
        nlink[nlink.length - 1 - i][nlink.length - j - 1] = l;
        nlink[j][nlink.length - 1 - i] = l;
        nlink[nlink.length - 1 - j][nlink.length - 1 - i] = l;
      }
    }
  }


  function drawTile() {
    // pg.background(bgcolor);
    noFill();
    stroke(100);
    strokeWeight(1);
  
    for (var i = 0; i < kolam.tnumber; i++) {
      for (var j = 0; j < kolam.tnumber; j++) {
        if ((i + j) % 2 == 0) {
          var top_left = kolam.tsize / 2 * lerp(link[i][j], nlink[i][j], idx);
          var top_right = kolam.tsize / 2 * lerp(link[i + 1][j], nlink[i + 1][j], idx);
          var bottom_right = kolam.tsize / 2 * lerp(link[i + 1][j + 1], nlink[i + 1][j + 1], idx);
          var bottom_left = kolam.tsize / 2 * lerp(link[i][j + 1], nlink[i][j + 1], idx);
          push();
         translate(i * kolam.tsize + kolam.margin, j * kolam.tsize + kolam.margin);
         let currentX=i * kolam.tsize + kolam.margin;
         let currentY=j * kolam.tsize + kolam.margin;
         
      
          rect( 0, 0, kolam.tsize, kolam.tsize, top_left, top_right, bottom_right, bottom_left);
        
         

          point( kolam.tsize / 2 , kolam.tsize / 2 );
          
          pop();
          
        }
      }
    }
  
    
    idx += 0.02;
    idx = constrain(idx, 0, 1);
  }

  



  

  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    setupTiles();
  }

  function keyPressed() {
    switch (key) {
      case "s":
        save(`test.svg`);
        
        break;
    }
  }

  function mouseClicked() {
    if (!connected) {
      axi.connect().then(() => {
        connected = true;
      });
      axi.setSpeed(4);
      return;
    }

   
    configTiles();
   
  }
  

  

  