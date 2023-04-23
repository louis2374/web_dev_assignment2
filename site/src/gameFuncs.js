const canvas = document.getElementById('canvasFrame');
const context = canvas.getContext('2d');
const simSize = 1000;
const viewport = document.documentElement;
const circleRadius = simSize * 0.3;
const lineWidth = 4;
const updateSpeed = 10; //ms

var userX = canvas.height / 2;
var userY = canvas.width / 2;
var mouseX = 0;
var mouseY = 0;
var circleCover = 0.03;
var circleSection = {min: 0, max: 0};
var balls = [
    {
        radius: 10,
        pos: {x: simSize / 3, y: simSize / 3},
        velocity: {x: 40, y: 40},
        color: "#2f2",
        bounced: false
    },
    {
        radius: 10,
        pos: {x: simSize / 5 * 3, y: simSize / 3},
        velocity: {x: 40, y: 40},
        color: "#2a2",
        bounced: false
    }
];

var points = [
]

/*bounce point = 
{
    radius: 1,
    x: 20,
    y: 30
}
*/


function init()
{
    resizeCanvas();
    initEvents();
    setInterval(mainLoop, updateSpeed);
}

//loop that carries out all drawing / login processes
function mainLoop()
{
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawCursor();
    drawBalls();
    ballsLogic();
}

function ballsLogic() {
    balls.forEach(ball => {
      //move ball
      //velocity should be in pixels per second at 100% simsize
      //im not measuring delta time so this is only roughly accurate
      ball.pos.x += ball.velocity.x * updateSpeed / 1000;
      ball.pos.y += ball.velocity.y * updateSpeed / 1000;
  
      //if it has bounced recently, dont bounce
      if(ball.bounced) return;

      //distance to circle center
      let dist = Math.sqrt(Math.pow(ball.pos.x - simSize/2, 2) + Math.pow(ball.pos.y - simSize/2, 2));
  
      //get angle of ball to circle center
      let ballAngle = Math.atan2(ball.pos.y - simSize/2, ball.pos.x - simSize/2);
  
      //if ball missed the cursor
      if (dist > circleRadius + 2) {
        // do something
      }
  
      //if angle is within circle section, and side of it is touching side of main circle
      if (dist >= circleRadius - ball.radius - lineWidth / 2 && ballAngle < circleSection.max && ballAngle > circleSection.min) {
        //only bounce if it is within the circle
        if (dist - 4 < circleRadius - ball.radius - lineWidth/2) {
            //bounce
    
            let perpendicularAngle = ballAngle - Math.PI;
    
            let normalX = Math.cos(perpendicularAngle);
            let normalY = Math.sin(perpendicularAngle);
    
            //dot product
            //normalise ball vector
            let magnitude = Math.sqrt(Math.pow(ball.velocity.x, 2) + Math.pow(ball.velocity.y,2));
    
            let normalBallX = ball.velocity.x / magnitude;
            let normalBallY = ball.velocity.y / magnitude;
    
            let dot = normalBallX * normalX + normalBallY * normalY;
    
            //angle of incidence
            let incidence = Math.acos(dot);
    
            let reflection = 2 * incidence - Math.PI + ballAngle;
    
            let newVelX = Math.cos(reflection) * magnitude;
            let newVelY = Math.sin(reflection) * magnitude;
    
            ball.velocity.x = newVelX;
            ball.velocity.y = newVelY;

            //set timeout so it wont bounce for a period of time, stops many errors as this code will get
            //called multiple times without it
            ball.bounced = true;
            setTimeout(() => {
                ball.bounced = false;
              }, 100);
        }
    }
    
    });
  }
  

//the game is simulated with a 1000 x 1000 canvas, and all properties of the object are scaled
//when drawn, so that the game is drawn at full resolution with correct scaling regardless of canvas actual size
function scaleSize(num)
{
    return num * (canvas.height / simSize);
}

function resizeCanvas()
{
    canvas.width = viewport.clientHeight - 4;
    canvas.height = viewport.clientHeight - 4;
}

function drawCircle(width, color, posX, posY, radius, radiansMax, radiansMin, solid)
{
    context.beginPath();
    context.lineWidth = scaleSize(width);
    context.strokeStyle = color;
    context.arc(scaleSize(posX), scaleSize(posY), scaleSize(radius), radiansMax, radiansMin);
    solid ? context.fill() : context.stroke();
}

function drawCursor()
{
    //height = width
    let h = canvas.height / 2;
    
    //get angle
    let angle = Math.atan2(mouseY - h, mouseX - h);

    //set circle section
    circleSection = {min: angle - circleCover/2 * Math.PI * 2, max: angle + circleCover/2 * Math.PI * 2};

    //draw the arc
    //all sizes are scaled
    //non cursor area
    drawCircle(lineWidth, "#ddd", simSize/2, simSize/2, circleRadius, circleSection.max, circleSection.min, false)
    //cursor area
    drawCircle(lineWidth, "#111", simSize/2, simSize/2, circleRadius, circleSection.min, circleSection.max, false);
}

function drawBalls()
{
    //draw balls
    balls.forEach(ball =>
    {
        drawCircle(lineWidth, ball.color, ball.pos.x, ball.pos.y, ball.radius, 0, Math.PI * 2, true);
    })

    points.forEach(point => {
        drawCircle(2, "#aaa", point.x, point.y, 4, 0, Math.PI * 2, false);
    })
}

function keyboardInput(e)
{
    //if(e.key == "a") ballPosition = {x:simSize/2,y:simSize/2}
    //console.log(e)
}

function initEvents()
{
    //init keyboard input
    document.addEventListener('keydown', keyboardInput);
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", function(e) {mouseX = e.clientX; mouseY = e.clientY;})
}