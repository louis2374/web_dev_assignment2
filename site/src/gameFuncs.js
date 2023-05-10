const canvas = document.getElementById('canvasFrame'); //canvas
const context = canvas.getContext('2d'); //canvas context
const simSize = 1000; //simulated size of the game, the games physics, positiona and size are based off this, and scaled to match the canvas size
const viewport = document.documentElement; //viewport to make code a lil neater
const circleRadius = simSize * 0.3; //radius of circle
const lineWidth = 4; //width of the circle
const updateSpeed = 10; //ticks per second, higher value will cause more jittery gameplay, however ball speed should be preserved.

var userX = canvas.height / 2;
var userY = canvas.width / 2;
var mouseX = 0; //mouse pos
var mouseY = 0; //mouse pso
var circleCover = 0.03; //percentage of the circle the cursor covers
var circleSection = {min: 0, max: 0}; //cursor
var balls = []; //all balls
var spawnRate = 0; //how often a ball is spawned in ms
var ballSpawning = true; //determins whether balls should spawn

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
    spawnBalls();
}

//loop that carries out all drawing / login processes
function mainLoop()
{
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawCursor();
    drawBalls();
    ballsLogic();
}

function spawnBalls()
{
    //if no balls should spawn, dont modify spawn rate and just return this function
    if(!ballSpawning)
    {
        setTimeout(spawnBalls, spawnRate);
        return;
    }

    //choose random angle
    let angle = (Math.PI * 2) * Math.random();
    let speed = 100;

    console.log(angle)
    //starting vector is moving at ball speed directly upwards.
    let velocity = {x: 0, y: speed};

    //rotate this vector by angle
    velocity.x = velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle);
    velocity.y = velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle);

    balls.push(
    {
        radius: 10,
        pos: {x: simSize / 2, y: simSize / 2},
        velocity: {x: velocity.x, y: velocity.y},
        color: "#2a2",
        bounced: false
    });

    //reduces spawn rate to make game harder over timer
    //should change this as its almost unnoticable, simple and boring
    spawnRate--;
    setTimeout(spawnBalls, spawnRate);
}

function ballsLogic() {
    balls.forEach((ball, index) => {
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
  
      //hits player cursor
      //if angle is within circle section, and side of it is touching side of main circle
      if (dist >= circleRadius - ball.radius - lineWidth / 2 && ballAngle < circleSection.max && ballAngle > circleSection.min) {

        //if blocked by cursor, delete the ball
        balls.splice(index , 1);

        //bounce is disabled atm, its a little buggy
        var bounce = false;

        //only bounce if it is within the circle
        if (dist - 4 < circleRadius - ball.radius - lineWidth/2 && bounce) {
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