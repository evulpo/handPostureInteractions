// loads font to be able to use it in WEBGL
// reference
//  https://github.com/infusion/Quaternion.js

let myFont;
function preload() {
    myFont =
    loadFont('fonts/AkkuratStd.otf');
}

const videoElement = document.getElementsByClassName('input_video')[0];
let pitch,yaw,roll=0;
let compareD=0;
let xy = [250, 250];
let p_xy = [0,0];
let lmResults=false;
let res;
let dX=0;
let dY=0;
let dZ=0;
let lm =[];
let lm_old = [];
let quat; // quaternion to store the hand's orientation
let rotMatrix; // rotation matrix to store the rotation of the 3D box
let smooth_value = 0.5;
// Set up the canvas
function setup() {
    
  createCanvas(1250, 900, WEBGL);
  textFont(myFont);
  // intializes collections for smoothing values
  for(let i = 0; i< 21; i++){
    lm[i]={x:0,y:0,z:0};
    lm_old[i]={x:0,y:0,z:0};
  }
  // initialize the quaternion and rotation matrix
  quat = new Quaternion();
  rotMatrix = new p5.Matrix();
}

// Run the hand tracker on every frame
function draw() {
  smooth_value = map(mouseX, 0, width, 0, 0.999 )
    clear();
    push();
    translate(0,0,-100)
    //image(videoInput, -width/2, -height/2, width, height);
    pop();

    strokeWeight(5);
    stroke(255,0,0);
    
    line(0-width/4-200,0,compareD*500 -width/4-200,0);
    textSize(16);
    noStroke();
    fill(255,0,0);
    text('pinch Delta : ' + compareD,0-width/4-200,0 - 20);
    

    displayResults();
    if(lm.length>20){
      if(compareD<0.02){
        dX = (lm[8].x*width + lm[4].x*width)/2 - width/2;
        dY = (lm[8].y*height + lm[4].y*height)/2 -height/2;
        dZ = (map(lm[8].z, -0.001, -0.2, -400,100)  +map(lm[8].z, -0.001, -0.2, -400,100) )/2;

        fill(255)
        text(dZ + ', '+ lm[8].z,100-width/2,100)
        //map(lm[i].z, -0.3,0, 2,0.1);
      }
    }

    push();
    noFill();
    strokeWeight(1);
    stroke(255,0,100);
    translate(0+dX,0+dY,dZ);

    
    // rotateX(pitch);
    // rotateY(yaw);
    // rotateZ(roll);

    applyMatrix(rotMatrix);
    normalMaterial();
    box(170, 170,170);
    pop();
  
}

function updateHandOrientation(lm) {
    // lm is an array containing the landmarks of the hand

    // define the two vectors for the bone between the landmarks and the reference bone
    let boneVector = createVector(lm[9].x - lm[0].x, lm[9].y - lm[0].y, lm[9].z - lm[0].z);
    let referenceVector = createVector(1, 1,1);

    // calculate the cross product between the two vectors to obtain the rotation axis
    let rotationAxis = boneVector.cross(referenceVector);

    // calculate the angle between the two vectors to obtain the rotation angle
    let rotationAngle = boneVector.angleBetween(referenceVector);

    // create a quaternion from the rotation axis and angle
    quat = Quaternion.fromAxisAngle([rotationAxis.x, rotationAxis.y,rotationAxis.z], rotationAngle);

    // convert the quaternion to a rotation matrix
    rotMatrix = quat.toMatrix4();

}


function displayResults(){
  if(lmResults){
    // lm stands for landmarks
    for(let i = 0; i<lm.length; i ++){
        depth =  map(lm[i].z, -0.3,0, 2,0.1);
        strokeWeight(5 * depth);
        stroke(0,255,0);
        point(lm[i].x*width - width/2,lm[i].y*height -height/2, lm[i].z);
        // displays the id of the point from the landmarks
        textFont(myFont  );
        textSize(16 );
        noStroke();
        fill(0,0,255);
        // z = ( Math.round( lm[i].z *100)/100 );
        text(i ,lm[i].x*width - width/2 + 10,lm[i].y*height -height/2 -10  );

       
    } 
    // display bones when the array of landmarks is long enough
    if(lm.length>20){
      displayBones();
      calculatePitchYawRoll();
      updateHandOrientation(lm);
      // console.log(rotMatrix);
       /* 
        drawFinger(17, 20); // little finger
        drawFinger(13, 16); // ring finger
        drawFinger(9, 12); // middle finger
        drawFinger(5, 8); // pointing finger
        drawFinger(1, 4); // thumb
        */
        
    }
  }
}

