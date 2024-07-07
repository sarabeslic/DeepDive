import {createObstacleCanvas} from "./script2canvas.js";
import { Layer } from "./classes/Layer.js";
import { Animal } from "./classes/Animal.js";
import { Diver } from "./classes/Diver.js";

//the DOM elements
const canvas = document.getElementById("canvas1");
export const ctx = canvas.getContext("2d"); //ctx is the context of the canvas first
export const obstacleCtx = createObstacleCanvas(canvas); //obstacleCtx is the context of the canvas second

//size of the canvas we will be seeing on the screen
const canvasWidth = canvas.width = 430;
const canvasHeight = canvas.height = 665;

const gameOver = document.getElementById("gameOver");
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");

const scoreDisplay = document.getElementById("score");
const label1 = document.getElementById("label");
const label2 = document.getElementById("label2");
const score2 = document.getElementById("score2")
const bar=document.getElementById("bar");

//declaring the variables for keeping track of the game state
let isGameOver = false;
let isGameStarted = false;


//an instance of the Diver class!, collising area smaller than the sprite for better gameplay
let diver = new Diver(40, 300, 75, 75, 'diver.png', 3, 33, 33);

// Keep track of animals
let animals = [];
let spawnInterval = 2000; // 2 seconds
let currentTime = 0;

//------------------------------------------------------------------------------------------------------
//BACKGROUNDS and MASK LAYER IMAGE 

const backgroundLayer4 = new Image();
backgroundLayer4.src = "4-layer2.png";

const backgroundLayer3 = new Image();
backgroundLayer3.src = "3-layer.png";

const backgroundLayer2 = new Image();
backgroundLayer2.src = "2-layer.png";

const backgroundObstacles = new Image();
backgroundObstacles.src = "ObstacleWalls.png";

export const backgroundMask = new Image();
backgroundMask.id = "collisionMask"; //obstacle mask user for pixel collision detection
backgroundMask.src = "ObstacleMask.png";

export let gameSpeed = 3;
let keyMultiplier = 1; // Multiplier set to 1 when no key is pressed


//CREATING THE LAYERS------------------------------------------------------------------------------------------------------------------------------
//create an instance of our class Layer, we pass the image and the speed of the layer
const layer4 = new Layer(backgroundLayer4, 0.0001);
const layer3 = new Layer(backgroundLayer3, 0.1);
const layer2 = new Layer(backgroundLayer2, 0.15);
const mask = new Layer(backgroundMask, 0.33);
const layer1 = new Layer(backgroundObstacles, 0.33);

//instead of calling seperately for each layer we put them in array
const gameLayers = [layer4, layer3, layer2, mask, layer1];

// Function to reset all layers
function resetLayers() {
    for (const layer of gameLayers) {
        layer.reset();
    }
}


//PIXEL COLISION FOR THE BACKGROUND MASK IMAGE---------------------------------------------------------------------------------------------------

mask.image.onload = function () {
    mask.willReadFrequently = true;
    //making sure the mask is drawn on the obstacle canvas!
};

//Collision for the obstacle (mask)--------------------------------------------------------------------------------------------------------------
function isCollidingWithObstacle() {
    //center the diver's position and then apply the collision area
    const x = diver.position.x + diver.width / 2;
    const y = diver.position.y + diver.height / 2;
    const collisionX = x - diver.collider.width / 2;
    const collisionY = y - diver.collider.height / 2;

    // Get the mask layer's position
    const maskX = mask.x;
    const maskY = mask.y;

    // Get the pixel data from the mask layer
    const maskData = obstacleCtx.getImageData(collisionX, collisionY, diver.collider.width, diver.collider.height).data;
    // Check if the current pixel is non-transparent in the obstacle mask
    //The pixel data is represented as an array of RGBA values (red, green, blue, alpha) 
    for (let i = 3; i < maskData.length; i += 4) { 
        if (maskData[i] !== 0) {//if the alpha value is not 0, then there is a collision
            gameOverScreen();
            console.log("Collision");
            return;
        }
    }
};

//COLLISION FOR THE SHARK------------------------------------------------------------------------------

function isCollidingWithShark() {
    // Center the diver's position
    const diverWidth = diver.width/2;
    const diverHeight = diver.height/2;
    const diverX = diver.position.x+diverWidth;
    const diverY = diver.position.y+diverHeight;
    

    // Check if the diver collides with animals from the third row, only 3 row!
    for (const animal of animals) {
        if (
            animal.row === 2 && // Check if the animal is from the third row
            diverX < animal.x + animal.spriteWidth/2 &&
            diverX + diverWidth > animal.x &&
            diverY < animal.y + animal.spriteHeight/2 &&
            diverY + diverHeight > animal.y
        ) {
            // Collision with the third row animal, trigger game over
            gameOverScreen();
            return;
        }
    }
};

//MOVEMENT----------------------------------------------------------------------------------------------------------------------------------

document.addEventListener('keydown', playerKeyDown);
document.addEventListener('keyup', playerKeyUp);

let isKeyPressed = false; // Flag to track key press state

let direction = ""; // The next direction to move

