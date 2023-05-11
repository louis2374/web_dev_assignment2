/*
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
var spawnRate = 1000; //how often a ball is spawned in ms
var ballSpawning = true; //determins whether balls should spawn

var points = [
]
*/
function init()
{
    //load heart
    heartImg.src = "../images/heart.png";


    resizeCanvas();
    initEvents();
    setInterval(mainLoop, updateSpeed);
    spawnBalls();

    
}

function initEvents()
{
    //init keyboard input
    document.addEventListener('keydown', keyboardInput);
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", function(e) {mouseX = e.clientX; mouseY = e.clientY;})
}

//loop that carries out all drawing / login processes
function mainLoop()
{
    //clear
    context.clearRect(0, 0, canvas.width, canvas.height);
    //draw main circle
    //non cursor area
    drawCircle(lineWidth, "#fdd", simSize/2, simSize/2, circleRadius, 0, Math.PI*2, false)

    drawCursor();
    drawBalls();
    ballsLogic();
    drawHealth();
    drawTurrets();
    turretLogic();
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

    console.log(Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y))

    //reduces spawn rate to make game harder over timer
    //should change this as its almost unnoticable, simple and boring
    spawnRate--;
    setTimeout(spawnBalls, spawnRate);
}

function ballsLogic()
{
    balls.forEach((ball, index) => {
        //move ball
        //velocity should be in pixels per second at 100% simsize
        //im not measuring delta time so this is only roughly accurate
        ball.pos.x += ball.velocity.x * updateSpeed / 1000;
        ball.pos.y += ball.velocity.y * updateSpeed / 1000;

        //distance to circle center
        let dist = Math.sqrt(Math.pow(ball.pos.x - simSize/2, 2) + Math.pow(ball.pos.y - simSize/2, 2));
    
        //get angle of ball to circle center
        let ballAngle = Math.atan2(ball.pos.y - simSize/2, ball.pos.x - simSize/2);
  
        //if ball was blocked
        let blocked = false;

        //check for cursor
        if (dist >= circleRadius - ball.radius - lineWidth / 2 &&
            dist - 3 <= circleRadius - ball.radius - lineWidth / 2)
        {
            //check if cursor blocks the ball
            //if it does, set it to blocked
            if(ballAngle < circleSection.max && ballAngle > circleSection.min)
            {
                blocked = true;
            }
        }

        //check for turrets
        turrets.forEach(turret =>
            {
                //check for cursor
                if (dist >= (circleRadius * turret.distance) - ball.radius - lineWidth / 2 &&
                    dist - 3 <= (circleRadius * turret.distance) - ball.radius - lineWidth / 2)
                {

                    //get turret sections
                    let turretSection = {min: turret.angle - turret.cover/2 * Math.PI * 2, max: turret.angle + turret.cover/2 * Math.PI * 2};

                    //check if turret blocks the ball
                    //if it set it to blocked
                    if(ballAngle < turretSection.max && ballAngle > turretSection.min)
                    {
                        blocked = true;
                    }
                }
            })
        
            if(blocked)
            {
                balls.splice(index, 1);
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
}

function keyboardInput(e)
{
    if(e.key == "a") addTurret(10, 0.4, 0.5, "#f00");

}

function drawHealth()
{
    let width = simSize / 10;

    //for number of health, print a heart, and move it right by the width of the img
    for(let i = 0; i < playerData.health; i++)
        context.drawImage(heartImg, scaleSize(width * i), scaleSize(0), scaleSize(width), scaleSize(width));
}

function drawTurrets()
{
    turrets.forEach(turret =>
        {
            //height = width
            let h = canvas.height / 2;

            //set turret section
            let turretSection = {min: turret.angle - turret.cover/2 * Math.PI * 2, max: turret.angle + turret.cover/2 * Math.PI * 2};

            //draw the arc
            drawCircle(lineWidth, "#111", simSize/2, simSize/2, circleRadius * turret.distance, turretSection.min, turretSection.max, false);
        })
}

function turretLogic()
{
    turrets.forEach(turret =>
        {
            //get increment depending on direction
            let increment = turret.direction ? turret.speed * 0.001 : turret.speed * -0.001;
            turret.angle += (increment);
        })
}

function addTurret(speed, cover, distance, color)
{
    turrets.push(
        {
            speed: speed,
            cover: cover,
            color: color,
            //percentage of the main circle radius
            distance: distance,
            angle: Math.random() * (Math.PI * 2),
            direction: false
        }
    )

    console.log("add");
}