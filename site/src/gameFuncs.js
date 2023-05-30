
function init()
{
    //load heart
    heartImg.src = "../images/heart.png";
    gunImg.src = "../images/gun.png";


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

    ballsLogic();
    drawBalls();

    drawHealth();
    drawGun();

    //check health
    if(playerData.health <= 0)
    {
        paused = true;
        if(playerData.score > playerData.high_score) playerData.high_score = playerData.score

        displayMenu();
    }

    //turretLogic();
    //drawTurrets();
}

function spawnBalls() {
    // if no balls should spawn, don't modify spawn rate and just return this function
    if (!ballSpawning || paused) return setTimeout(spawnBalls, spawnRate);

    

    // choose random angle
    let angle = (Math.PI * 2) * Math.random();
    let speed = baseSpeed + playerData.score;


    // starting vector is moving at ball speed directly upwards.
    let velocity = { x: 0, y: speed };

    // rotate this vector by angle
    velocity.x = velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle);
    velocity.y = velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle);

    //always moving right
    if(velocity.x > 0) velocity.x *= -2;

    balls.push({
        radius: 10,
        pos: { x: 7 * simSize / 10, y: simSize / 2 },
        velocity: { x: velocity.x, y: velocity.y },
        color: "#2a2",
        bounced: false
    });

    setTimeout(spawnBalls, (spawnRate * Math.random() )+ 0.5 );
}


function ballsLogic()
{
    if(paused) return;

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

        //normalize
        if(ballAngle < 0) ballAngle += Math.PI * 2;

        //if ball was blocked
        let blocked = false;

        //check for cursor
        if (dist >= circleRadius - ball.radius - lineWidth / 2 &&
            dist - killDistance <= circleRadius - ball.radius - lineWidth / 2)
        {
            //check if cursor blocks the ball
            //if it does, set it to blocked

            if(ballAngle < circleSection.max && ballAngle > circleSection.min)
            {
                blocked = true;
            }
            else
            {
                playerData.health-=1;
                balls.splice(index, 1);
            }
        }

        //check for turrets
        //only check if it is not already blocked by cursor
        if(!blocked)
        {


//CURRENTLY AN ERROR
//I have been trying to fix a small bug with the turret for ages, i need to come back and look at it at another time
//not sure if i will add them to the project as it has taken a very long time just for this bug.
/*
            turrets.forEach(turret =>
            {
                //-0.60 | 5.06 | 4.54
                //2.25 | 7.90 | 4.01



                //check for correct distance
                if (dist >= (circleRadius * turret.distance) - ball.radius - lineWidth / 2 &&
                    dist - killDistance <= (circleRadius * turret.distance) - ball.radius - lineWidth / 2)
                {
                    //get turret sections
                    let turretSection = {
                        min: turret.angle - turret.cover/2 * Math.PI * 2,
                        max: turret.angle + turret.cover/2 * Math.PI * 2
                    };


                    console.log("Turret min: " + turretSection.min.toFixed(2) + " | Turret max: " + turretSection.max.toFixed(2) + " | Ball Angle" + ballAngle.toFixed(2));
                    
                    //if it is outside turret
                    ball.color = "#f00"

                    //check if turret blocks the ball
                    if(turretSection.min < ballAngle && turretSection.max > ballAngle)
                    {
                        //blocked = true;
                        //if it is blocked
                        ball.color = "#0f0"
                    }
                    else ball.color = "#000"
                }
            })

*/
        }
        
        if(blocked)
        {
            balls.splice(index, 1);
            playerData.score+=1;
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
    context.fillStyle = color;
    context.arc(scaleSize(posX), scaleSize(posY), scaleSize(radius), radiansMax, radiansMin);
    solid ? context.fill() : context.stroke();
}

function drawCursor()
{
    if(paused) return;

    //height = width
    let h = canvas.height / 2;
    
    //get angle
    let angle = Math.atan2(mouseY - h, mouseX - h);

    //set circle section
    circleSection = {min: angle - circleCover/2 * Math.PI * 2, max: angle + circleCover/2 * Math.PI * 2};

    //normalize values to between 0 and 2PI
    if(circleSection.min < 0) circleSection.min += Math.PI * 2;
    if(circleSection.max < 0) circleSection.max += Math.PI * 2;

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
    if(e.key == "a") addTurret(1, 0.3, 0.5, "#f00");
    if(e.key == " ")
    {
        if(playerData.health > 0) paused = !paused;
        else
        {
            reset();
            paused = false;
        }
    }

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
            let increment = turret.direction ? turret.speed * (updateSpeed / 1000) : turret.speed * -(updateSpeed / 1000);
            turret.angle += (increment);
            
            //dont go negative / over full circle
            if(turret.angle > Math.PI * 2) turret.angle -= Math.PI * 2;
            if(turret.angle < 0) turret.angle += Math.PI * 2;

            //console.log("Turret angle: " + turret.angle);
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

function drawAngledLine(angle)
{
    x1 = scaleSize(simSize / 2);
    y1 = scaleSize(simSize / 2);
    r =  500;
    context.moveTo(x1, y1);
    context.lineTo(x1 + r * Math.cos(angle), y1 + r * Math.sin(angle));
    context.stroke();
}

function drawGun()
{
    let gunPos = { x: 2 * simSize / 3, y: simSize / 2 };
    let gunWidth = 300;
    let gunHeight = gunWidth * (gunImg.height / gunImg.width);
    
    context.drawImage(gunImg, scaleSize(gunPos.x), scaleSize(gunPos.y - (0.5 * gunHeight)), scaleSize(gunWidth), scaleSize(gunHeight));
}

function reset()
{
    //reset stats
    playerData.score = 0;
    playerData.health = 5;

    //remove all balls
    balls = [];
}

function displayMenu()
{
    //score
    context.fillStyle = "#000";
    context.font = "20px Arial";
    context.fillText("Score: " + playerData.score, 10, 30);

    //you died
    context.fillStyle = "#f00";
    context.font = "30px Arial";
    context.fillText("You Died", canvas.width / 2 - 60, canvas.height / 2 - 20);

    //play again
    context.fillStyle = "#000";
    context.font = "20px Arial";
    context.fillText("Press Space to Play Again", canvas.width / 2 - 120, canvas.height / 2 + 20);

    //high score
    context.fillStyle = "#000";
    context.font = "20px Arial";
    context.fillText("High Score: " + playerData.high_score, 10, canvas.height - 30);
}