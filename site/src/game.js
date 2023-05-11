const canvas = document.getElementById('canvasFrame'); //canvas
const context = canvas.getContext('2d'); //canvas context
const simSize = 1000; //simulated size of the game, the games physics, positiona and size are based off this, and scaled to match the canvas size
const viewport = document.documentElement; //viewport to make code a lil neater
const circleRadius = simSize * 0.3; //radius of circle
const lineWidth = 4; //width of the circle
const updateSpeed = 10; //ticks per second, higher value will cause more jittery gameplay, however ball speed should be preserved.
const heartImg = new Image(); //heart data so the image doesnt need to be loaded every call


var userX = canvas.height / 2;
var userY = canvas.width / 2;
var mouseX = 0; //mouse pos
var mouseY = 0; //mouse pso
var circleCover = 0.03; //percentage of the circle the cursor covers
var circleSection = {min: 0, max: 0}; //cursor
var balls = []; //all balls
var spawnRate = 1000; //how often a ball is spawned in ms
var ballSpawning = true; //determins whether balls should spawn
var playerHealth = 5 //how much health the player starts with, will be changed with different difficulty settings
var turrets = [] //all turrets

var playerData = 
{
    health: 7,
    score: 0,
    high_score: 0,
};

init();