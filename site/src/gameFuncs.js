const canvas = document.getElementById('canvasFrame');
const context = canvas.getContext('2d');
const simSize = 1000;
const viewport = document.documentElement;
const circleRadius = simSize * 0.3;
const lineWidth = 4;

let userX = canvas.height / 2;
let userY = canvas.width / 2;
let mouseX = 0;
let mouseY = 0;
let circleCover = 0.03;
let circleSection = {min: 0, max: 0};
let ballVelocity = {x: 200,y: 200};
let ballPosition = {x: simSize/2,y: simSize/2};
let ballRadius = 5;
var bouncePoints = [
    {
        radius: 10,
        x: 20,
        y: 30
    },
    {
        radius: 5,
        x: 70,
        y: 40
    }
];

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
    initObjects();
    setInterval(draw, 10);
}

function draw()
{
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawCursor();
    drawBall();

}

function scaleSize(num)
{
    return num * (canvas.height / simSize);
}

function initObjects()
{
    //for (let i = 0; i < 5; i++)
    //{
    //    obstacles = [];
//
    //    obstacles.push({
    //        x: Math.random() * canvas.height,
    //        y: Math.random() * canvas.width,
     //       width: 50,
     //       height: 50,
    //    });
   // }
}

function resizeCanvas()
{
    canvas.width = viewport.clientHeight - 4;
    canvas.height = viewport.clientHeight - 4;
}

function drawBoucePoints()
{
    for(let i = 0; i < bouncePoints.length; i++)
    {
        //context.beginPath();

    }
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
    
    //get angle                                     //flip it so its opposite of mouse position
    let angle = Math.atan2(mouseY - h, mouseX - h);

    //set circle section
    circleSection = {min: angle - circleCover/2 * Math.PI * 2, max: angle + circleCover/2 * Math.PI * 2};

    //draw the arc
    //all sizes are scaled

    //non cursor area
    //not drawing it for now
    drawCircle(lineWidth, "#ddd", simSize/2, simSize/2, circleRadius, circleSection.max, circleSection.min, false)
    //cursor area
    drawCircle(lineWidth, "#111", simSize/2, simSize/2, circleRadius, circleSection.min, circleSection.max, false);
}

function drawBall()
{
    //draw ball
    drawCircle(lineWidth, "#111", ballPosition.x, ballPosition.y, ballRadius, 0, Math.PI * 2, true)


    //move ball
    //velocity should be in pixels per second at 100% simsize
    //each draw is called every 10ms so 0.01 seconds
    ballPosition.x += ballVelocity.x * 0.01;
    ballPosition.y += ballVelocity.y * 0.01;
    //ballPosition.y += 0.3;

    //distance to circle center
    let dist = Math.sqrt(Math.pow(ballPosition.x - simSize/2, 2) + Math.pow(ballPosition.y - simSize/2, 2));

    //get angle of ball to circle center
    let ballAngle = Math.atan2(ballPosition.y - simSize/2, ballPosition.x - simSize/2);

    //if ball missed the cursor
    if(dist > circleRadius + 2)
    {
        ballRadius = 100
    }


    //if angle is within circle section, and side of it is touching side of main circle
    if(dist >= circleRadius - ballRadius - lineWidth / 2 && ballAngle < circleSection.max && ballAngle > circleSection.min)
    {
        ballVelocity.x = -ballVelocity.x;
        ballVelocity.y = -ballVelocity.y;
    }
}

function keyboardInput(e)
{
    if(e.key == "a") ballPosition = {x:50,y:50}
    console.log(e)
}

function initEvents()
{
    //init keyboard input
    document.addEventListener('keydown', keyboardInput);
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", function(e) {mouseX = e.clientX; mouseY = e.clientY;})
}