function displayBones(){
    stroke(255,100,100);
    strokeWeight(1);
    noFill();
    /* start little finger */
    beginShape(LINES);
    vertex(lm[17].x*width - width/2,lm[17].y*height -height/2, lm[17].z  );
    vertex(lm[18].x*width - width/2,lm[18].y*height -height/2, lm[18].z  );
    vertex(lm[18].x*width - width/2,lm[18].y*height -height/2, lm[18].z  );
    vertex(lm[19].x*width - width/2,lm[19].y*height -height/2, lm[19].z  );
    vertex(lm[19].x*width - width/2,lm[19].y*height -height/2, lm[19].z  );
    vertex(lm[20].x*width - width/2,lm[20].y*height -height/2, lm[20].z  );
    endShape();
    /* finish little finger */

    /* start ring finger */
    beginShape(LINES);
    vertex(lm[13].x*width - width/2,lm[13].y*height -height/2, lm[13].z  );
    vertex(lm[14].x*width - width/2,lm[14].y*height -height/2, lm[14].z  );
    vertex(lm[14].x*width - width/2,lm[14].y*height -height/2, lm[14].z  );
    vertex(lm[15].x*width - width/2,lm[15].y*height -height/2, lm[15].z  );
    vertex(lm[15].x*width - width/2,lm[15].y*height -height/2, lm[15].z  );
    vertex(lm[16].x*width - width/2,lm[16].y*height -height/2, lm[16].z  );
    endShape();
    /* finish ring finger */

    /* start middle finger */
    beginShape(LINES);
    vertex(lm[9].x*width - width/2,lm[9].y*height -height/2, lm[9].z  );
    vertex(lm[10].x*width - width/2,lm[10].y*height -height/2, lm[10].z  );
    vertex(lm[10].x*width - width/2,lm[10].y*height -height/2, lm[10].z  );
    vertex(lm[11].x*width - width/2,lm[11].y*height -height/2, lm[11].z  );
    vertex(lm[11].x*width - width/2,lm[11].y*height -height/2, lm[11].z  );
    vertex(lm[12].x*width - width/2,lm[12].y*height -height/2, lm[12].z  );
    endShape();
    /* finish middle finger */

    /* start pointing finger */
    beginShape(LINES);
    vertex(lm[5].x*width - width/2,lm[5].y*height -height/2, lm[5].z  );
    vertex(lm[6].x*width - width/2,lm[6].y*height -height/2, lm[6].z  );
    vertex(lm[6].x*width - width/2,lm[6].y*height -height/2, lm[6].z  );
    vertex(lm[7].x*width - width/2,lm[7].y*height -height/2, lm[7].z  );
    vertex(lm[7].x*width - width/2,lm[7].y*height -height/2, lm[7].z  );
    vertex(lm[8].x*width - width/2,lm[8].y*height -height/2, lm[8].z  );
    endShape();
    /* finish pointing finger */

    /* start thumb  */
    beginShape(LINES);
    vertex(lm[2].x*width - width/2,lm[2].y*height -height/2, lm[2].z  );
    vertex(lm[3].x*width - width/2,lm[3].y*height -height/2, lm[3].z  );
    vertex(lm[3].x*width - width/2,lm[3].y*height -height/2, lm[3].z  );
    vertex(lm[4].x*width - width/2,lm[4].y*height -height/2, lm[4].z  );
    endShape();
    /* finish thumb */

    /* start palm  */
    beginShape(LINES);
    vertex(lm[0].x*width - width/2,lm[0].y*height -height/2, lm[0].z  );
    vertex(lm[1].x*width - width/2,lm[1].y*height -height/2, lm[1].z  );
    vertex(lm[1].x*width - width/2,lm[1].y*height -height/2, lm[1].z  );
    vertex(lm[2].x*width - width/2,lm[2].y*height -height/2, lm[2].z  );
    vertex(lm[2].x*width - width/2,lm[2].y*height -height/2, lm[2].z  );
    vertex(lm[5].x*width - width/2,lm[5].y*height -height/2, lm[5].z  );
    vertex(lm[5].x*width - width/2,lm[5].y*height -height/2, lm[5].z  );
    vertex(lm[9].x*width - width/2,lm[9].y*height -height/2, lm[9].z  );
    vertex(lm[9].x*width - width/2,lm[9].y*height -height/2, lm[9].z  );
    vertex(lm[13].x*width - width/2,lm[13].y*height -height/2, lm[13].z  );
    vertex(lm[13].x*width - width/2,lm[13].y*height -height/2, lm[13].z  );
    vertex(lm[17].x*width - width/2,lm[17].y*height -height/2, lm[17].z  );
    vertex(lm[17].x*width - width/2,lm[17].y*height -height/2, lm[17].z  );
    vertex(lm[0].x*width - width/2,lm[0].y*height -height/2, lm[0].z  );
    endShape();
    /* finish palm */
}

