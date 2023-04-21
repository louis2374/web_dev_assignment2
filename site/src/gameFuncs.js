const canvas = document.getElementById('canvasFrame');
const context = canvas.getContext('2d');
const simSize = 100;
const viewport = document.documentElement;
const circleRadius = 40;
const lineWidth = 4;

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
    setInterval(drawCursor, 10);
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



function drawCursor()
{
    //clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    //height = width
    let h = canvas.height / 2;

    //calc hypotenuse and opposite
    let hyp = Math.sqrt(Math.pow(h - mouseX, 2) + Math.pow(h - mouseY, 2));
    let op  = Math.abs(mouseY - h);
    
    //get angle
    let angle = Math.asin(op / hyp);

    //angle must be flipped for each corner as the angle is calculated using absolute values
    if (mouseX < h) angle = Math.PI - angle;
    if (mouseY < h) angle = 2 * Math.PI - angle;

    //draw the arc
    //all sizes are scaled

    //cursor area
    context.beginPath();
    context.lineWidth = scaleSize(lineWidth);
    context.strokeStyle = "#aaa";
    context.arc(canvas.width / 2, canvas.height / 2, scaleSize(circleRadius), angle + circleCover * Math.PI * 2, angle - circleCover * Math.PI * 2);
    context.stroke();

    //non cursor area
    context.beginPath();
    context.lineWidth = scaleSize(lineWidth);
    context.strokeStyle = "#111";
    context.arc(canvas.width / 2, canvas.height / 2, scaleSize(circleRadius), angle - circleCover * Math.PI * 2, angle + circleCover * Math.PI * 2);
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