const canvas = document.getElementById('canvasFrame'); //canvas
const context = canvas.getContext('2d'); //canvas context
const simSize = 1000; //simulated size of the game, the games physics, positiona and size are based off this, and scaled to match the canvas size
const viewport = document.documentElement; //viewport to make code a lil neater
const circleRadius = simSize * 0.3; //radius of circle
const lineWidth = 4; //width of the circle
const updateSpeed = 20; //ms per tick, higher value will cause more jittery gameplay, however ball speed should be preserved.
const heartImg = new Image(); //heart data
const gunImg = new Image(); //gun data
const killDistance = 30; //number of pixels the ball can go past a cursor or turret and still be killed

var userX = canvas.height / 2; //coords in which the users cursor rotates around
var userY = canvas.width / 2;
var mouseX = 0; //mouse pos updated every frame
var mouseY = 0; //mouse pos
var circleCover = 0.04; //percentage of the circle the cursor covers
var circleSection = {min: 0, max: 0}; //cursor
var balls = []; //all balls
var spawnRate = 2000; //how often a ball is spawned in ms
var ballSpawning = true; //determins whether balls should spawn
var turrets = [] //all turrets
var paused = false; //whether to pause the game
var baseSpeed = 100;

var playerData = //data about the player
{
    health: 7,
    score: 0,
    high_score: 0,
}; 

//called to start the game
init();