/* recursive function to draw independent fingers  based on the above hardcoded method */
/* provided by GPTchat */
function drawFinger(startIndex, endIndex) {
    stroke(255,100,100);
    strokeWeight(1);
    noFill();
    if (startIndex > endIndex) {
      return;
    }
    /*  corrects code by GPT to avoid attempting to access indexes beyond the array length */
    beginShape(LINES);
    if(startIndex<20){
    vertex(lm[startIndex].x*width - width/2, lm[startIndex].y*height - height/2, lm[startIndex].z);
    vertex(lm[startIndex + 1].x*width - width/2, lm[startIndex + 1].y*height - height/2, lm[startIndex + 1].z);
    
    }else{
        vertex(lm[startIndex].x*width - width/2, lm[startIndex].y*height - height/2, lm[startIndex].z); 
    }
    endShape();
    drawFinger(startIndex + 1, endIndex);
}
  
function calculatePitchYawRoll(){
  const x1 = lm[9].x;
  const x2 = lm[0].x;
  const y1 = lm[9].y;
  const y2 = lm[0].y;
  const z1 = lm[9].z;
  const z2 = lm[0].z;
   pitch = Math.atan2(y1 - y2, z1 - z2);
   yaw = Math.atan2(x1 - x2, z1 - z2);
   roll = Math.atan2(y1 - y2, x1 - x2);
  
  textFont(myFont);
  textSize(16 );
  noStroke();
  fill(0,0,255);

  text('pitch:' + radians_to_degrees(pitch) , 150-width/2,150-height/2);
  text('yaw:' + radians_to_degrees(yaw) , 150-width/2,175-height/2);
  text('roll' +radians_to_degrees(roll) , 150-width/2,200-height/2);
}

function onResults(results) {
    
    if (results.multiHandLandmarks) {
      lmResults=true;
      for (const landmarks of results.multiHandLandmarks) {
        for(let i = 0; i< landmarks.length ; i ++){
            // smoothing values
            let _x = landmarks[i].x*(1-smooth_value) + lm_old[i].x*smooth_value;
            let _y = landmarks[i].y*(1-smooth_value) + lm_old[i].y*smooth_value;
            let _z = landmarks[i].z*(1-smooth_value) + lm_old[i].z*smooth_value;
           
            lm[i] = {x: _x, y:_y, z:_z};
            compareD = distance(landmarks[8].x, landmarks[8].y,  landmarks[4].x, landmarks[4].y)
            if(compareD<=0.01){
              xy[0] = (landmarks[4].x + landmarks[8].x) / 2 *640;
              xy[1] = (landmarks[4].y + landmarks[8].y) / 2 *360;
            }
        }
      }
    }
    // smoothing values
    lm_old=lm;
}

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});
hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: 160,
  height: 90
});
camera.start();
  
function distance(x1,y1,x2,y2){
  let dx = x2-x1
  let dy = y2-y1
  // let dz = z2-z1
  let tD = (dx*dx) +( dy*dy)
  // + (dz*dz)
  return tD 
}

function radians_to_degrees(radians)
{
  var pi = Math.PI;
  return radians * (180/pi);
}