function playerKeyDown(event) {
    // Update the next direction based on the pressed key
    switch (event.key) {
        case 'ArrowUp':
            direction = 'up';
            break;
        case 'ArrowDown':
            direction = 'down';
            break;
        case 'ArrowLeft':
            direction = 'left';
            break;
        case 'ArrowRight':
            direction = ''; // No need to move right
            break;
    }
};

// Check if it's a continuous key press
if (!isKeyPressed) {
    isKeyPressed = true;
    increaseSpeed();
}

function increaseSpeed() {
    keyMultiplier = 1.5; // Increase the speed by 50%
}

function playerKeyUp(event) {
    // Reset the direction and key press state when the key is released
    direction = '';
    isKeyPressed = false;
    keyMultiplier = 1;
}

let increment = 1;
let score = 0;
let scoreAdding = increment * keyMultiplier;//score calculation based on the speed and the pixel movement

// Movement function
function movement() {
    let nextMovement = direction;
    switch (nextMovement) {
        case "up":
            diver.position.y -= increment * keyMultiplier;
            score += scoreAdding;
            break;
        case "left":
            // diver.position.x = diver.position.x; // No need to update when moving left
            break;
        case "down":
            diver.position.y += increment * keyMultiplier;
            score += scoreAdding;
            break;
        case "right":
            //diver.position.x;
            break;
        default:
            diver.position.y += 0.6;//if no key is pressed, the diver will move down as simulation of gravity
            score += 0.6;
            // No movement when the direction is not specified
            break;
    }
    scoreDisplay.innerHTML = Math.floor(score / 10);
    //round the score to the nearest full number
}

//  START GAME------------------------------------------------------------------------------------------------------------------------------

let highestScore = 0;

function startGame() {
    isGameStarted = true; // Set the game state to started
    startButton.style.display = "none";
    label1.style.visibility = "visible";
    label2.style.visibility = "visible";
    scoreDisplay.style.visibility = "visible";
    score2.style.visibility= "visible";
    canvas.style.backgroundImage = "none";
    canvas.style.backgroundColor = "#44f9de";
    bar.style.visibility="visible";

    // Display the highest score
    score2.innerHTML = highestScore;

    backgroundStart(); // Start the background layers with a delay of 300ms
    setTimeout(function () {
        animate(0);
    }, 300);
    score = 0;//reset the score
}

startButton.addEventListener("click", startGame);


function backgroundStart() { //we draw the background layers and the obstacles and the diver but animate in the animate function
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    obstacleCtx.clearRect(0, 0, canvasWidth, canvasHeight);

    gameLayers.forEach(layer => {
        layer.update();
        layer.draw();
    });
    diver.draw();
}

//function for drawing the backgrounds----------------------------------------------------------------------------GAME LOOP
let lastTime = 0;
slider.value=gameSpeed;

slider.addEventListener("change",function(e){
    gameSpeed=e.target.value; //change the game speed based on the slider value
});


function animate(timestamp) {
    // Delta time calculation
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    obstacleCtx.clearRect(0, 0, canvasWidth, canvasHeight);

    gameLayers.forEach(layer => {
        layer.update();
        layer.draw();
    });

    diver.draw();
    diver.update();

    if (mask.image.complete) {//only if the mask image is loaded, we check for collision
        isCollidingWithObstacle();
    }
    // Draw fish
        animals = animals.filter(animal => animal.isActive);
        animals.forEach(animal => {
            animal.update();
            animal.draw();
    });
    movement();
    // Spawn a new animal every 2 seconds
    if (currentTime > spawnInterval) {
        // Spawn a new fish
        currentTime = 0;
        createAnimal();
        
    } else {
        currentTime += deltaTime;
    } 

    isCollidingWithShark();

    if (!isGameOver) {//if the game is not over, we continue the animation
        requestAnimationFrame(animate);
    }
};

function createAnimal() {
    const animal = new Animal(//create an animal as an instance of the Animal class
        canvas.width,
        Math.random() * canvas.height - 200 * 0.5,
        Math.random() * 2 + 1, // Random speed between 1 and 3
        Math.floor(Math.random() * 4), // Random row between 0 and 3
        'animals.png'
    );
    animals.push(animal);
};

//GAME OVER------------------------------------------------------------------------------------------------------------------------------
function gameOverScreen() {
    isGameOver = true;
    gameOver.style.visibility = "visible";
    resetButton.style.display = "block";
    updateHighestScore(); // Update the highest score
};


function updateHighestScore() {
    let currentScore = parseInt(scoreDisplay.innerHTML, 10); // Parse the score to an integer
    
    if (currentScore > highestScore) {//if the current score is higher than the highest score, we update the highest score
        highestScore = currentScore;
        score2.innerHTML = highestScore;
    }
}
// Reset the game----------------------------------------------------------------------------------------------------------------------

function resetGame() {
    isGameOver = false;
    isGameStarted = true;
    gameOver.style.visibility = "hidden";
    resetButton.style.display = "none";
    diver.position.x = 40; // Reset the diver's position
    diver.position.y = 300;
    score = 0; // Reset the score

    animals = [];//resets animals

    resetLayers(); // Reset all layers
    backgroundStart();
    setTimeout(function () {
        animate(0);
    }, 300);
    score = 0;
};

resetButton.addEventListener("click", resetGame);


