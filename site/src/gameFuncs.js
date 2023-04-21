const canvas = document.getElementById('canvasFrame');
const context = canvas.getContext('2d');
const simSize = 100;
const viewport = document.documentElement;
const circleRadius = 40;

let userX = canvas.height / 2;
let userY = canvas.width / 2;
let mouseX = 0;
let mouseY = 0;
let circleCover = 0.2
var obstacles = [];


function init()
{
    resizeCanvas();
    initEvents();
    initObjects();
    setInterval(draw, 10);
}

function scaleSize(num)
{
    return num * (canvas.height / simSize);
}

function initObjects()
{
    for (let i = 0; i < 5; i++)
    {
        obstacles = [];

        obstacles.push({
            x: Math.random() * canvas.height,
            y: Math.random() * canvas.width,
            width: 50,
            height: 50,
        });
    }
}

function resizeCanvas()
{
    canvas.width = viewport.clientHeight - 4;
    canvas.height = viewport.clientHeight - 4;
}



function draw()
{
    //clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    //context.fillStyle = 'red';
    //context.fillRect(scaleSize(userX), scaleSize(userY), scaleSize(50), scaleSize(50));
  
    //draw circle




    //get mouse pos
    
    let h = canvas.height / 2;

    let hyp = Math.sqrt(Math.pow(h - mouseX, 2) + Math.pow(h - mouseY, 2));
    let op = Math.abs(mouseY - h);

    if(mouseX < op) op = -op;
    
    let angle = Math.asin(op / hyp);

    console.log(op)



    context.beginPath();
    context.arc(canvas.width / 2, canvas.height / 2, scaleSize(circleRadius), angle + 3, angle - 3);
    context.stroke();

}

function keyboardInput(e)
{
    
}

function initEvents()
{
    //init keyboard input
    document.addEventListener('keydown', keyboardInput);
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", function(e) {mouseX = e.clientX; mouseY = e.clientY;})
}