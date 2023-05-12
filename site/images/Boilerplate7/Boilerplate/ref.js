/// we need to get the element
const canvas = document.getElementById("canvas");
// then the Canvas Context - this lets us draw
const ctx = canvas.getContext("2d");


ctx.fillStyle = "green";
ctx.fillRect(10, 10, 150, 100);

ctx.strokeStyle = "#0000FF";
ctx.moveTo(0, 0);
ctx.lineTo(100, 100);
ctx.stroke();

ctx.imageSmoothingEnabled = true;
ctx.drawImage(img,0,0,img.width,img.height);

ctx.beginPath();
ctx.arc(95, 50, 
    40, // Radius 
    0, // Starting angle
    2 * Math.PI // end angle (360degrees)
    );
ctx.stroke();

// Define the rectangle's initial position and size
let rectX = 50;
let rectY = 50;
let rectWidth = 10;
let rectHeight = 50;

// Define the rotation angle and center of the rectangle
let angleInDegrees = 0;
let speed = 1;
let centerX = rectX + rectWidth / 2;
let centerY = rectY + rectHeight / 2;

// Define a function to draw the rotated rectangle
function drawRotatedRect() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Save the current context state
  ctx.save();
  
  // Translate the context to the center of the rectangle
  ctx.translate(centerX, centerY);
  
  // Rotate the context by the angle
  ctx.rotate(angleInDegrees * Math.PI / 180);

  //set the color
  ctx.fillStyle = "black";
  
  // Draw the rectangle centered at the origin (0, 0)
  ctx.fillRect(-rectWidth / 2, -rectHeight / 2, rectWidth, rectHeight);
  
  // Restore the previous context state
  ctx.restore();
  
  // Increase the angle by speed factor
  angleInDegrees += speed;

}
function init(){
    window.requestAnimationFrame(draw);
}

function draw(){
    drawRotatedRect()
    window.requestAnimationFrame(draw);
}